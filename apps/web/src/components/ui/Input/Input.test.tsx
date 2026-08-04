import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from "./Input";

describe("Input", () => {
  it("associates a visible label with the input", () => {
    render(<Input label="Descrição" placeholder="Informe uma descrição" />);

    const input = screen.getByLabelText("Descrição");

    expect(input).toHaveAttribute("placeholder", "Informe uma descrição");
    expect(input).toHaveClass("rounded-md");
    expect(input).toHaveClass(
      "focus-visible:outline-[3px_solid_var(--primary-border)]",
    );
  });

  it("associates helper text with the input", () => {
    render(
      <Input helperText="Use um nome fácil de reconhecer" label="Descrição" />,
    );

    expect(screen.getByLabelText("Descrição")).toHaveAccessibleDescription(
      "Use um nome fácil de reconhecer",
    );
  });

  it("exposes an invalid state and announces the error", () => {
    render(<Input error="Informe um e-mail válido" label="E-mail" />);
    const input = screen.getByLabelText("E-mail");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveClass("aria-invalid:bg-error-subtle");
    expect(input).toHaveAccessibleDescription("Informe um e-mail válido");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Informe um e-mail válido",
    );
  });

  it("renders a prefix and adjusts the input spacing", () => {
    render(<Input aria-label="Valor" prefix="R$" />);

    expect(screen.getByText("R$")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor")).toHaveClass("pl-10");
  });

  it("supports disabled and read-only states", () => {
    const { rerender } = render(<Input disabled label="Conta" />);

    expect(screen.getByLabelText("Conta")).toBeDisabled();

    rerender(<Input label="Conta" readOnly />);
    expect(screen.getByLabelText("Conta")).toHaveAttribute("readonly");
  });

  it("marks required fields visually and semantically", () => {
    render(<Input label="Nome" required />);

    expect(screen.getByRole("textbox", { name: /Nome/ })).toBeRequired();
  });
});
