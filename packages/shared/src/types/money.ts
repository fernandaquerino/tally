/**
 * Valor monetário representado como inteiro de centavos (ADR-0006).
 *
 * Dinheiro trafega sempre em centavos (`bigint`) e só é formatado na borda
 * (ver `@tally/shared/money`). Nunca use `number` de ponto flutuante para dinheiro.
 */
export type MoneyCents = bigint;
