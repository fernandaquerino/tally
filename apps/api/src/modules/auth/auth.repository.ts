import { Injectable } from "@nestjs/common";
import type { HouseholdRole, Prisma, RefreshToken, User } from "@tally/db";

import { PrismaService } from "../../prisma/prisma.service.js";

export interface CreatedUser {
  user: User;
  householdId: string;
  role: HouseholdRole;
}

export interface NewRefreshTokenData {
  userId: string;
  familyId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent?: string;
  ip?: string;
}

/** Usuário com o vínculo de household primário (MVP: 1 membership por usuário). */
export type UserWithMembership = Prisma.UserGetPayload<{
  include: { memberships: true };
}>;

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria usuário + household + membership OWNER atomicamente (ADR-0008 §Cadastro).
   * Falha em qualquer etapa desfaz tudo. `email` único é garantido no banco.
   */
  async createUserWithHousehold(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<CreatedUser> {
    return this.prisma.$transaction(async (tx) => {
      const household = await tx.household.create({
        data: { name: `Casa de ${data.name}` },
      });
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash: data.passwordHash,
        },
      });

      await tx.householdMember.create({
        data: {
          householdId: household.id,
          userId: user.id,
          role: "OWNER",
        },
      });

      return { user, householdId: household.id, role: "OWNER" };
    });
  }

  findUserByEmail(email: string): Promise<UserWithMembership | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { memberships: true },
    });
  }

  findUserById(id: string): Promise<UserWithMembership | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { memberships: true },
    });
  }

  createRefreshToken(data: NewRefreshTokenData): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({ data });
  }

  findRefreshTokenByHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({ where: { tokenHash } });
  }

  /**
   * Rotação transacional (ADR-0008): revoga o token atual, liga-o ao sucessor e
   * cria o novo na mesma família — tudo num único commit.
   */
  async rotateRefreshToken(
    currentId: string,
    next: NewRefreshTokenData,
  ): Promise<RefreshToken> {
    return this.prisma.$transaction(async (tx) => {
      const created = await tx.refreshToken.create({ data: next });

      await tx.refreshToken.update({
        where: { id: currentId },
        data: { revokedAt: new Date(), replacedById: created.id },
      });

      return created;
    });
  }

  /** Revoga todos os refresh tokens ativos da família (reuse/logout). */
  async revokeFamily(familyId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
