import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  BarChart3Icon,
  LandmarkIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "../Button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "./CommandMenu";

const meta = {
  title: "UI/CommandMenu",
  component: Command,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Command>;

export default meta;

type Story = StoryObj<typeof meta>;

function Actions() {
  return (
    <CommandList>
      <CommandEmpty>Nenhum resultado.</CommandEmpty>
      <CommandGroup heading="Ações">
        <CommandItem>
          <PlusIcon className="text-primary" />
          Criar transação
          <CommandShortcut>C</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <LandmarkIcon className="text-foreground-subtle" />
          Ir para contas
        </CommandItem>
        <CommandItem>
          <BarChart3Icon className="text-foreground-subtle" />
          Abrir relatórios
        </CommandItem>
        <CommandItem className="text-primary data-[selected=true]:text-primary">
          <SparklesIcon className="text-primary" />
          Perguntar à IA
        </CommandItem>
      </CommandGroup>
    </CommandList>
  );
}

export const InlinePanel: Story = {
  render: () => (
    <div className="w-[min(92vw,32rem)]">
      <Command className="border border-border">
        <CommandInput
          placeholder="Buscar ou executar…"
          trailing={<CommandShortcut className="ml-0">ESC</CommandShortcut>}
        />
        <Actions />
      </Command>
    </div>
  ),
};

export const CommandK: Story = {
  render: function CommandKStory() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
      function onKeyDown(event: KeyboardEvent) {
        if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          setOpen((value) => !value);
        }
      }
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Abrir <CommandShortcut className="ml-2">⌘K</CommandShortcut>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Buscar ou executar…" />
          <Actions />
        </CommandDialog>
      </>
    );
  },
};
