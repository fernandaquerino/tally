"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LoginInput } from "@tally/shared";

import { login } from "../services/auth-api";
import { sessionQueryKey } from "./useSession";

/** Login: em sucesso, popula o cache de sessão com o usuário retornado. */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (data) => {
      queryClient.setQueryData(sessionQueryKey, data.user);
    },
  });
}
