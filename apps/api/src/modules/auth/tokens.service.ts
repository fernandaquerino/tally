import { createHash, randomBytes, randomUUID } from "node:crypto";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { HouseholdRole } from "@tally/db";
import type { CookieOptions, Response } from "express";

import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  REFRESH_COOKIE_PATH,
  REFRESH_TOKEN_BYTES,
  SESSION_HINT_COOKIE,
} from "./auth.constants.js";

export interface AccessTokenSubject {
  userId: string;
  householdId: string;
  role: HouseholdRole;
}

export interface GeneratedRefreshToken {
  /** Valor em claro — vai só para o cookie, nunca para o banco. */
  token: string;
  /** Hash determinístico persistido para busca/comparação. */
  tokenHash: string;
  expiresAt: Date;
}

const DURATION_PATTERN = /^(\d+)([smhd])$/;
const DURATION_UNIT_MS: Record<string, number> = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

@Injectable()
export class TokensService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /** Assina o access token JWT com as claims mínimas (ADR-0008). */
  async signAccessToken(subject: AccessTokenSubject): Promise<string> {
    return this.jwt.signAsync(
      {
        householdId: subject.householdId,
        role: subject.role,
      },
      {
        subject: subject.userId,
        jwtid: randomUUID(),
        secret: this.config.getOrThrow<string>("JWT_ACCESS_SECRET"),
        // segundos (evita depender do tipo `StringValue` de `ms`).
        expiresIn: Math.floor(
          this.parseDurationMs(
            this.config.getOrThrow<string>("JWT_ACCESS_TTL"),
          ) / 1000,
        ),
        issuer: this.config.getOrThrow<string>("JWT_ISSUER"),
        audience: this.config.getOrThrow<string>("JWT_AUDIENCE"),
      },
    );
  }

  /** Gera um refresh token opaco de alta entropia + seu hash determinístico. */
  generateRefreshToken(): GeneratedRefreshToken {
    const token = randomBytes(REFRESH_TOKEN_BYTES).toString("base64url");
    const ttlMs = this.parseDurationMs(
      this.config.getOrThrow<string>("JWT_REFRESH_TTL"),
    );

    return {
      token,
      tokenHash: this.hashRefreshToken(token),
      expiresAt: new Date(Date.now() + ttlMs),
    };
  }

  /** Hash determinístico (SHA-256) — não usar argon2 aqui (ADR-0008). */
  hashRefreshToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    const refreshMaxAge = this.parseDurationMs(
      this.config.getOrThrow<string>("JWT_REFRESH_TTL"),
    );

    res.cookie(ACCESS_COOKIE, accessToken, {
      ...this.baseCookieOptions(),
      path: "/",
      maxAge: this.parseDurationMs(
        this.config.getOrThrow<string>("JWT_ACCESS_TTL"),
      ),
    });
    res.cookie(REFRESH_COOKIE, refreshToken, {
      ...this.baseCookieOptions(),
      path: REFRESH_COOKIE_PATH,
      maxAge: refreshMaxAge,
    });
    // Dica de sessão legível pelo middleware; não é httpOnly e não tem segredo.
    res.cookie(SESSION_HINT_COOKIE, "1", {
      httpOnly: false,
      secure: this.config.get<string>("NODE_ENV") === "production",
      sameSite: "lax",
      path: "/",
      maxAge: refreshMaxAge,
      ...this.domainOption(),
    });
  }

  clearAuthCookies(res: Response): void {
    const options = this.baseCookieOptions();

    res.clearCookie(ACCESS_COOKIE, { ...options, path: "/" });
    res.clearCookie(REFRESH_COOKIE, { ...options, path: REFRESH_COOKIE_PATH });
    res.clearCookie(SESSION_HINT_COOKIE, {
      httpOnly: false,
      secure: this.config.get<string>("NODE_ENV") === "production",
      sameSite: "lax",
      path: "/",
      ...this.domainOption(),
    });
  }

  private baseCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.config.get<string>("NODE_ENV") === "production",
      sameSite: "lax",
      ...this.domainOption(),
    };
  }

  private domainOption(): Pick<CookieOptions, "domain"> {
    const domain = this.config.get<string>("COOKIE_DOMAIN");

    // host-only por padrão; domínio só quando explicitamente configurado.
    return domain ? { domain } : {};
  }

  private parseDurationMs(input: string): number {
    const match = DURATION_PATTERN.exec(input.trim());
    const unit = match?.[2];

    if (!match || !unit || DURATION_UNIT_MS[unit] === undefined) {
      throw new Error(
        `Duração inválida: "${input}". Use formato como "15m", "30d".`,
      );
    }

    return Number(match[1]) * DURATION_UNIT_MS[unit];
  }
}
