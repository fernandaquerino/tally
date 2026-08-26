import { CnpjInput } from "@/components/ui/CnpjInput";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { StepLayout } from "../StepLayout";
import type { OnboardingStepProps } from "../../types";

export function CompanyStep({
  data,
  onChange,
  onNext,
  onBack,
}: OnboardingStepProps) {
  const revenue = BigInt(data.monthlyRevenueCents || "0");
  return (
    <StepLayout
      step={2}
      title="Quanto sua empresa costuma faturar por mês?"
      description="Um valor médio já serve. Dá pra ajustar depois."
      onNext={onNext}
      onBack={onBack}
      disabled={
        revenue <= 0n || (data.cnpj !== null && data.cnpj.length !== 14)
      }
    >
      <MoneyInput
        label="Faturamento médio mensal"
        helperText="Some o que entra pela empresa — notas, clientes e plataformas."
        value={revenue || undefined}
        onValueChange={(value) =>
          onChange({ monthlyRevenueCents: value?.toString() ?? "" })
        }
      />
      <CnpjInput
        value={data.cnpj ?? ""}
        onValueChange={(value) => onChange({ cnpj: value || null })}
      />
    </StepLayout>
  );
}
