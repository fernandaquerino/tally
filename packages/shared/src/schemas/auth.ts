import { z } from "zod";

/**
 * Schemas de autenticação compartilhados entre web e API (ADR-0008).
 *
 * Reusar os MESMOS schemas no formulário (react-hook-form) e na validação do
 * backend evita regras divergentes. O backend continua sendo a fonte final.
 */

/** E-mail normalizado (trim + lowercase) para evitar duplicidade por caixa. */
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Informe seu e-mail.")
  .email("E-mail inválido.");

/**
 * Senha mínima do MVP: 8+ caracteres. A força real é reforçada por argon2id no
 * backend; aqui garantimos um piso sem virar formulário de banco.
 */
const passwordSchema = z
  .string()
  .min(8, "A senha precisa ter ao menos 8 caracteres.")
  .max(200, "Senha longa demais.");

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome.").max(120),
  email: emailSchema,
  password: passwordSchema,
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe sua senha."),
});
export type LoginInput = z.infer<typeof loginSchema>;
