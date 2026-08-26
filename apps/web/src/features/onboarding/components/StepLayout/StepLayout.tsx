import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function StepLayout({
  step,
  title,
  description,
  children,
  onNext,
  onBack,
  nextLabel = "Continuar",
  disabled,
  loading,
}: {
  step: number;
  title: string;
  description: string;
  children: ReactNode;
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <div
      data-onboarding-step
      className="flex flex-1 items-center justify-center px-6 py-10 sm:px-11"
    >
      <div className="w-full max-w-[520px]">
        <p
          data-onboarding-reveal
          className="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-primary"
        >
          Passo {step} de 5
        </p>
        <h1
          data-onboarding-reveal
          className="mb-2 text-2xl font-semibold tracking-tight text-foreground"
        >
          {title}
        </h1>
        <p
          data-onboarding-reveal
          className="mb-6 text-sm text-foreground-subtle"
        >
          {description}
        </p>
        <div data-onboarding-reveal className="mb-7 grid gap-6">
          {children}
        </div>
        <div data-onboarding-reveal className="flex items-center gap-2.5">
          <Button onClick={onNext} disabled={disabled} loading={loading}>
            {nextLabel}
            <ArrowRight />
          </Button>
          {onBack ? (
            <Button variant="ghost" onClick={onBack}>
              Voltar
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
