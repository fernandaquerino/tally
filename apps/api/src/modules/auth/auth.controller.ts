import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { loginSchema, registerSchema } from "@tally/shared";
import type { LoginInput, RegisterInput } from "@tally/shared";
import type { Request, Response } from "express";

import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { AuthGuard } from "../../common/guards/auth.guard.js";
import { OriginGuard } from "../../common/guards/origin.guard.js";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe.js";
import type { AuthenticatedUser } from "../../common/types/authenticated-user.js";
import { REFRESH_COOKIE } from "./auth.constants.js";
import { AuthService, type RequestMeta } from "./auth.service.js";
import type { PublicUser } from "./dto/public-user.js";
import { TokensService } from "./tokens.service.js";

// Rate limit estrito nos endpoints de credencial (threat-model S/D).
const AUTH_THROTTLE = { limit: 5, ttl: 60_000 };

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly tokens: TokensService,
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
    return this.completeSession(res, result);
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
    return this.completeSession(res, result);
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

  @Get("me")
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: AuthenticatedUser): Promise<PublicUser> {
    return this.auth.me(user.userId);
  }

  private completeSession(
    res: Response,
    result: { user: PublicUser; accessToken: string; refreshToken: string },
  ): { user: PublicUser } {
    this.tokens.setAuthCookies(res, result.accessToken, result.refreshToken);
    return { user: result.user };
  }

  private refreshCookie(req: Request): string | undefined {
    const cookies = req.cookies as
      Record<string, string | undefined> | undefined;
    return cookies?.[REFRESH_COOKIE];
  }

  private metaFrom(req: Request): RequestMeta {
    return {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    };
  }
}
