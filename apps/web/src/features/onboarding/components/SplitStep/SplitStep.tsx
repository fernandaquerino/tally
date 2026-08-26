import { formatCents } from "@tally/shared";
import { Range } from "@/components/ui/Range";
import { StepLayout } from "../StepLayout";
import type { OnboardingStepProps } from "../../types";

export function SplitStep({
  data,
  onChange,
  onNext,
  onBack,
}: OnboardingStepProps) {
  const revenue = BigInt(data.monthlyRevenueCents);
  const tax = (revenue * BigInt(data.taxPercentage)) / 100n;
  const reserve = (revenue * BigInt(data.reservePercentage)) / 100n;
  const personal = revenue - tax - reserve;
  return (
    <StepLayout
      step={4}
      title="Como quer dividir o que entra?"
      description="Esta é uma sugestão inicial. Você poderá ajustar quando quiser."
      onNext={onNext}
      onBack={onBack}
      disabled={personal < 0n}
    >
      <section className="grid gap-7 rounded-xl border border-border bg-card p-5">
        <SplitRange
          label="Separado para imposto"
          value={data.taxPercentage}
          amount={tax}
          onChange={(taxPercentage) => onChange({ taxPercentage })}
        />
        <SplitRange
          label="Reserva da empresa"
          value={data.reservePercentage}
          amount={reserve}
          onChange={(reservePercentage) => onChange({ reservePercentage })}
        />
      </section>
      <section className="rounded-xl border border-primary-border bg-primary-subtle p-5">
        <p className="mb-3 text-xs font-semibold uppercase text-foreground-muted">
          De {formatCents(revenue)} que entram
        </p>
        <p className="flex justify-between text-sm">
          <span>Realmente seu</span>
          <strong>{formatCents(personal)}</strong>
        </p>
      </section>
    </StepLayout>
  );
}

function SplitRange({
  label,
  value,
  amount,
  onChange,
}: {
  label: string;
  value: number;
  amount: bigint;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid gap-3">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <strong>
          {value}% · {formatCents(amount)}
        </strong>
      </div>
      <Range
        aria-label={label}
        min={0}
        max={40}
        value={value}
        onValueChange={onChange}
      />
    </div>
  );
}
