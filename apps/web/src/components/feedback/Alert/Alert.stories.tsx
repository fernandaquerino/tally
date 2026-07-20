import type { Meta, StoryObj } from "@storybook/nextjs";

import { Alert, AlertDescription, AlertTitle } from "./Alert";

const meta = {
  title: "Feedbacks/Alert",
  component: Alert,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["info", "success", "warning", "danger"],
    },
  },
  args: {
    variant: "info",
    children: "Sua fatura fecha em 3 dias.",
  },
  decorators: [
    (Story) => (
      <div className="w-[min(92vw,32rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Stack: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert variant="info">Sua fatura fecha em 3 dias.</Alert>
      <Alert variant="warning">Gasto com delivery acima da média.</Alert>
      <Alert variant="danger">Conta atrasada há 2 dias.</Alert>
    </div>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <Alert variant="warning">
      <AlertTitle>Gasto acima da média</AlertTitle>
      <AlertDescription>
        Seus gastos com delivery estão 40% acima do mês passado.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  args: { variant: "success", children: "Transação registrada com sucesso." },
};
