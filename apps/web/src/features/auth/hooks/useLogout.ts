"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout } from "../services/auth-api";
import { sessionQueryKey } from "./useSession";

/** Logout: limpa o cache de sessão antes de redirecionar (ADR-0008 §Sessão web). */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.setQueryData(sessionQueryKey, null);
    },
  });
}
