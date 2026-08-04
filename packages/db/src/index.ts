/**
 * `@tally/db` — dono do schema Prisma e do client gerado.
 *
 * Centraliza o acesso ao PostgreSQL: a API o consome via `PrismaService` e o
 * seed importa o mesmo client. Nenhuma outra camada deve instanciar Prisma
 * diretamente (AGENTS §14: "reutilize PrismaService").
 */
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "./generated/client/client.ts";

export * from "./generated/client/client.ts";
export { PrismaPg } from "@prisma/adapter-pg";

/**
 * Cria um `PrismaClient` já ligado ao PostgreSQL via adapter `pg`.
 * `connectionString` deve vir de `DATABASE_URL` (validada na borda de quem chama).
 */
export function createPrismaClient(connectionString: string): PrismaClient {
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
}
