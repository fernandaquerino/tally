import { randomUUID } from "node:crypto";

import {
  createPrismaClient,
  type HouseholdMember,
  type PrismaClient,
} from "@tally/db";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { AuthRepository } from "../../modules/auth/auth.repository.js";
import type { PrismaService } from "../../prisma/prisma.service.js";
import { TenantScopedRepository } from "./tenant-scoped.repository.js";

/**
 * Prova A/B de IDOR (AGENTS §18, gate técnico mais importante do app). Semeia
 * dois households e verifica que um repositório scoped nunca cruza o tenant,
 * mesmo quando o `householdId` é forjado no filtro. Usa a tabela real
 * `household_members` (já isolada por household) como cobaia.
 *
 * Só roda quando há banco (`TEST_DATABASE_URL`); no CI o serviço Postgres é
 * provido. Sem banco, o bloco é pulado para não quebrar ambientes locais.
 */
const DATABASE_URL = process.env.TEST_DATABASE_URL;

/** Repositório de teste que lê membros scoped ao household via `scope`. */
class MembersRepository extends TenantScopedRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  listMembers(
    householdId: string,
    where?: { householdId?: string },
  ): Promise<HouseholdMember[]> {
    return this.prisma.householdMember.findMany({
      where: this.scope(householdId, where),
    });
  }
}

describe.skipIf(!DATABASE_URL)("TenantScopedRepository (IDOR A/B)", () => {
  let prisma: PrismaClient;
  let members: MembersRepository;

  const suffix = randomUUID().slice(0, 8);
  const emailA = `tenancy-a-${suffix}@example.com`;
  const emailB = `tenancy-b-${suffix}@example.com`;

  let householdA: string;
  let householdB: string;
  let userA: string;
  let userB: string;

  beforeAll(async () => {
    prisma = createPrismaClient(DATABASE_URL as string);
    await prisma.$connect();

    const authRepo = new AuthRepository(prisma as unknown as PrismaService);
    members = new MembersRepository(prisma as unknown as PrismaService);

    const a = await authRepo.createUserWithHousehold({
      name: "Usuário A",
      email: emailA,
      passwordHash: "hash-a",
    });
    const b = await authRepo.createUserWithHousehold({
      name: "Usuário B",
      email: emailB,
      passwordHash: "hash-b",
    });

    householdA = a.householdId;
    householdB = b.householdId;
    userA = a.user.id;
    userB = b.user.id;
  });

  afterAll(async () => {
    // Cascade de household → members; usuários precisam de delete próprio.
    await prisma.household.deleteMany({
      where: { id: { in: [householdA, householdB] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [userA, userB] } },
    });
    await prisma.$disconnect();
  });

  it("A só enxerga o próprio membro, nunca o do household B", async () => {
    const result = await members.listMembers(householdA);

    expect(result).toHaveLength(1);
    expect(result[0]?.userId).toBe(userA);
    expect(result.some((m) => m.userId === userB)).toBe(false);
  });

  it("forjar o householdId de B no filtro não vaza dados de B", async () => {
    // Cliente tenta forçar o tenant de B; o scope da sessão (A) sobrescreve.
    const result = await members.listMembers(householdA, {
      householdId: householdB,
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.userId).toBe(userA);
  });

  it("cada household vê exatamente o seu membro", async () => {
    const fromB = await members.listMembers(householdB);

    expect(fromB).toHaveLength(1);
    expect(fromB[0]?.userId).toBe(userB);
  });
});
