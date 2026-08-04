import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/Button";
import { TallyLogo } from "@/components/brand";

export const metadata: Metadata = {
  title: "Tally — Finanças PF e PJ no mesmo lugar",
  description:
    "Saiba quanto do seu faturamento é imposto, reserva da empresa e dinheiro realmente disponível para você.",
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
          <TallyLogo />
          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Entrar
            </Link>
            <Link href="/signup" className={buttonVariants({ size: "sm" })}>
              Criar conta
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-20">
        <section className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Para quem vive de CNPJ
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Finanças PF e PJ no mesmo lugar.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Saiba quanto do seu faturamento é imposto, reserva da empresa e
            dinheiro realmente disponível para você — sem misturar os dinheiros.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/signup" className={buttonVariants({ size: "lg" })}>
              Começar agora
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Entrar
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
