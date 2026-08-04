import type { Meta, StoryObj } from "@storybook/nextjs";
import { SparklesIcon, TriangleAlertIcon } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  type CardProps,
} from "./Card";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "interactive", "selected", "muted", "alert", "ai"],
    },
  },
  args: {
    variant: "default",
  },
  render: (args: CardProps) => (
    <div className="w-[min(90vw,20rem)]">
      <Card {...args}>
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>surface + border</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interactive: Story = {
  args: { variant: "interactive" },
};

export const Selected: Story = {
  args: { variant: "selected" },
};

export const Muted: Story = {
  args: { variant: "muted" },
};

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card variant="default">
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>surface + border</CardDescription>
        </CardHeader>
      </Card>
      <Card variant="interactive">
        <CardHeader>
          <CardTitle>Interactive</CardTitle>
          <CardDescription>hover eleva</CardDescription>
        </CardHeader>
      </Card>
      <Card variant="selected">
        <CardHeader>
          <CardTitle>Selected</CardTitle>
          <CardDescription>border-focus</CardDescription>
        </CardHeader>
      </Card>
      <Card variant="muted">
        <CardHeader>
          <CardTitle>Muted</CardTitle>
          <CardDescription>fundo rebaixado</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
};

export const Semantic: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card variant="alert">
        <CardHeader className="flex-row gap-3">
          <TriangleAlertIcon
            className="mt-0.5 size-5 shrink-0 text-error"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-1">
            <CardTitle className="text-error">Alert card</CardTitle>
            <CardDescription>
              Saldo pode ficar negativo em 4 dias.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card variant="ai">
        <CardHeader className="flex-row gap-3">
          <SparklesIcon
            className="mt-0.5 size-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-1">
            <CardTitle>AI card</CardTitle>
            <CardDescription>
              Um padrão nos seus gastos merece atenção.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  ),
};

export const AsButton: Story = {
  render: () => (
    <div className="w-[min(90vw,20rem)]">
      <Card variant="interactive" asChild>
        <button type="button" className="w-full text-left">
          <CardHeader>
            <CardTitle>Conta PJ</CardTitle>
            <CardDescription>Clique para ver os lançamentos</CardDescription>
          </CardHeader>
        </button>
      </Card>
    </div>
  ),
};
