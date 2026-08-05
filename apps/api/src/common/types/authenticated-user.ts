import type { HouseholdRole } from "@tally/db";

/**
 * Identidade derivada do access token e anexada a `request.user` pelo AuthGuard.
 * `householdId` vem SEMPRE do token, nunca de parâmetro do client (ADR-0008 / IDOR).
 */
export interface AuthenticatedUser {
  userId: string;
  householdId: string;
  role: HouseholdRole;
  jti: string;
}

/** Claims mínimas do access token JWT (ADR-0008 §Access token). */
export interface AccessTokenClaims {
  sub: string;
  householdId: string;
  role: HouseholdRole;
  jti: string;
}
