import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginFlow } from "@/features/auth/components/LoginFlow";
import { OAuthErrorNotice } from "@/features/auth/components/OAuthErrorNotice";

export const metadata: Metadata = {
  title: "Entrar · Tally",
};

export default function LoginPage() {
  return (
    <>
      <Suspense fallback={null}>
        <OAuthErrorNotice />
      </Suspense>
      <LoginFlow />
    </>
  );
}
