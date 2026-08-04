"use client";

import { useSearchParams } from "next/navigation";

import { FormError } from "../FormError";

const MESSAGES: Record<string, string> = {
  oauth_unavailable: "Este login social não está disponível no momento.",
  oauth_denied: "Você cancelou o login social.",
  oauth_state: "Sessão de login expirada. Tente novamente.",
  oauth_failed: "Não foi possível entrar com esse provedor. Tente novamente.",
};

/** Mostra o erro devolvido pelo callback OAuth via `?error=` na URL. */
export function OAuthErrorNotice() {
  const error = useSearchParams().get("error");
  const message = error ? MESSAGES[error] : undefined;

  if (!message) {
    return null;
  }

  return <FormError message={message} />;
}
