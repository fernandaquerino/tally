import type { Meta, StoryObj } from "@storybook/nextjs";

import { Select, type SelectProps } from "./Select";

const categoryGroups: SelectProps["groups"] = [
  {
    label: "Despesas",
    options: [
      { value: "food", label: "Alimentação", color: "var(--warning)" },
      { value: "transport", label: "Transporte", color: "var(--info)" },
      { value: "software", label: "Software", color: "var(--pj)" },
    ],
  },
  {
    label: "Receitas",
    options: [
      { value: "services", label: "Serviços", color: "var(--income)" },
      { value: "refund", label: "Reembolso", color: "var(--pf)" },
    ],
  },
];

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    label: "Categoria",
    groups: categoryGroups,
    defaultValue: "food",
  },
  decorators: [
    (Story) => (
      <div className="min-h-80 w-[min(90vw,22rem)] pt-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Placeholder: Story = {
  args: {
    defaultValue: undefined,
    helperText: "Escolha uma categoria para a transação.",
    placeholder: "Selecione uma categoria",
  },
};

export const Error: Story = {
  args: {
    defaultValue: undefined,
    error: "Selecione uma categoria",
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
