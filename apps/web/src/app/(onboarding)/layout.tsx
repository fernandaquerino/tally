import type { ReactNode } from "react";

import { AuthGuard } from "@/features/auth/components/AuthGuard";

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground">
        <main className="">{children}</main>
      </div>
    </AuthGuard>
  );
}
