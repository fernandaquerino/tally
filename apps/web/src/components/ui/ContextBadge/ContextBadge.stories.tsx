import type { Meta, StoryObj } from "@storybook/nextjs";

import { ContextBadge } from "./ContextBadge";

const meta = {
  title: "UI/ContextBadge",
  component: ContextBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    context: {
      control: "inline-radio",
      options: ["pf", "pj"],
    },
  },
  args: {
    context: "pf",
  },
} satisfies Meta<typeof ContextBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Personal: Story = {
  args: { context: "pf" },
};

export const Business: Story = {
  args: { context: "pj" },
};

export const Both: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <ContextBadge context="pf" />
      <ContextBadge context="pj" />
    </div>
  ),
};

export const CustomLabel: Story = {
  args: { context: "pj", label: "Minha empresa" },
};

export const IconOnly: Story = {
  args: { context: "pf", label: "", showIcon: true },
};
