import type { Metadata } from "next";
import { Suspense } from "react";

import { OAuthErrorNotice } from "@/features/auth/components/OAuthErrorNotice";
import { RegisterFlow } from "@/features/auth/components/RegisterFlow";

export const metadata: Metadata = {
  title: "Criar conta · Tally",
};

export default function RegisterPage() {
  return (
    <>
      <Suspense fallback={null}>
        <OAuthErrorNotice />
      </Suspense>
      <RegisterFlow />
    </>
  );
}
