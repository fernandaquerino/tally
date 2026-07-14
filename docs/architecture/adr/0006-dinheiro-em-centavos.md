# ADR-0006: Dinheiro como inteiro em centavos (bigint)

**Status:** Aceito · **Data:** 2026-07-13

## Contexto

Float em dinheiro produz erros de arredondamento (0.1 + 0.2 ≠ 0.3). Em app financeiro, um centavo divergente destrói confiança (princípio 6 de design).

## Opções

- **A: float/double** — descartada (arredondamento).
- **B: decimal/numeric no banco + Decimal.js** — correta, porém tipos Decimal do Prisma são objetos incômodos no TS e serializam mal em JSON.
- **C: inteiro em centavos, bigint (escolhida)** — aritmética exata nativa; `amount_cents: 500000` = R$ 5.000,00; formatação só na borda (Intl.NumberFormat).

## Decisão

`bigint` centavos em todo o backend e API (JSON como string quando exceder Number.MAX_SAFE_INTEGER — na prática valores pessoais cabem em number, mas o contrato da API define string para segurança). Utilitários em `@tally/shared/money`: parse, format, split proporcional com **resto na última parcela** (invariante 5).

## Consequências

- Fica mais fácil: igualdade exata, testes, reconciliação.
- Fica mais difícil: lembrar de converter na borda (lint rule proibindo `parseFloat` em contexto de dinheiro).
- Revisitar quando: multi-moeda (v3+): acrescenta `currency` + minor units por moeda; a base em inteiro continua válida.
