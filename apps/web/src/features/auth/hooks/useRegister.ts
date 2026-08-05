"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RegisterInput } from "@tally/shared";

import { register } from "../services/auth-api";
import { sessionQueryKey } from "./useSession";

/** Cadastro: já inicia a sessão, então populamos o cache de sessão. */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: (data) => {
      queryClient.setQueryData(sessionQueryKey, data.user);
    },
  });
}
