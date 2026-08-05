import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { NormalizedProfile, OAuthProvider } from "./oauth.types.js";

interface ProviderEndpoints {
  authorizeUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scope: string;
}

const ENDPOINTS: Record<OAuthProvider, ProviderEndpoints> = {
  google: {
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo",
    scope: "openid email profile",
  },
  github: {
    authorizeUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    userInfoUrl: "https://api.github.com/user",
    scope: "read:user user:email",
  },
};

interface ProviderCredentials {
  clientId: string;
  clientSecret: string;
}

/**
 * Authorization Code flow para Google e GitHub, implementado à mão (sem
 * passport). A API é a autoridade: troca o code, lê o perfil e devolve um
 * `NormalizedProfile`; a emissão da sessão fica no AuthService.
 */
@Injectable()
export class OAuthService {
  constructor(private readonly config: ConfigService) {}

  isConfigured(provider: OAuthProvider): boolean {
    return this.tryCredentials(provider) !== null;
  }

  /** URL de consentimento do provider, com `state` para CSRF. */
  buildAuthorizeUrl(provider: OAuthProvider, state: string): string {
    const { clientId } = this.credentials(provider);
    const endpoints = ENDPOINTS[provider];
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: this.redirectUri(provider),
      response_type: "code",
      scope: endpoints.scope,
      state,
    });

    if (provider === "google") {
      // Sempre retorna refresh/consent previsível e pede a conta.
      params.set("prompt", "select_account");
    }

    return `${endpoints.authorizeUrl}?${params.toString()}`;
  }

  /** Troca o `code` por access token e retorna o perfil normalizado. */
  async fetchProfile(
    provider: OAuthProvider,
    code: string,
  ): Promise<NormalizedProfile> {
    const accessToken = await this.exchangeCode(provider, code);

    return provider === "google"
      ? this.fetchGoogleProfile(accessToken)
      : this.fetchGithubProfile(accessToken);
  }

  private async exchangeCode(
    provider: OAuthProvider,
    code: string,
  ): Promise<string> {
    const { clientId, clientSecret } = this.credentials(provider);
    const response = await fetch(ENDPOINTS[provider].tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: this.redirectUri(provider),
      }),
    });

    if (!response.ok) {
      throw new ServiceUnavailableException("Falha ao trocar o code do OAuth.");
    }

    const data = (await response.json()) as { access_token?: string };
    if (!data.access_token) {
      throw new ServiceUnavailableException(
        "Provider OAuth não retornou token.",
      );
    }

    return data.access_token;
  }

  private async fetchGoogleProfile(
    accessToken: string,
  ): Promise<NormalizedProfile> {
    const data = await this.getJson<{
      sub: string;
      email?: string;
      email_verified?: boolean;
      name?: string;
    }>(ENDPOINTS.google.userInfoUrl, accessToken);

    return {
      provider: "google",
      providerId: data.sub,
      email: data.email ?? null,
      emailVerified: data.email_verified === true,
      name: data.name?.trim() || data.email?.split("@")[0] || "Usuário",
    };
  }

  private async fetchGithubProfile(
    accessToken: string,
  ): Promise<NormalizedProfile> {
    const user = await this.getJson<{
      id: number;
      name?: string | null;
      login: string;
      email?: string | null;
    }>(ENDPOINTS.github.userInfoUrl, accessToken);

    // O e-mail público do GitHub pode ser nulo; buscamos o primário verificado.
    const emails = await this.getJson<
      { email: string; primary: boolean; verified: boolean }[]
    >("https://api.github.com/user/emails", accessToken);
    const primary = emails.find((entry) => entry.primary) ?? emails[0];

    return {
      provider: "github",
      providerId: String(user.id),
      email: primary?.email ?? user.email ?? null,
      emailVerified: primary?.verified === true,
      name: user.name?.trim() || user.login,
    };
  }

  private async getJson<T>(url: string, accessToken: string): Promise<T> {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        // GitHub exige User-Agent; inofensivo para o Google.
        "User-Agent": "tally-api",
      },
    });

    if (!response.ok) {
      throw new ServiceUnavailableException(
        "Falha ao obter perfil do provider.",
      );
    }

    return (await response.json()) as T;
  }

  private redirectUri(provider: OAuthProvider): string {
    const base = this.config.getOrThrow<string>("API_PUBLIC_URL");
    return `${base}/v1/auth/oauth/${provider}/callback`;
  }

  private credentials(provider: OAuthProvider): ProviderCredentials {
    const credentials = this.tryCredentials(provider);
    if (!credentials) {
      throw new ServiceUnavailableException(
        `Login com ${provider} não está configurado.`,
      );
    }
    return credentials;
  }

  private tryCredentials(provider: OAuthProvider): ProviderCredentials | null {
    const prefix = provider === "google" ? "AUTH_GOOGLE" : "AUTH_GITHUB";
    const clientId = this.config.get<string>(`${prefix}_ID`);
    const clientSecret = this.config.get<string>(`${prefix}_SECRET`);

    if (!clientId || !clientSecret) {
      return null;
    }

    return { clientId, clientSecret };
  }
}
