import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

import type { AuthenticatedUser } from "../types/authenticated-user.js";

/**
 * Fábrica isolada para permitir teste unitário direto (o decorator embrulha
 * esta função). Extrai o `householdId` da identidade em `request.user`.
 */
export function resolveCurrentHousehold(context: ExecutionContext): string {
  const request = context
    .switchToHttp()
    .getRequest<{ user?: AuthenticatedUser }>();

  if (!request.user?.householdId) {
    throw new UnauthorizedException({
      code: "UNAUTHENTICATED",
      message: "Sessão inválida.",
    });
  }

  return request.user.householdId;
}

/**
 * Injeta o `householdId` da sessão (derivado do token pelo `AuthGuard`) num
 * handler. Atalho tipado sobre `CurrentUser` para o caso mais comum: passar o
 * tenant aos repositories. Só use em rotas protegidas pelos guards globais; se
 * faltar, é erro de programação (guard ausente) e retornamos 401.
 */
export const CurrentHousehold = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string =>
    resolveCurrentHousehold(context),
);
