import type { Meta, StoryObj } from "@storybook/nextjs";
import { PlusIcon, ReceiptTextIcon } from "lucide-react";

import { Button } from "../Button";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Feedbacks/EmptyState",
  component: EmptyState,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[min(92vw,32rem)] rounded-xl border border-border bg-card">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Transactions: Story = {
  args: {
    icon: <ReceiptTextIcon />,
    title: "Nenhuma transação ainda",
    description:
      "Adicione sua primeira transação ou importe um extrato para começar.",
    children: (
      <>
        <Button>
          <PlusIcon />
          Adicionar transação
        </Button>
        <Button variant="outline">Importar extrato</Button>
      </>
    ),
  },
};

export const WithoutActions: Story = {
  args: {
    icon: <ReceiptTextIcon />,
    title: "Nenhuma meta cadastrada",
    description: "Suas metas financeiras aparecerão aqui.",
  },
};

export const TextOnly: Story = {
  args: {
    title: "Nada por aqui",
    description: "Nenhum resultado para os filtros aplicados.",
  },
};
