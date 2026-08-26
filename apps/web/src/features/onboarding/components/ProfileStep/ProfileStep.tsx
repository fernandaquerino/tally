import { Input } from "@/components/ui/Input";
import { PillRadioGroup } from "../PillRadioGroup";
import { StepLayout } from "../StepLayout";
import type { OnboardingStepProps } from "../../types";

export function ProfileStep({
  data,
  onChange,
  onNext,
  onBack,
}: OnboardingStepProps) {
  return (
    <StepLayout
      step={1}
      title="Como podemos te chamar?"
      description="Usamos seu nome nas saudações e nos relatórios."
      onNext={onNext}
      onBack={onBack}
      disabled={data.name.trim().length < 2}
    >
      <Input
        label="Seu nome"
        value={data.name}
        onChange={(event) => onChange({ name: event.target.value })}
      />
      <PillRadioGroup
        label="O que você faz?"
        optional
        value={data.occupation ?? ""}
        onValueChange={(occupation) =>
          onChange({ occupation: occupation as OnboardingData["occupation"] })
        }
        options={[
          { value: "design", label: "Design" },
          { value: "development", label: "Desenvolvimento" },
          { value: "consulting", label: "Consultoria" },
          { value: "marketing", label: "Marketing" },
          { value: "health", label: "Saúde" },
          { value: "other", label: "Outro" },
        ]}
      />
    </StepLayout>
  );
}

import type { OnboardingData } from "../../types";
