import type { Meta, StoryObj } from "@storybook/nextjs";

import { Checkbox } from "./Checkbox";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    label: "Recorrente",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Unchecked: Story = {
  args: {
    label: "Já foi paga",
    defaultChecked: false,
  },
};

export const Checked: Story = {
  args: {
    label: "Recorrente",
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: "Indeterminate",
    indeterminate: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    disabled: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Separar para imposto",
    defaultChecked: true,
    helperText: "Aplica a regra de split ao receber este valor.",
  },
};

export const WithError: Story = {
  args: {
    label: "Aceito os termos",
    required: true,
    error: "Você precisa aceitar para continuar.",
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      <Checkbox label="Recorrente" defaultChecked />
      <Checkbox label="Já foi paga" />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
    </div>
  ),
};
