import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { validateEnv } from "./config/env.validation.js";
import { AuthGuard } from "./common/guards/auth.guard.js";
import { TenancyGuard } from "./common/guards/tenancy.guard.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: [".env", "../../.env"],
      expandVariables: true,
      isGlobal: true,
      validate: validateEnv,
    }),
    // Rate limit global padrão; rotas de auth apertam via @Throttle.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  // Ordem importa: Throttler → Auth (popula request.user) → Tenancy (exige
  // householdId). Toda rota é fail-closed; rotas públicas usam @Public().
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: TenancyGuard },
  ],
})
export class AppModule {}
