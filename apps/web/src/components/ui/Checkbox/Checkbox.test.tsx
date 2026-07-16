import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("associates the label with the input", () => {
    render(<Checkbox label="Recorrente" />);

    const checkbox = screen.getByRole("checkbox", { name: "Recorrente" });
    expect(checkbox).not.toBeChecked();
  });

  it("toggles when uncontrolled and reports the new value", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Recorrente" onCheckedChange={onCheckedChange} />);

    const checkbox = screen.getByRole("checkbox", { name: "Recorrente" });
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it("respects the controlled checked prop", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        label="Recorrente"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Recorrente" });
    await user.click(checkbox);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).not.toBeChecked();
  });

  it("exposes a mixed state when indeterminate", () => {
    render(<Checkbox label="Indeterminate" indeterminate />);

    const checkbox = screen.getByRole("checkbox", { name: "Indeterminate" });
    expect(checkbox).toHaveAttribute("aria-checked", "mixed");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox label="Disabled" disabled onCheckedChange={onCheckedChange} />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Disabled" });
    expect(checkbox).toBeDisabled();

    await user.click(checkbox);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("links the error message and marks the field invalid", () => {
    render(
      <Checkbox label="Aceito os termos" error="Campo obrigatório" required />,
    );

    const checkbox = screen.getByRole("checkbox", { name: /Aceito os termos/ });
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Campo obrigatório");
    expect(checkbox).toHaveAccessibleDescription("Campo obrigatório");
  });

  it("links helper text via aria-describedby", () => {
    render(<Checkbox label="Recorrente" helperText="Repete todo mês." />);

    const checkbox = screen.getByRole("checkbox", { name: "Recorrente" });
    expect(checkbox).toHaveAccessibleDescription("Repete todo mês.");
  });
});
