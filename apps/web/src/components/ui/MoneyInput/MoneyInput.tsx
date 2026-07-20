"use client";

import type { MoneyCents } from "@tally/shared";
import { type ChangeEvent, useState } from "react";

import { Input, type InputProps } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

export type MoneyInputProps = DistributiveOmit<
  InputProps,
  "prefix" | "value" | "defaultValue" | "onChange"
> & {
  transactionType?: "income" | "expense";
  /** Valor em centavos (bigint). `undefined` = campo vazio. */
  value?: MoneyCents;
  /** Valor inicial em centavos, para uso não-controlado. */
  defaultValue?: MoneyCents;
  onValueChange?: (value: MoneyCents | undefined) => void;
};

/**
 * Formata centavos como `"1.250,00"` (sem símbolo — o `R$` é prefixo do Input).
 * Feito só com `bigint` + `Intl` na parte inteira: nenhum `float` no caminho.
 */
function formatCentsToDisplay(cents: MoneyCents): string {
  const negative = cents < 0n;
  const abs = negative ? -cents : cents;
  const reais = new Intl.NumberFormat("pt-BR").format(abs / 100n);
  const centavos = (abs % 100n).toString().padStart(2, "0");
  return `${negative ? "-" : ""}${reais},${centavos}`;
}

export function MoneyInput({
  className,
  inputMode,
  transactionType,
  value,
  defaultValue,
  onValueChange,
  ...props
}: MoneyInputProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<MoneyCents | undefined>(
    defaultValue,
  );
  const currentValue = isControlled ? value : internalValue;

  const displayValue =
    currentValue === undefined ? "" : formatCentsToDisplay(currentValue);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    // Acumulador de dígitos: cada dígito digitado é um centavo.
    const digits = event.target.value.replace(/\D/g, "");
    const next = digits === "" ? undefined : BigInt(digits);

    if (!isControlled) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  }

  return (
    <Input
      className={cn(
        "font-mono text-lg font-semibold tabular-nums",
        transactionType === "income" && "text-income",
        transactionType === "expense" && "text-expense",
        className,
      )}
      inputMode={inputMode ?? "decimal"}
      prefix="R$"
      value={displayValue}
      onChange={handleChange}
      {...props}
    />
  );
}
