import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthGuard } from "../../common/guards/auth.guard.js";
import { OriginGuard } from "../../common/guards/origin.guard.js";
import { TenancyGuard } from "../../common/guards/tenancy.guard.js";
import { AuthController } from "./auth.controller.js";
import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import { MeController } from "./me.controller.js";
import { OAuthService } from "./oauth/oauth.service.js";
import { TokensService } from "./tokens.service.js";

@Module({
  // JwtModule global para que o AuthGuard seja utilizável em qualquer módulo.
  imports: [JwtModule.register({ global: true })],
  controllers: [AuthController, MeController],
  providers: [
    AuthService,
    AuthRepository,
    TokensService,
    OAuthService,
    AuthGuard,
    TenancyGuard,
    OriginGuard,
  ],
  exports: [AuthGuard, TenancyGuard],
})
export class AuthModule {}
