import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Carrega o .env do pacote (se existir) e o da raiz do monorepo.
loadEnv({ path: [".env", "../../.env"] });

// `prisma generate`/`validate` não conectam ao banco, mas o config é avaliado
// no load — usar `env("DATABASE_URL")` quebraria o CI (sem a variável). Só os
// comandos de `migrate`/`studio` precisam da URL real, que sempre vem do ambiente.
const PLACEHOLDER_DATABASE_URL =
  "postgresql://user:password@localhost:5432/tally";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? PLACEHOLDER_DATABASE_URL,
  },
});
