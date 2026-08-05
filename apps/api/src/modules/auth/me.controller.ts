import { Controller, Get, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { AuthGuard } from "../../common/guards/auth.guard.js";
import type { AuthenticatedUser } from "../../common/types/authenticated-user.js";
import { AuthService } from "./auth.service.js";
import type { PublicUser } from "./dto/public-user.js";

/**
 * `GET /v1/me` — fonte de verdade da sessão para o web (ADR-0008). Fica fora do
 * prefixo `auth` de propósito, para bater com o contrato `/v1/me`.
 */
@Controller()
export class MeController {
  constructor(private readonly auth: AuthService) {}

  @Get("me")
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: AuthenticatedUser): Promise<PublicUser> {
    return this.auth.me(user.userId);
  }
}
