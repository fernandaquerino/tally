import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

import type { AuthenticatedUser } from "../types/authenticated-user.js";

/**
 * Injeta a identidade autenticada (`request.user`) num handler. Deve ser usado
 * apenas em rotas protegidas por `AuthGuard`; se faltar, é erro de programação
 * (guard ausente) e retornamos 401.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: AuthenticatedUser }>();

    if (!request.user) {
      throw new UnauthorizedException({
        code: "UNAUTHENTICATED",
        message: "Sessão inválida.",
      });
    }

    return request.user;
  },
);
