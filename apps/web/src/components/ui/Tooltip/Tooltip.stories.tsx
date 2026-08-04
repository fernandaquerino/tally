import type { Meta, StoryObj } from "@storybook/nextjs";
import { InfoIcon } from "lucide-react";

import { Button } from "../Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Passe o mouse</Button>
      </TooltipTrigger>
      <TooltipContent>Este número é derivado das transações.</TooltipContent>
    </Tooltip>
  ),
};

export const OnIcon: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="O que é comprometido?">
          <InfoIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        Valor já reservado para faturas, parcelas e metas.
      </TooltipContent>
    </Tooltip>
  ),
};
