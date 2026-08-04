import type { ReactNode } from "react";

import { TallyIcon } from "@/components/brand";
import { FadeIn } from "@/components/motion/FadeIn";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground">
      <FadeIn className="w-full max-w-sm">
        <div className="flex items-center flex-col mb-8">
          <TallyIcon size={48} />
        </div>
        {children}
      </FadeIn>
    </main>
  );
}
