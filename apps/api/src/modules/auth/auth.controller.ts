import { randomUUID } from "node:crypto";

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Throttle } from "@nestjs/throttler";
import { loginSchema, registerSchema } from "@tally/shared";
import type { LoginInput, RegisterInput } from "@tally/shared";
import type { CookieOptions, Request, Response } from "express";

import { OriginGuard } from "../../common/guards/origin.guard.js";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe.js";
import {
  OAUTH_STATE_COOKIE,
  OAUTH_STATE_COOKIE_PATH,
  OAUTH_STATE_TTL_MS,
  REFRESH_COOKIE,
  type LoginMethod,
} from "./auth.constants.js";
import { AuthService, type RequestMeta } from "./auth.service.js";
import type { PublicUser } from "./dto/public-user.js";
import { OAuthService } from "./oauth/oauth.service.js";
import { isOAuthProvider, type OAuthProvider } from "./oauth/oauth.types.js";
import { TokensService } from "./tokens.service.js";

// Rate limit estrito nos endpoints de credencial (threat-model S/D).
const AUTH_THROTTLE = { limit: 5, ttl: 60_000 };

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly auth: AuthService,
    private readonly tokens: TokensService,
    private readonly oauth: OAuthService,
    private readonly config: ConfigService,
  ) {}

  @Post("register")
  @Throttle({ default: AUTH_THROTTLE })
  @UseGuards(OriginGuard)
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(new ZodValidationPipe(registerSchema)) body: RegisterInput,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: PublicUser }> {
    const result = await this.auth.register(body, this.metaFrom(req));
    return this.completeSession(res, result, "email");
  }

  @Post("login")
  @Throttle({ default: AUTH_THROTTLE })
  @UseGuards(OriginGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(loginSchema)) body: LoginInput,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: PublicUser }> {
    const result = await this.auth.login(body, this.metaFrom(req));
    return this.completeSession(res, result, "email");
  }

  @Post("refresh")
  @Throttle({ default: AUTH_THROTTLE })
  @UseGuards(OriginGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: PublicUser }> {
    const rawToken = this.refreshCookie(req);
    if (!rawToken) {
      throw new UnauthorizedException({
        code: "INVALID_SESSION",
        message: "Sessão inválida.",
      });
    }

    const result = await this.auth.refresh(rawToken, this.metaFrom(req));
    return this.completeSession(res, result);
  }

  @Post("logout")
  @UseGuards(OriginGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.auth.logout(this.refreshCookie(req));
    this.tokens.clearAuthCookies(res);
  }

  /** Início do fluxo OAuth: redireciona ao consentimento do provider. */
  @Get("oauth/:provider")
  startOAuth(
    @Param("provider") providerParam: string,
    @Res() res: Response,
  ): void {
    const provider = this.parseProvider(providerParam);

    if (!this.oauth.isConfigured(provider)) {
      res.redirect(this.webUrl("/login", { error: "oauth_unavailable" }));
      return;
    }

    const state = randomUUID();
    res.cookie(OAUTH_STATE_COOKIE, state, this.stateCookieOptions());
    res.redirect(this.oauth.buildAuthorizeUrl(provider, state));
  }

  /** Callback do provider: valida state, cria/liga a conta e abre a sessão. */
  @Get("oauth/:provider/callback")
  async oauthCallback(
    @Param("provider") providerParam: string,
    @Query("code") code: string | undefined,
    @Query("state") state: string | undefined,
    @Query("error") providerError: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const provider = this.parseProvider(providerParam);

    // Limpa o state cedo — ele é single-use.
    const expectedState = this.oauthStateCookie(req);
    res.clearCookie(OAUTH_STATE_COOKIE, {
      ...this.stateCookieOptions(),
      maxAge: undefined,
    });

    if (providerError) {
      res.redirect(this.webUrl("/login", { error: "oauth_denied" }));
      return;
    }

    if (!code || !state || !expectedState || state !== expectedState) {
      res.redirect(this.webUrl("/login", { error: "oauth_state" }));
      return;
    }

    try {
      const profile = await this.oauth.fetchProfile(provider, code);
      const result = await this.auth.loginWithOAuth(
        profile,
        this.metaFrom(req),
      );
      this.tokens.setAuthCookies(res, result.accessToken, result.refreshToken);
      this.tokens.setLastLoginMethodCookie(res, provider);
      res.redirect(this.webUrl("/dashboard"));
    } catch (error) {
      this.logger.warn(`OAuth ${provider} falhou: ${this.reason(error)}`);
      res.redirect(this.webUrl("/login", { error: "oauth_failed" }));
    }
  }

  private completeSession(
    res: Response,
    result: { user: PublicUser; accessToken: string; refreshToken: string },
    loginMethod?: LoginMethod,
  ): { user: PublicUser } {
    this.tokens.setAuthCookies(res, result.accessToken, result.refreshToken);
    if (loginMethod) {
      this.tokens.setLastLoginMethodCookie(res, loginMethod);
    }
    return { user: result.user };
  }

  private refreshCookie(req: Request): string | undefined {
    const cookies = req.cookies as
      Record<string, string | undefined> | undefined;
    return cookies?.[REFRESH_COOKIE];
  }

  private oauthStateCookie(req: Request): string | undefined {
    const cookies = req.cookies as
      Record<string, string | undefined> | undefined;
    return cookies?.[OAUTH_STATE_COOKIE];
  }

  private parseProvider(value: string): OAuthProvider {
    if (!isOAuthProvider(value)) {
      throw new NotFoundException({
        code: "PROVIDER_NOT_FOUND",
        message: "Provedor de login inválido.",
      });
    }
    return value;
  }

  private stateCookieOptions(): CookieOptions {
    const domain = this.config.get<string>("COOKIE_DOMAIN");

    return {
      httpOnly: true,
      secure: this.config.get<string>("NODE_ENV") === "production",
      sameSite: "lax",
      path: OAUTH_STATE_COOKIE_PATH,
      maxAge: OAUTH_STATE_TTL_MS,
      ...(domain ? { domain } : {}),
    };
  }

  private webUrl(path: string, params?: Record<string, string>): string {
    const base = this.config.getOrThrow<string>("WEB_APP_URL");
    const url = new URL(path, base);
    for (const [key, value] of Object.entries(params ?? {})) {
      url.searchParams.set(key, value);
    }
    return url.toString();
  }

  private reason(error: unknown): string {
    return error instanceof Error ? error.message : "erro desconhecido";
  }

  private metaFrom(req: Request): RequestMeta {
    return {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    };
  }
}
