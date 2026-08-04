import type { Meta, StoryObj } from "@storybook/nextjs";

import { Switch } from "./Switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    label: "Alertas por e-mail",
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    defaultChecked: true,
  },
};

export const On: Story = {
  args: {
    label: "Alertas por e-mail",
    defaultChecked: true,
  },
};

export const Off: Story = {
  args: {
    label: "Modo privacidade",
    defaultChecked: false,
  },
};

export const Disabled: Story = {
  args: {
    label: "Sincronização auto",
    disabled: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Resumo semanal",
    defaultChecked: true,
    helperText: "Enviamos um resumo das suas finanças toda segunda-feira.",
  },
};

export const SettingsList: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Switch label="Alertas por e-mail" defaultChecked />
      <Switch label="Modo privacidade" />
      <Switch label="Sincronização auto" disabled />
    </div>
  ),
};
