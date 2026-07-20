import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./DropdownMenu";

function Menu({
  onEdit,
  onDelete,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
} = {}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Ações</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={onEdit}>
          Editar
          <DropdownMenuShortcut>E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>Duplicar</DropdownMenuItem>
        <DropdownMenuItem disabled>Exportar</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger" onSelect={onDelete}>
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("DropdownMenu", () => {
  it("is closed until the trigger is activated", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ações" }));

    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(4);
  });

  it("runs onSelect and closes when an item is chosen", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<Menu onEdit={onEdit} />);

    await user.click(screen.getByRole("button", { name: "Ações" }));
    await user.click(await screen.findByRole("menuitem", { name: /Editar/ }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("marks disabled items and does not fire them", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    await user.click(screen.getByRole("button", { name: "Ações" }));

    const exportItem = await screen.findByRole("menuitem", {
      name: "Exportar",
    });
    expect(exportItem).toHaveAttribute("data-disabled");
  });

  it("styles the danger variant with error colors", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    await user.click(screen.getByRole("button", { name: "Ações" }));

    expect(
      await screen.findByRole("menuitem", { name: "Excluir" }),
    ).toHaveClass("text-error");
  });
});
