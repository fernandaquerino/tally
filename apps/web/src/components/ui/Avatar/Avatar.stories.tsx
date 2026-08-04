import type { Meta, StoryObj } from "@storybook/nextjs";

import { Avatar, AvatarGroup } from "./Avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    name: "Marina Alves",
    size: "md",
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Initials: Story = {};

export const Image: Story = {
  args: {
    name: "Marina Alves",
    src: "https://i.pravatar.cc/150?img=47",
  },
};

export const BrokenImageFallsBack: Story = {
  args: {
    name: "Rafael Souza",
    src: "https://example.com/does-not-exist.png",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Marina Alves" size="sm" />
      <Avatar name="Marina Alves" size="md" />
      <Avatar name="Marina Alves" size="lg" />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup max={2}>
      <Avatar name="Marina Alves" />
      <Avatar name="Rafael Souza" />
      <Avatar name="Bruno Lima" />
      <Avatar name="Carla Dias" />
      <Avatar name="Diego Nunes" />
    </AvatarGroup>
  ),
};
