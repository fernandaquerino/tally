import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

import { ACCESS_COOKIE } from "../../modules/auth/auth.constants.js";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator.js";
import type {
  AccessTokenClaims,
  AuthenticatedUser,
} from "../types/authenticated-user.js";

type RequestWithAuth = {
  cookies?: Record<string, string | undefined>;
  user?: AuthenticatedUser;
};

/**
 * Valida o access token JWT do cookie httpOnly (assinatura, expiração, issuer e
 * audience) e anexa a identidade em `request.user`. É a única autoridade de
 * autenticação — o front nunca valida o JWT (ADR-0008).
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const token = request.cookies?.[ACCESS_COOKIE];

    if (!token) {
      throw new UnauthorizedException({
        code: "UNAUTHENTICATED",
        message: "Sessão inválida.",
      });
    }

    try {
      const claims = await this.jwt.verifyAsync<AccessTokenClaims>(token, {
        secret: this.config.getOrThrow<string>("JWT_ACCESS_SECRET"),
        issuer: this.config.getOrThrow<string>("JWT_ISSUER"),
        audience: this.config.getOrThrow<string>("JWT_AUDIENCE"),
      });

      request.user = {
        userId: claims.sub,
        householdId: claims.householdId,
        role: claims.role,
        jti: claims.jti,
      };

      return true;
    } catch {
      throw new UnauthorizedException({
        code: "UNAUTHENTICATED",
        message: "Sessão inválida.",
      });
    }
  }
}
