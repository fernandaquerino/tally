import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { IS_PUBLIC_KEY } from "../decorators/public.decorator.js";
import type { AuthenticatedUser } from "../types/authenticated-user.js";

/**
 * Garante que o `householdId` de tenancy vem da identidade autenticada, nunca de
 * parâmetro do client (ADR-0008 §Autorização / threat-model I). Deve rodar após
 * o `AuthGuard`. Módulos de domínio derivam o household daqui; é também o ponto
 * onde futuras revalidações de membership por request devem entrar.
 */
@Injectable()
export class TenancyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user?: AuthenticatedUser }>();

    if (!request.user?.householdId) {
      throw new UnauthorizedException({
        code: "UNAUTHENTICATED",
        message: "Sessão inválida.",
      });
    }

    return true;
  }
}
