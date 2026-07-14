import type { Meta, StoryObj } from "@storybook/nextjs";
import type { InputHTMLAttributes } from "react";

import { Input } from "./Input";

interface InputStoryArgs {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  helperText?: string;
  error?: string;
  prefix?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
}

const meta = {
  title: "UI/Input",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    label: "Descrição",
    placeholder: "Ex.: Assinatura Figma",
  },
  argTypes: {
    error: { control: "text" },
    helperText: { control: "text" },
    prefix: { control: "text" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  decorators: [
    (Story, context) =>
      context.parameters.layout === "fullscreen" ? (
        <Story />
      ) : (
        <div className="w-[min(90vw,22rem)]">
          <Story />
        </div>
      ),
  ],
  render: (args) => <Input {...args} />,
} satisfies Meta<InputStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FormControls: Story = {
  name: "Todos os estados",
  parameters: {
    controls: { disable: true },
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background px-8 py-10 text-foreground">
        <div className="mx-auto max-w-5xl">
          <Story />
        </div>
      </div>
    ),
  ],
  render: () => (
    <div>
      <header className="mb-8 space-y-3">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-foreground-subtle">
          <span className="text-primary">09</span>
          <span className="h-px w-6 bg-border-strong" />
          <span>Componentes</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Form controls</h1>
        <p className="max-w-3xl text-sm leading-6 text-foreground-muted">
          Labels sempre visíveis — nunca placeholder no lugar de label. Erros
          associados ao campo via{" "}
          <code className="text-primary">aria-describedby</code>.
        </p>
      </header>

      <div className="grid gap-x-5 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
        <Input
          helperText="Default"
          label="Descrição"
          placeholder="Ex.: Assinatura Figma"
        />
        <Input
          helperText="Prefixo monetário"
          label="Valor"
          placeholder="0,00"
          prefix="R$"
        />
        <Input
          autoFocus
          defaultValue="Consultoria — Maio"
          helperText="Focus"
          label="Foco"
        />
        <Input
          defaultValue="12.345.678/0001-90"
          helperText="CNPJ válido"
          label="CNPJ da empresa"
        />
        <Input
          defaultValue="contato@"
          error="Informe um e-mail válido"
          label="E-mail"
          type="email"
        />
        <Input
          disabled
          defaultValue="Nubank PF"
          helperText="Disabled / read-only"
          label="Conta vinculada"
        />
      </div>
    </div>
  ),
};

export const WithPrefix: Story = {
  args: {
    label: "Valor",
    prefix: "R$",
    placeholder: "0,00",
  },
};

export const Error: Story = {
  args: {
    label: "E-mail",
    defaultValue: "contato@",
    error: "Informe um e-mail válido",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: "Conta vinculada",
    defaultValue: "Nubank PF",
    helperText: "Disabled / read-only",
  },
};
