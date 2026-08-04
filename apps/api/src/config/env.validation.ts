import { z } from "zod";

/**
 * Valida as variáveis de ambiente na inicialização (AGENTS §16). Falhar cedo é
 * melhor que descobrir um secret ausente numa requisição de auth.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  API_PORT: z.coerce.number().int().positive().default(3001),
  CORS_ORIGIN: z.string().min(1).default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória."),

  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET curto demais."),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET curto demais."),
  JWT_ACCESS_TTL: z
    .string()
    .regex(/^\d+[smhd]$/)
    .default("15m"),
  JWT_REFRESH_TTL: z
    .string()
    .regex(/^\d+[smhd]$/)
    .default("30d"),
  JWT_ISSUER: z.string().min(1).default("tally-api"),
  JWT_AUDIENCE: z.string().min(1).default("tally-web"),

  COOKIE_DOMAIN: z.string().optional(),

  // OAuth (ADR-0008): a API é a autoridade; providers são opcionais — sem
  // credenciais, os endpoints sociais respondem 501 e o resto segue funcionando.
  API_PUBLIC_URL: z.string().url().default("http://localhost:3001"),
  WEB_APP_URL: z.string().url().default("http://localhost:3000"),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  AUTH_GITHUB_ID: z.string().optional(),
  AUTH_GITHUB_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Variáveis de ambiente inválidas:\n${issues}`);
  }

  return result.data;
}
