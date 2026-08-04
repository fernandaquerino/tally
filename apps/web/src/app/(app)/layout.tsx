import type { ReactNode } from "react";

import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

/**
 * Layout da área autenticada. O shell completo (sidebar/topbar) chega numa issue
 * de AppShell; por ora, garante a sessão e oferece logout.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground">
        <header className="flex items-center justify-between border-b border-border px-6 py-3">
          <span className="text-sm font-semibold tracking-tight">Tally</span>
          <LogoutButton />
        </header>
        <main className="px-6 py-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
