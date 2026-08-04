import type { Meta, StoryObj } from "@storybook/nextjs";

import { Divider } from "./Divider";

const meta = {
  title: "UI/Divider",
  component: Divider,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-[min(92vw,28rem)]">
      <p className="text-sm text-foreground">Seção acima</p>
      <Divider {...args} className="my-4" />
      <p className="text-sm text-foreground">Seção abaixo</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="flex h-6 items-center gap-3 text-sm text-foreground">
      <span>PF</span>
      <Divider {...args} />
      <span>PJ</span>
      <Divider {...args} />
      <span>Tudo</span>
    </div>
  ),
};

/** Divider horizontal com rótulo centralizado — comum em formulários. */
export const WithLabel: Story = {
  render: () => (
    <div className="w-[min(92vw,28rem)]">
      <Divider label="ou" />
    </div>
  ),
};
