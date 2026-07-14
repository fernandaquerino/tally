import { z } from "zod";

/**
 * Centavos em transporte: string de dígitos (ADR-0006), convertida para `bigint`.
 *
 * A API serializa centavos como string para não perder precisão; este schema
 * valida e faz o parse seguro (sem `parseFloat`).
 */
export const moneyCentsSchema = z
  .string()
  .regex(/^-?\d+$/, "Centavos devem ser um inteiro em string")
  .transform((value) => BigInt(value));
