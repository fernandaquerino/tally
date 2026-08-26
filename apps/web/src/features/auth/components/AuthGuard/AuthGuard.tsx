"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { Spinner } from "@/components/ui/Spinner";

import { useSession } from "../../hooks/useSession";

/**
 * Proteção de sessão no cliente (defesa em profundidade junto do middleware,
 * ADR-0008 §Sessão web). O guard real de dados continua na API; aqui só
 * evitamos renderizar a área autenticada sem sessão válida.
 */
export function AuthGuard({
  children,
  requireOnboarding = false,
}: {
  children: ReactNode;
  requireOnboarding?: boolean;
}) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useSession();

  const unauthenticated = !isLoading && (isError || user === null);

  useEffect(() => {
    if (unauthenticated) {
      router.replace("/login");
    }
  }, [unauthenticated, router]);

  useEffect(() => {
    if (requireOnboarding && user && !user.onboardingCompleted)
      router.replace("/onboarding");
  }, [requireOnboarding, router, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user || (requireOnboarding && !user.onboardingCompleted)) {
    return null;
  }

  return <>{children}</>;
}
