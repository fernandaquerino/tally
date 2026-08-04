import { config as loadEnv } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Carrega o .env do pacote (se existir) e o da raiz do monorepo.
loadEnv({ path: [".env", "../../.env"] });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
