import type { Meta, StoryObj } from "@storybook/nextjs";
import { CopyIcon, DownloadIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { Button } from "../Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./DropdownMenu";

const meta = {
  title: "UI/DropdownMenu",
  component: DropdownMenu,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RowActions: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Ações</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>
          <PencilIcon />
          Editar
          <DropdownMenuShortcut>E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon />
          Duplicar
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <DownloadIcon />
          Exportar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger">
          <Trash2Icon />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithLabelAndCheckboxes: Story = {
  render: function FiltersStory() {
    const [pf, setPf] = useState(true);
    const [pj, setPj] = useState(true);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Filtros</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Contexto</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={pf} onCheckedChange={setPf}>
            Pessoal
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={pj} onCheckedChange={setPj}>
            Empresa
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};
