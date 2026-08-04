export const OAUTH_PROVIDERS = ["google", "github"] as const;
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export function isOAuthProvider(value: string): value is OAuthProvider {
  return (OAUTH_PROVIDERS as readonly string[]).includes(value);
}

/** Perfil normalizado a partir de qualquer provider (ADR-0008 §OAuth). */
export interface NormalizedProfile {
  provider: OAuthProvider;
  providerId: string;
  email: string | null;
  /** Só vinculamos a uma conta existente por e-mail se ele for verificado. */
  emailVerified: boolean;
  name: string;
}
