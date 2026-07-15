import type { Meta, StoryObj } from "@storybook/nextjs";

import { MoneyInput } from "./MoneyInput";

interface MoneyInputStoryArgs {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  transactionType?: "income" | "expense";
}

const meta = {
  title: "UI/MoneyInput",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    label: "Valor",
    placeholder: "0,00",
  },
  argTypes: {
    transactionType: {
      control: "radio",
      options: ["income", "expense"],
      description: "Define a cor semântica do valor.",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[min(90vw,22rem)]">
        <Story />
      </div>
    ),
  ],
  render: (args) => <MoneyInput {...args} />,
} satisfies Meta<MoneyInputStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Income: Story = {
  name: "Receita",
  args: {
    defaultValue: "5.000,00",
    helperText: "Valor recebido",
    transactionType: "income",
  },
};

export const Expense: Story = {
  name: "Despesa",
  args: {
    defaultValue: "1.250,00",
    helperText: "Valor pago",
    transactionType: "expense",
  },
};

export const States: Story = {
  name: "Todos os estados",
  render: () => (
    <div className="grid w-[min(90vw,44rem)] gap-4 sm:grid-cols-2">
      <MoneyInput
        defaultValue="5.000,00"
        helperText="Receita"
        label="Receita"
        transactionType="income"
      />
      <MoneyInput
        defaultValue="1.250,00"
        helperText="Despesa"
        label="Despesa"
        transactionType="expense"
      />
      <MoneyInput label="Valor neutro" placeholder="0,00" />
      <MoneyInput
        error="Informe um valor válido"
        label="Com erro"
        transactionType="expense"
      />
      <MoneyInput
        defaultValue="750,00"
        disabled
        label="Desabilitado"
        transactionType="income"
      />
    </div>
  ),
};
