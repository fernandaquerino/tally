import { ArrowRight, PiggyBank, Sparkles, Split, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  const benefits = [
    [Split, "Separa o dinheiro da empresa do seu dinheiro pessoal"],
    [PiggyBank, "Mostra quanto deixar separado para imposto"],
    [Wallet, "Calcula quanto pode virar seu salário com segurança"],
  ] as const;
  return (
    <div
      data-onboarding-step
      className="flex flex-1 items-center justify-center px-6 py-10 sm:px-11"
    >
      <div className="w-full max-w-[520px]">
        <div
          data-onboarding-reveal
          className="mb-5 flex size-12 items-center justify-center rounded-xl bg-ai-subtle"
        >
          <Sparkles className="size-6 text-primary" />
        </div>
        <h1
          data-onboarding-reveal
          className="mb-3 text-3xl font-semibold tracking-tight"
        >
          Bem-vindo ao Tally
        </h1>
        <p
          data-onboarding-reveal
          className="mb-6 leading-relaxed text-foreground-subtle"
        >
          Para mostrar quanto do que entra é realmente seu, precisamos conhecer
          o básico da sua empresa.
        </p>
        <div data-onboarding-reveal className="mb-8 grid gap-2.5">
          {benefits.map(([Icon, text]) => (
            <div
              key={text}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-surface p-3"
            >
              <Icon className="size-4 text-primary" />
              <span className="text-xs text-foreground-muted">{text}</span>
            </div>
          ))}
        </div>
        <div data-onboarding-reveal>
          <Button onClick={onNext}>
            Começar <ArrowRight />
          </Button>
          <p className="mt-4 text-xs text-foreground-subtle">
            Leva menos de 2 minutos
          </p>
        </div>
      </div>
    </div>
  );
}
