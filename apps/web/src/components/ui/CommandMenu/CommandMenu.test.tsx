import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "./CommandMenu";

function Palette({ onCreate }: { onCreate?: () => void } = {}) {
  return (
    <Command>
      <CommandInput placeholder="Buscar ou executar…" />
      <CommandList>
        <CommandEmpty>Nenhum resultado.</CommandEmpty>
        <CommandGroup heading="Ações">
          <CommandItem onSelect={onCreate}>
            Criar transação
            <CommandShortcut>C</CommandShortcut>
          </CommandItem>
          <CommandItem>Ir para contas</CommandItem>
          <CommandItem>Abrir relatórios</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

describe("CommandMenu", () => {
  it("renders the search field and grouped items", () => {
    render(<Palette />);

    expect(
      screen.getByPlaceholderText("Buscar ou executar…"),
    ).toBeInTheDocument();
    expect(screen.getByText("Ações")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("filters items by the typed query", async () => {
    const user = userEvent.setup();
    render(<Palette />);

    await user.type(
      screen.getByPlaceholderText("Buscar ou executar…"),
      "contas",
    );

    expect(screen.getByText("Ir para contas")).toBeInTheDocument();
    expect(screen.queryByText("Criar transação")).not.toBeInTheDocument();
    expect(screen.queryByText("Abrir relatórios")).not.toBeInTheDocument();
  });

  it("shows the empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(<Palette />);

    await user.type(
      screen.getByPlaceholderText("Buscar ou executar…"),
      "zzzzz",
    );

    expect(screen.getByText("Nenhum resultado.")).toBeInTheDocument();
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });

  it("runs onSelect when an item is chosen", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<Palette onCreate={onCreate} />);

    await user.click(screen.getByText("Criar transação"));

    expect(onCreate).toHaveBeenCalledTimes(1);
  });
});
