/**
 * Utilitários de dinheiro em centavos (ADR-0006).
 *
 * Regras:
 * - Dinheiro é sempre um inteiro de centavos (`bigint`, {@link MoneyCents}).
 * - Nenhum helper usa `parseFloat` — parsing é feito por manipulação de string
 *   + `BigInt`, garantindo aritmética exata.
 * - Formatação acontece só na borda, via `Intl.NumberFormat`.
 */

import type { MoneyCents } from "@tally/shared/types";

const CENTS_PER_UNIT = 100n;
const DEFAULT_LOCALE = "pt-BR";
const DEFAULT_CURRENCY = "BRL";

/** Zero em centavos, tipado como {@link MoneyCents}. */
export const ZERO_CENTS: MoneyCents = 0n;

export interface ParseMoneyOptions {
  /**
   * Separador decimal esperado na entrada. Padrão `","` (pt-BR); o outro
   * caractere (`.`) é tratado como separador de milhar.
   */
  decimalSeparator?: "," | ".";
}

/**
 * Converte uma string monetária "humana" em centavos, sem `parseFloat`.
 *
 * Aceita símbolo de moeda, espaços e separadores de milhar. Exemplos (pt-BR):
 * `"R$ 1.234,56"` -> `123456n`, `"10"` -> `1000n`, `"-5,5"` -> `-550n`.
 *
 * @throws {RangeError} entrada vazia, inválida ou com mais de 2 casas decimais.
 */
export function parseDecimalToCents(
  input: string,
  options: ParseMoneyOptions = {},
): MoneyCents {
  if (typeof input !== "string") {
    throw new TypeError("parseDecimalToCents espera uma string");
  }

  const decimalSep = options.decimalSeparator ?? ",";
  const thousandSep = decimalSep === "," ? "." : ",";

  let body = input.trim();
  if (body === "") {
    throw new RangeError("Valor monetário vazio");
  }

  // Sinal.
  let sign = 1n;
  if (body.startsWith("-")) {
    sign = -1n;
    body = body.slice(1);
  } else if (body.startsWith("+")) {
    body = body.slice(1);
  }

  // Remove símbolo de moeda e espaços (`\s` já cobre o NBSP das saídas de Intl).
  body = body.replace(/[R$\s]/g, "");
  // Remove separadores de milhar.
  body = body.split(thousandSep).join("");

  const parts = body.split(decimalSep);
  if (parts.length > 2) {
    throw new RangeError(`Valor monetário inválido: "${input}"`);
  }

  let intPart = parts[0] ?? "";
  const fracPart = parts[1] ?? "";

  if (!/^\d*$/.test(intPart) || !/^\d*$/.test(fracPart)) {
    throw new RangeError(`Valor monetário inválido: "${input}"`);
  }
  if (intPart === "" && fracPart === "") {
    throw new RangeError(`Valor monetário inválido: "${input}"`);
  }
  if (fracPart.length > 2) {
    throw new RangeError(`Centavos com mais de 2 casas decimais: "${input}"`);
  }

  if (intPart === "") intPart = "0";
  const cents = BigInt(intPart) * CENTS_PER_UNIT + BigInt(fracPart.padEnd(2, "0"));
  return sign * cents;
}

/**
 * Converte um valor de transporte (centavos como `string`, `number` inteiro
 * seguro ou `bigint`) em {@link MoneyCents}, sem `parseFloat`.
 *
 * A API serializa centavos como string para não perder precisão (ADR-0006);
 * use este helper ao ler o payload.
 *
 * @throws {RangeError} valor não-inteiro, fora do intervalo seguro ou malformado.
 */
export function parseCents(value: string | number | bigint): MoneyCents {
  if (typeof value === "bigint") {
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isInteger(value)) {
      throw new RangeError(`Centavos devem ser inteiros: ${value}`);
    }
    if (!Number.isSafeInteger(value)) {
      throw new RangeError(`Centavos fora do intervalo seguro: ${value}`);
    }
    return BigInt(value);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!/^[+-]?\d+$/.test(trimmed)) {
      throw new RangeError(`Centavos inválidos: "${value}"`);
    }
    return BigInt(trimmed);
  }
  throw new TypeError("parseCents espera string, number ou bigint");
}

