import type { Meta, StoryObj } from "@storybook/nextjs";
import { WifiOffIcon } from "lucide-react";

import { ErrorState } from "./ErrorState";

const meta = {
  title: "Feedbacks/ErrorState",
  component: ErrorState,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[min(92vw,32rem)] rounded-xl border border-border bg-card">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ErrorState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ConnectionError: Story = {
  args: {
    icon: <WifiOffIcon />,
    title: "Erro de conexão",
    description: "Não foi possível carregar seus dados.",
    onRetry: () => {},
  },
};

export const Default: Story = {
  args: {
    title: "Algo deu errado",
    description: "Tente novamente em alguns instantes.",
    onRetry: () => {},
  },
};

export const WithoutRetry: Story = {
  args: {
    title: "Erro ao exportar",
    description: "Verifique suas permissões e tente de novo.",
  },
};
