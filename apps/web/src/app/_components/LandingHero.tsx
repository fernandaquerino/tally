"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useRef } from "react";

import { TallyLogo } from "@/components/brand";
import { buttonVariants } from "@/components/ui/Button";

/**
 * Hero da landing com animação de entrada (GSAP). Client Component porque a
 * animação depende do DOM/browser. O conteúdo é renderizado visível por padrão:
 * quem tem `prefers-reduced-motion` (ou está sem JS) vê o hero estático — a
 * animação só é aplicada quando o movimento é bem-vindo (a11y, AGENTS §12).
 */
export function LandingHero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-reveal]", {
          y: 24,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
        });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
          <span data-reveal>
            <TallyLogo />
          </span>
          <nav data-reveal className="flex items-center gap-2">
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
          <p
            data-reveal
            className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary"
          >
            Para quem vive de CNPJ
          </p>
          <h1
            data-reveal
            className="text-4xl font-bold tracking-tight sm:text-6xl"
          >
            Finanças PF e PJ no mesmo lugar.
          </h1>
          <p
            data-reveal
            className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground"
          >
            Saiba quanto do seu faturamento é imposto, reserva da empresa e
            dinheiro realmente disponível para você — sem misturar os dinheiros.
          </p>
          <div data-reveal className="mt-10 flex flex-wrap items-center gap-3">
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
