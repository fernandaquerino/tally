import { formatCents } from "@tally/shared";
import type { Meta, StoryObj } from "@storybook/nextjs";

import { Button } from "../Button";
import { ContextBadge } from "../ContextBadge";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./Drawer";

const meta = {
  title: "UI/Drawer",
  component: Drawer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Detail: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Ver detalhe</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Detalhe</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <div className="flex flex-col gap-3">
            <p className="text-3xl font-semibold text-income tabular-nums">
              {formatCents(850000n, { signDisplay: "always" })}
            </p>
            <p className="text-sm text-muted-foreground">Consultoria — Acme</p>
            <div>
              <ContextBadge context="pj" label="Empresa · PJ" />
            </div>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Editar conta</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar conta</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm text-muted-foreground">
            Ajuste os dados da conta PJ e salve para aplicar.
          </p>
        </DrawerBody>
        <DrawerFooter>
          <Button>Salvar</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const LeftSide: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Abrir menu</Button>
      </DrawerTrigger>
      <DrawerContent side="left">
        <DrawerHeader>
          <DrawerTitle>Navegação</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm text-muted-foreground">Conteúdo lateral.</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};
