import type { LoginInput, RegisterInput } from "@tally/shared";

import { ApiError, apiFetch } from "@/lib/api/client";

import type { SessionUser } from "../types";

interface SessionResponse {
  user: SessionUser;
}

export function register(body: RegisterInput): Promise<SessionResponse> {
  return apiFetch<SessionResponse>("/auth/register", {
    method: "POST",
    body,
  });
}

export function login(body: LoginInput): Promise<SessionResponse> {
  return apiFetch<SessionResponse>("/auth/login", {
    method: "POST",
    body,
  });
}

export function logout(): Promise<void> {
  return apiFetch<void>("/auth/logout", { method: "POST" });
}

/**
 * Estado da sessão atual. Um 401 não é erro de aplicação — significa "não
 * autenticado", então retornamos `null` em vez de propagar.
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    return await apiFetch<SessionUser>("/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}
