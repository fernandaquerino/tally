import { SetMetadata } from "@nestjs/common";

/** Chave de metadado lida pelos guards globais para pular auth/tenancy. */
export const IS_PUBLIC_KEY = "isPublic";

/**
 * Marca uma rota como pública, isentando-a dos guards globais `AuthGuard` e
 * `TenancyGuard` (ADR-0008). O default do app é fail-closed: toda rota exige
 * sessão + household, exceto as explicitamente marcadas aqui (login, health…).
 */
export const Public = (): MethodDecorator & ClassDecorator =>
  SetMetadata(IS_PUBLIC_KEY, true);
