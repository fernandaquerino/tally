"use client";

import { useSession } from "@/features/auth/hooks/useSession";

/**
 * Placeholder do dashboard — apenas confirma a sessão autenticada. Os 3 números
 * principais chegam na Sprint 2.
 */
export default function DashboardPage() {
  const { data: user } = useSession();

  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold tracking-tight">
        Olá{user ? `, ${user.name}` : ""}.
      </h1>
      <p className="text-sm text-muted-foreground">
        Sua área autenticada está no ar. Em breve: seus 3 números principais.
      </p>
    </section>
  );
}
