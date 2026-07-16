import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  CheckIcon,
  ClockIcon,
  CircleAlertIcon,
  RepeatIcon,
  ArrowLeftRightIcon,
} from "lucide-react";

import { Badge } from "./Badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "neutral",
        "success",
        "warning",
        "danger",
        "info",
        "income",
        "expense",
        "pf",
        "pj",
      ],
    },
  },
  args: {
    variant: "neutral",
    children: "Badge",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const StatusRow: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="success">
        <CheckIcon />
        Pago
      </Badge>
      <Badge variant="warning">
        <ClockIcon />
        Pendente
      </Badge>
      <Badge variant="danger">
        <CircleAlertIcon />
        Atrasado
      </Badge>
      <Badge variant="neutral">
        <RepeatIcon />
        Recorrente
      </Badge>
      <Badge variant="income">
        <ArrowDownLeftIcon />
        Entrada
      </Badge>
      <Badge variant="expense">
        <ArrowUpRightIcon />
        Saída
      </Badge>
      <Badge variant="neutral">
        <ArrowLeftRightIcon />
        Transferência
      </Badge>
    </div>
  ),
};

export const WithoutIcon: Story = {
  args: {
    variant: "success",
    children: "Pago",
  },
};
