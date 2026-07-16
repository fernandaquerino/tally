import type { Meta, StoryObj } from "@storybook/nextjs";

import { Skeleton } from "./Skeleton";

const meta = {
  title: "Feedbacks/Skeleton",
  component: Skeleton,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "h-4 w-48",
  },
};

/** Composição típica de loading — bloco de linhas dentro de um card. */
export const LoadingBlock: Story = {
  render: () => (
    <div className="w-[min(92vw,32rem)] rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  ),
};

export const Avatar: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  ),
};
