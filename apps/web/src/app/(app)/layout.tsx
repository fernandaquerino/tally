import type { ReactNode } from "react";

import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { TallyLogo } from "@/components/brand";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireOnboarding>
      <div className="min-h-screen bg-background text-foreground">
        <header className="flex items-center justify-between border-b border-border px-6 py-3">
          <TallyLogo />
          <LogoutButton />
        </header>
        <main className="px-6 py-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
