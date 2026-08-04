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
import { LoginForm } from "@/features/auth/components/LoginForm";
import { OAuthErrorNotice } from "@/features/auth/components/OAuthErrorNotice";
import { SocialButtons } from "@/features/auth/components/SocialButtons";

export const metadata: Metadata = {
  title: "Entrar · Tally",
};

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Acesse sua conta Tally.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Suspense fallback={null}>
          <OAuthErrorNotice />
        </Suspense>
        <SocialButtons />
        <LoginForm />
        <p className="text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link
            href="/cadastro"
            className="font-medium text-primary hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
