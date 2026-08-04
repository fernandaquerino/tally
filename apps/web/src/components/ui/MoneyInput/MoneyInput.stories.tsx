import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import { MoneyInput } from "./MoneyInput";

interface MoneyInputStoryArgs {
  label: string;
  placeholder?: string;
  defaultValue?: bigint;
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
    defaultValue: 500000n,
    helperText: "Valor recebido",
    transactionType: "income",
  },
};

export const Expense: Story = {
  name: "Despesa",
  args: {
    defaultValue: 125000n,
    helperText: "Valor pago",
    transactionType: "expense",
  },
};

/** Controlado: o valor vive em centavos (bigint) no estado do formulário. */
export const Controlled: Story = {
  name: "Controlado (centavos)",
  render: function ControlledStory() {
    const [cents, setCents] = useState<bigint | undefined>(850000n);

    return (
      <div className="flex flex-col gap-2">
        <MoneyInput
          label="Valor"
          transactionType="income"
          value={cents}
          onValueChange={setCents}
        />
        <p className="text-xs text-muted-foreground">
          Em centavos: <span className="font-mono">{String(cents)}</span>
        </p>
      </div>
    );
  },
};

export const States: Story = {
  name: "Todos os estados",
  render: () => (
    <div className="grid w-[min(90vw,44rem)] gap-4 sm:grid-cols-2">
      <MoneyInput
        defaultValue={500000n}
        helperText="Receita"
        label="Receita"
        transactionType="income"
      />
      <MoneyInput
        defaultValue={125000n}
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
        defaultValue={75000n}
        disabled
        label="Desabilitado"
        transactionType="income"
      />
    </div>
  ),
};
