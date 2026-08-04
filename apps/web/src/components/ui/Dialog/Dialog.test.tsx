import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";

function ConfirmDialog({ onConfirm }: { onConfirm?: () => void } = {}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Abrir confirmação</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Excluir conta “Nubank PJ”?</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm}>
            Excluir conta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("is closed until the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Abrir confirmação" }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
  });

  it("labels the dialog with its title and description", async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog />);

    await user.click(screen.getByRole("button", { name: "Abrir confirmação" }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Excluir conta “Nubank PJ”?");
    expect(dialog).toHaveAccessibleDescription(
      "Esta ação não pode ser desfeita.",
    );
  });

  it("closes when the Cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog />);

    await user.click(screen.getByRole("button", { name: "Abrir confirmação" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog />);

    await user.click(screen.getByRole("button", { name: "Abrir confirmação" }));
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("runs the confirm handler when the destructive action is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<ConfirmDialog onConfirm={onConfirm} />);

    await user.click(screen.getByRole("button", { name: "Abrir confirmação" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Excluir conta" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("hides the close button when showCloseButton is false", async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog />);

    await user.click(screen.getByRole("button", { name: "Abrir confirmação" }));
    await screen.findByRole("dialog");

    expect(
      screen.queryByRole("button", { name: "Fechar" }),
    ).not.toBeInTheDocument();
  });
});
