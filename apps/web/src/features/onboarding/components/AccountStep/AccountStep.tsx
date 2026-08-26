import { Building2, Clock3, CreditCard, User } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { RadioCardGroup } from "@/components/ui/RadioCard";
import { StepLayout } from "../StepLayout";
import type { OnboardingData, OnboardingStepProps } from "../../types";

export function AccountStep({
  data,
  onChange,
  onNext,
  onBack,
  loading,
}: OnboardingStepProps & { loading: boolean }) {
  return (
    <StepLayout
      step={5}
      title="Qual conta quer adicionar primeiro?"
      description="Escolha uma opção para começar. Você poderá adicionar outras contas depois."
      onNext={onNext}
      onBack={onBack}
      nextLabel="Concluir"
      loading={loading}
    >
      <RadioCardGroup
        label="Conta inicial"
        hideLabel
        hideControl
        value={data.initialAccountType}
        onValueChange={(initialAccountType) =>
          onChange({
            initialAccountType:
              initialAccountType as OnboardingData["initialAccountType"],
          })
        }
        options={[
          {
            value: "business_account",
            label: "Conta da empresa",
            description: "Onde o faturamento cai",
            icon: <Building2 />,
            trailing: <Badge variant="pj">Empresa</Badge>,
          },
          {
            value: "personal_account",
            label: "Conta pessoal",
            description: "Onde você recebe o seu salário",
            icon: <User />,
            trailing: <Badge variant="pf">Pessoal</Badge>,
          },
          {
            value: "credit_card",
            label: "Cartão de crédito",
            description: "Para acompanhar a fatura",
            icon: <CreditCard />,
          },
          {
            value: "later",
            label: "Faço isso depois",
            description: "Começar sem cadastrar conta",
            icon: <Clock3 />,
          },
        ]}
      />
    </StepLayout>
  );
}
