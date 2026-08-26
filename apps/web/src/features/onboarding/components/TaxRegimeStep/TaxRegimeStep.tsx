import { Alert } from "@/components/feedback/Alert";
import { Badge } from "@/components/ui/Badge";
import { RadioCardGroup } from "@/components/ui/RadioCard";
import { StepLayout } from "../StepLayout";
import type { OnboardingData, OnboardingStepProps } from "../../types";

export function TaxRegimeStep({
  data,
  onChange,
  onNext,
  onBack,
}: OnboardingStepProps) {
  return (
    <StepLayout
      step={3}
      title="Qual o regime da sua empresa?"
      description="Isso muda quanto o Tally sugere separar para imposto."
      onNext={onNext}
      onBack={onBack}
    >
      <RadioCardGroup
        label="Regime fiscal"
        hideLabel
        value={data.taxRegime}
        onValueChange={(taxRegime) =>
          onChange({ taxRegime: taxRegime as OnboardingData["taxRegime"] })
        }
        options={[
          {
            value: "mei",
            label: (
              <span className="flex gap-2">
                MEI <Badge variant="neutral">~6%</Badge>
              </span>
            ),
            description:
              "Faturamento até R$ 81 mil por ano. Imposto fixo mensal (DAS).",
          },
          {
            value: "simples_nacional",
            label: (
              <span className="flex gap-2">
                Simples Nacional <Badge variant="neutral">~15%</Badge>
              </span>
            ),
            description: "A alíquota varia com o faturamento e a atividade.",
          },
          {
            value: "unknown",
            label: "Ainda não sei",
            description:
              "Começamos com uma estimativa segura e você ajusta depois.",
          },
        ]}
      />
      <Alert variant="warning">
        Não é aconselhamento contábil. Confirme a configuração com seu contador.
      </Alert>
    </StepLayout>
  );
}