/** Serializa centavos como string, para transporte em JSON (ADR-0006). */
export function serializeCents(cents: MoneyCents): string {
  return cents.toString();
}

export interface FormatMoneyOptions {
  /** BCP-47 locale. Padrão `"pt-BR"`. */
  locale?: string;
  /** Código ISO-4217 da moeda. Padrão `"BRL"`. */
  currency?: string;
  /** Exibição do sinal, repassado a `Intl.NumberFormat`. */
  signDisplay?: Intl.NumberFormatOptions["signDisplay"];
}

/**
 * Formata centavos como texto de moeda, na borda, via `Intl.NumberFormat`.
 *
 * Exemplo: `formatCents(123456n)` -> `"R$ 1.234,56"`.
 */
export function formatCents(
  cents: MoneyCents,
  options: FormatMoneyOptions = {},
): string {
  const {
    locale = DEFAULT_LOCALE,
    currency = DEFAULT_CURRENCY,
    signDisplay,
  } = options;

  // Divisão por 100 só na borda de formatação; `Intl` arredonda para 2 casas,
  // então o erro de ponto flutuante é irrelevante para valores pessoais.
  const value = Number(cents) / 100;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    signDisplay,
  }).format(value);
}

/** Soma centavos, mantendo aritmética exata em `bigint`. */
export function sumCents(values: Iterable<MoneyCents>): MoneyCents {
  let total = 0n;
  for (const value of values) {
    total += value;
  }
  return total;
}

/**
 * Divide um total em `parts` parcelas iguais, deixando o resto de centavos na
 * **última** parcela (invariante 5). A soma das parcelas é sempre igual ao total.
 *
 * @throws {RangeError} `parts` não é inteiro positivo.
 */
export function splitEvenly(total: MoneyCents, parts: number): MoneyCents[] {
  if (!Number.isInteger(parts) || parts <= 0) {
    throw new RangeError(`Número de parcelas inválido: ${parts}`);
  }

  const n = BigInt(parts);
  const base = total / n; // Divisão de bigint trunca em direção a zero.
  const result: MoneyCents[] = [];
  let allocated = 0n;
  for (let i = 0; i < parts - 1; i += 1) {
    result.push(base);
    allocated += base;
  }
  result.push(total - allocated); // Resto na última parcela.
  return result;
}

/**
 * Divide um total proporcionalmente a `weights` (inteiros não-negativos),
 * deixando o resto na **última** fatia (invariante 5). A soma é sempre igual
 * ao total.
 *
 * @throws {RangeError} lista vazia, peso inválido ou soma de pesos <= 0.
 */
export function splitProportional(
  total: MoneyCents,
  weights: readonly (bigint | number)[],
): MoneyCents[] {
  if (weights.length === 0) {
    throw new RangeError("splitProportional requer ao menos um peso");
  }

  const normalized = weights.map((weight, index) => {
    if (typeof weight === "number") {
      if (!Number.isInteger(weight) || !Number.isSafeInteger(weight)) {
        throw new RangeError(`Peso inválido no índice ${index}: ${weight}`);
      }
    }
    const value = BigInt(weight);
    if (value < 0n) {
      throw new RangeError(`Peso negativo no índice ${index}: ${weight}`);
    }
    return value;
  });

  const totalWeight = normalized.reduce((acc, weight) => acc + weight, 0n);
  if (totalWeight <= 0n) {
    throw new RangeError("A soma dos pesos deve ser maior que zero");
  }

  const result: MoneyCents[] = [];
  let allocated = 0n;
  for (let i = 0; i < normalized.length - 1; i += 1) {
    // Trunca em direção a zero; o resto acumulado vai para a última fatia.
    const share = (total * normalized[i]!) / totalWeight;
    result.push(share);
    allocated += share;
  }
  result.push(total - allocated); // Resto na última fatia.
  return result;
}
