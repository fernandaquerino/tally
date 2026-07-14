import type { Meta, StoryObj } from "@storybook/nextjs";
import { ArrowRight, Plus } from "lucide-react";

import { Button, type ButtonProps } from "./Button";

const variants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const satisfies readonly NonNullable<ButtonProps["variant"]>[];

const variantLabels: Record<(typeof variants)[number], string> = {
  default: "Primary",
  secondary: "Secondary",
  outline: "Outline",
  ghost: "Ghost",
  destructive: "Destructive",
  link: "Link",
};

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    children: "Button",
    variant: "default",
    size: "default",
    loading: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: variants,
    },
    size: {
      control: "select",
      options: ["sm", "default", "md", "lg", "icon-sm", "icon", "icon-lg"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    asChild: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  name: "Todas as variantes",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-[7rem_repeat(3,max-content)] items-center gap-x-4 gap-y-5">
      <span />
      <span className="text-xs font-medium text-foreground-muted">Small</span>
      <span className="text-xs font-medium text-foreground-muted">Medium</span>
      <span className="text-xs font-medium text-foreground-muted">Large</span>

      {variants.map((variant) => (
        <div className="contents" key={variant}>
          <span className="text-sm font-medium text-foreground-muted">
            {variantLabels[variant]}
          </span>
          <Button size="sm" variant={variant}>
            Button
          </Button>
          <Button size="md" variant={variant}>
            Button
          </Button>
          <Button size="lg" variant={variant}>
            Button
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  name: "Com ícones",
  render: () => (
    <div className="flex items-center gap-4">
      <Button variant="outline">
        <Plus />
        Adicionar
      </Button>
      <Button>
        Continuar
        <ArrowRight />
      </Button>
    </div>
  ),
};

export const IconSizes: Story = {
  name: "Tamanhos de ícone",
  render: () => (
    <div className="flex items-center gap-4">
      <Button aria-label="Adicionar" size="icon-sm">
        <Plus />
      </Button>
      <Button aria-label="Adicionar" size="icon">
        <Plus />
      </Button>
      <Button aria-label="Adicionar" size="icon-lg">
        <Plus />
      </Button>
    </div>
  ),
};

export const States: Story = {
  name: "Estados",
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Button>Default</Button>
      <Button loading>Carregando</Button>
      <Button disabled>Desabilitado</Button>
      <Button disabled variant="outline">
        Outline desabilitado
      </Button>
    </div>
  ),
};
