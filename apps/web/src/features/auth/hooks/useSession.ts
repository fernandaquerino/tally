"use client";

import { useQuery } from "@tanstack/react-query";

import { getSession } from "../services/auth-api";

export const sessionQueryKey = ["session"] as const;

/**
 * Fonte de verdade da sessão no web (ADR-0008): consome `GET /v1/me`.
 * `data === null` => não autenticado.
 */
export function useSession() {
  return useQuery({
    queryKey: sessionQueryKey,
    queryFn: getSession,
    staleTime: 60_000,
  });
}
