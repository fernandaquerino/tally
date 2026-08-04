import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "./Popover";

const meta = {
  title: "UI/Popover",
  component: Popover,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Filters: Story = {
  render: function FiltersStory() {
    const [empresa, setEmpresa] = useState(true);
    const [pendentes, setPendentes] = useState(false);

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Filtros</Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-foreground">Filtrar por</p>
            <Checkbox
              label="Somente Empresa"
              checked={empresa}
              onCheckedChange={setEmpresa}
            />
            <Checkbox
              label="Somente pendentes"
              checked={pendentes}
              onCheckedChange={setPendentes}
            />
            <PopoverClose asChild>
              <Button className="mt-1 w-full">Aplicar</Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
};

export const SimpleText: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Ver detalhe</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm text-muted-foreground">
          Este número é derivado das transações do período selecionado.
        </p>
      </PopoverContent>
    </Popover>
  ),
};
