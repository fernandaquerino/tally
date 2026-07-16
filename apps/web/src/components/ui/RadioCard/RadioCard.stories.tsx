import type { Meta, StoryObj } from "@storybook/nextjs";
import { Building2Icon, UserIcon } from "lucide-react";

import { RadioCardGroup, type RadioCardOption } from "./RadioCard";

const pfOption: RadioCardOption = {
  value: "pf",
  label: "Pessoal (PF)",
  description: "Sua vida financeira pessoal",
  icon: <UserIcon />,
  accent: "pf",
};

const pjOption: RadioCardOption = {
  value: "pj",
  label: "Empresa (PJ)",
  description: "Faturamento e custos da empresa",
  icon: <Building2Icon />,
  accent: "pj",
};

const contextOptions: RadioCardOption[] = [pfOption, pjOption];

const meta = {
  title: "UI/RadioCard",
  component: RadioCardGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    label: "Contexto",
    options: contextOptions,
    defaultValue: "pf",
  },
  decorators: [
    (Story) => (
      <div className="w-[min(90vw,26rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadioCardGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const HiddenLabel: Story = {
  args: {
    hideLabel: true,
  },
};

export const WithHelperText: Story = {
  args: {
    defaultValue: undefined,
    helperText: "Escolha onde este lançamento vai entrar.",
  },
};

export const WithError: Story = {
  args: {
    defaultValue: undefined,
    required: true,
    error: "Selecione um contexto para continuar.",
  },
};

export const Default: Story = {
  args: {
    label: "Plano",
    defaultValue: "monthly",
    options: [
      {
        value: "monthly",
        label: "Mensal",
        description: "Cobrado todo mês, cancele quando quiser.",
      },
      {
        value: "yearly",
        label: "Anual",
        description: "Dois meses grátis no plano anual.",
      },
    ],
  },
};

export const WithDisabledOption: Story = {
  args: {
    defaultValue: "pf",
    options: [
      pfOption,
      {
        ...pjOption,
        disabled: true,
        description: "Disponível após configurar seu CNPJ.",
      },
    ],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
