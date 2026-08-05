/** Papel do usuário no household (espelha o enum do backend). */
export type HouseholdRole = "OWNER" | "MEMBER";

/** Usuário de sessão exposto pelo `GET /v1/me` e pelos fluxos de auth. */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  householdId: string;
  role: HouseholdRole;
}
