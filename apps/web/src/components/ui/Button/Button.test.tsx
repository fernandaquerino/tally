import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("renders as a button with a safe default type", () => {
    render(<Button>Salvar</Button>);

    expect(screen.getByRole("button", { name: "Salvar" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("calls the click handler when enabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Continuar</Button>);
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not call the click handler when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Excluir
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Excluir" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-disabled");

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("exposes a busy state and blocks interaction while loading", () => {
    const onClick = vi.fn();

    render(
      <Button loading onClick={onClick}>
        Salvando
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Salvando" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("data-loading");
    expect(button.querySelector("svg")).toBeInTheDocument();
    expect(screen.getByText("Salvando")).toBeVisible();

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies appearance and size variants", () => {
    render(
      <Button size="sm" variant="secondary">
        Filtrar
      </Button>,
    );

    expect(screen.getByRole("button", { name: "Filtrar" })).toHaveClass(
      "bg-secondary",
      "h-8",
    );
  });

  it("preserves custom classes", () => {
    render(<Button className="w-full">Finalizar</Button>);

    expect(screen.getByRole("button", { name: "Finalizar" })).toHaveClass(
      "w-full",
    );
  });

  it("renders the child element when asChild is enabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button asChild onClick={onClick}>
        <a href="#entrar">Entrar</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Entrar" });

    expect(link).toHaveAttribute("href", "#entrar");
    expect(link).toHaveAttribute("data-slot", "button");

    await user.click(link);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("removes a disabled asChild element from keyboard navigation", () => {
    const onClick = vi.fn();

    render(
      <Button asChild disabled onClick={onClick}>
        <a href="#continuar">Continuar</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Continuar" });

    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");

    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("accepts the required accessible name for an icon button", () => {
    render(
      <Button aria-label="Fechar" size="icon">
        <svg aria-hidden="true" />
      </Button>,
    );

    expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
  });
});
