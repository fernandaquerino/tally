import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Button } from "../Button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "./Popover";

function FilterPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Filtros</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>Filtrar por</p>
        <PopoverClose asChild>
          <Button>Aplicar</Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}

describe("Popover", () => {
  it("is closed until the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<FilterPopover />);

    expect(screen.queryByText("Filtrar por")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Filtros" }));

    expect(await screen.findByText("Filtrar por")).toBeInTheDocument();
  });

  it("closes when a PopoverClose action is clicked", async () => {
    const user = userEvent.setup();
    render(<FilterPopover />);

    await user.click(screen.getByRole("button", { name: "Filtros" }));
    await screen.findByText("Filtrar por");

    await user.click(screen.getByRole("button", { name: "Aplicar" }));

    expect(screen.queryByText("Filtrar por")).not.toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<FilterPopover />);

    await user.click(screen.getByRole("button", { name: "Filtros" }));
    await screen.findByText("Filtrar por");

    await user.keyboard("{Escape}");

    expect(screen.queryByText("Filtrar por")).not.toBeInTheDocument();
  });

  it("marks the trigger expanded state", async () => {
    const user = userEvent.setup();
    render(<FilterPopover />);

    const trigger = screen.getByRole("button", { name: "Filtros" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    await screen.findByText("Filtrar por");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
