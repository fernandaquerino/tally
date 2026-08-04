import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { OAuthErrorNotice } from "@/features/auth/components/OAuthErrorNotice";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { SocialButtons } from "@/features/auth/components/SocialButtons";

export const metadata: Metadata = {
  title: "Criar conta · Tally",
};

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>
          Comece a separar PF e PJ no mesmo lugar.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Suspense fallback={null}>
          <OAuthErrorNotice />
        </Suspense>
        <SocialButtons />
        <RegisterForm />
        <p className="text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
