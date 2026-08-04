import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import type { AuthenticatedUser } from "../types/authenticated-user.js";

/**
 * Garante que o `householdId` de tenancy vem da identidade autenticada, nunca de
 * parâmetro do client (ADR-0008 §Autorização / threat-model I). Deve rodar após
 * o `AuthGuard`. Módulos de domínio derivam o household daqui; é também o ponto
 * onde futuras revalidações de membership por request devem entrar.
 */
@Injectable()
export class TenancyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
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
