"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionQueryKey } from "@/features/auth/hooks/useSession";
import type { SessionUser } from "@/features/auth/types";
import { completeOnboarding } from "../services/onboarding-api";

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      queryClient.setQueryData<SessionUser | null>(sessionQueryKey, (user) =>
        user ? { ...user, onboardingCompleted: true } : user,
      );
    },
  });
}
