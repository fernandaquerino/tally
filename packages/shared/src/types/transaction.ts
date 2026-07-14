/**
 * Tipo de transação (domain-model): entrada, saída ou transferência
 * (par de pernas ligadas por `transfer_id`).
 */
export type TransactionType = "income" | "expense" | "transfer";

/** Valores possíveis de {@link TransactionType}, para iteração/validação. */
export const TRANSACTION_TYPES = [
  "income",
  "expense",
  "transfer",
] as const satisfies readonly TransactionType[];
