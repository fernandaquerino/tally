import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Switch } from "./Switch";

describe("Switch", () => {
  it("associates the label and exposes the switch role", () => {
    render(<Switch label="Alertas por e-mail" />);

    const toggle = screen.getByRole("switch", { name: "Alertas por e-mail" });
    expect(toggle).not.toBeChecked();
  });

  it("toggles when uncontrolled and reports the new value", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch label="Modo privacidade" onCheckedChange={onCheckedChange} />,
    );

    const toggle = screen.getByRole("switch", { name: "Modo privacidade" });
    await user.click(toggle);

    expect(toggle).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    await user.click(toggle);
    expect(toggle).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it("respects the controlled checked prop", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch
        label="Modo privacidade"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );

    const toggle = screen.getByRole("switch", { name: "Modo privacidade" });
    await user.click(toggle);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(toggle).not.toBeChecked();
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch
        label="Sincronização auto"
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );

    const toggle = screen.getByRole("switch", { name: "Sincronização auto" });
    expect(toggle).toBeDisabled();

    await user.click(toggle);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("links helper text via aria-describedby", () => {
    render(<Switch label="Resumo semanal" helperText="Toda segunda-feira." />);

    const toggle = screen.getByRole("switch", { name: "Resumo semanal" });
    expect(toggle).toHaveAccessibleDescription("Toda segunda-feira.");
  });

  it("links the error message and marks the field invalid", () => {
    render(
      <Switch label="Aceito os termos" error="Campo obrigatório" required />,
    );

    const toggle = screen.getByRole("switch", { name: /Aceito os termos/ });
    expect(toggle).toHaveAttribute("aria-invalid", "true");
    expect(toggle).toHaveAccessibleDescription("Campo obrigatório");
    expect(screen.getByRole("alert")).toHaveTextContent("Campo obrigatório");
  });
});
