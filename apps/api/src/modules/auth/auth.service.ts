import { randomUUID } from "node:crypto";

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Prisma } from "@tally/db";
import type { LoginInput, RegisterInput } from "@tally/shared";
import argon2 from "argon2";

import { AuthRepository } from "./auth.repository.js";
import { toPublicUser, type PublicUser } from "./dto/public-user.js";
import { TokensService, type AccessTokenSubject } from "./tokens.service.js";

export interface RequestMeta {
  userAgent?: string;
  ip?: string;
}

/** Resultado de um login/registro/refresh: usuário + tokens para os cookies. */
export interface SessionResult {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly tokens: TokensService,
  ) {}

  async register(
    input: RegisterInput,
    meta: RequestMeta,
  ): Promise<SessionResult> {
    const passwordHash = await argon2.hash(input.password, {
      type: argon2.argon2id,
    });

    let created;
    try {
      created = await this.repo.createUserWithHousehold({
        name: input.name,
        email: input.email,
        passwordHash,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        // Não confirma existência do e-mail (anti-enumeração, ADR-0008).
        throw new ConflictException({
          code: "REGISTRATION_FAILED",
          message: "Não foi possível concluir o cadastro.",
        });
      }
      throw error;
    }

    return this.issueSession(
      {
        userId: created.user.id,
        householdId: created.householdId,
        role: created.role,
      },
      created.user,
      randomUUID(),
      meta,
    );
  }

  async login(input: LoginInput, meta: RequestMeta): Promise<SessionResult> {
    const invalid = new UnauthorizedException({
      code: "INVALID_CREDENTIALS",
      message: "E-mail ou senha inválidos.",
    });

    const user = await this.repo.findUserByEmail(input.email);
    if (!user?.passwordHash) {
      throw invalid;
    }

    const passwordOk = await argon2.verify(user.passwordHash, input.password);
    if (!passwordOk) {
      throw invalid;
    }

    const membership = user.memberships[0];
    if (!membership) {
      throw invalid;
    }

    return this.issueSession(
      {
        userId: user.id,
        householdId: membership.householdId,
        role: membership.role,
      },
      user,
      randomUUID(),
      meta,
    );
  }

  /**
   * Rotaciona o refresh token. Reuso de um token já revogado revoga toda a
   * família e força novo login (ADR-0008 §Refresh token e rotação).
   */
  async refresh(rawToken: string, meta: RequestMeta): Promise<SessionResult> {
    const invalid = new UnauthorizedException({
      code: "INVALID_SESSION",
      message: "Sessão inválida.",
    });

    const record = await this.repo.findRefreshTokenByHash(
      this.tokens.hashRefreshToken(rawToken),
    );
    if (!record) {
      throw invalid;
    }

    if (record.revokedAt) {
      // Reuse detection: alguém apresentou um token já rotacionado.
      await this.repo.revokeFamily(record.familyId);
      throw invalid;
    }

    if (record.expiresAt.getTime() <= Date.now()) {
      throw invalid;
    }

    const user = await this.repo.findUserById(record.userId);
    const membership = user?.memberships[0];
    if (!user || !membership) {
      throw invalid;
    }

    const nextRefresh = this.tokens.generateRefreshToken();
    await this.repo.rotateRefreshToken(record.id, {
      userId: record.userId,
      familyId: record.familyId,
      tokenHash: nextRefresh.tokenHash,
      expiresAt: nextRefresh.expiresAt,
      ...meta,
    });

    const accessToken = await this.tokens.signAccessToken({
      userId: user.id,
      householdId: membership.householdId,
      role: membership.role,
    });

    return {
      user: toPublicUser(user, membership.householdId, membership.role),
      accessToken,
      refreshToken: nextRefresh.token,
    };
  }

  /** Logout idempotente: revoga a família do refresh apresentado, se houver. */
  async logout(rawToken: string | undefined): Promise<void> {
    if (!rawToken) {
      return;
    }

    const record = await this.repo.findRefreshTokenByHash(
      this.tokens.hashRefreshToken(rawToken),
    );
    if (record) {
      await this.repo.revokeFamily(record.familyId);
    }
  }

  async me(userId: string): Promise<PublicUser> {
    const user = await this.repo.findUserById(userId);
    const membership = user?.memberships[0];
    if (!user || !membership) {
      throw new UnauthorizedException({
        code: "UNAUTHENTICATED",
        message: "Sessão inválida.",
      });
    }

    return toPublicUser(user, membership.householdId, membership.role);
  }

  private async issueSession(
    subject: AccessTokenSubject,
    user: Pick<PublicUser, "id" | "name" | "email">,
    familyId: string,
    meta: RequestMeta,
  ): Promise<SessionResult> {
    const accessToken = await this.tokens.signAccessToken(subject);
    const refresh = this.tokens.generateRefreshToken();

    await this.repo.createRefreshToken({
      userId: subject.userId,
      familyId,
      tokenHash: refresh.tokenHash,
      expiresAt: refresh.expiresAt,
      ...meta,
    });

    return {
      user: toPublicUser(user, subject.householdId, subject.role),
      accessToken,
      refreshToken: refresh.token,
    };
  }
}
