import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Select, type SelectGroup } from "./Select";

const groups: SelectGroup[] = [
  {
    label: "Despesas",
    options: [
      { value: "food", label: "Alimentação", color: "var(--warning)" },
      { value: "transport", label: "Transporte", color: "var(--info)" },
      { value: "disabled", label: "Indisponível", disabled: true },
    ],
  },
];

describe("Select", () => {
  it("opens the listbox and selects an option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select
        groups={groups}
        label="Categoria"
        onValueChange={onValueChange}
        placeholder="Selecione"
      />,
    );

    const trigger = screen.getByRole("button", { name: "Categoria" });
    expect(trigger).toHaveTextContent("Selecione");

    await user.click(trigger);
    expect(screen.getByRole("listbox", { name: "Categoria" })).toBeVisible();

    await user.click(screen.getByRole("option", { name: "Transporte" }));
    expect(trigger).toHaveTextContent("Transporte");
    expect(onValueChange).toHaveBeenCalledWith("transport");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("supports keyboard navigation and selection", async () => {
    const user = userEvent.setup();
    render(<Select groups={groups} label="Categoria" />);

    const trigger = screen.getByRole("button", { name: "Categoria" });
    trigger.focus();
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");

    expect(trigger).toHaveTextContent("Transporte");
  });

  it("does not select disabled options", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select
        groups={groups}
        label="Categoria"
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Categoria" }));
    await user.click(screen.getByRole("option", { name: "Indisponível" }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeVisible();
  });

  it("exposes helper, error, disabled and form states", () => {
    const { rerender } = render(
      <Select
        defaultValue="food"
        groups={groups}
        helperText="Escolha uma categoria"
        label="Categoria"
        name="category"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Categoria" }),
    ).toHaveAccessibleDescription("Escolha uma categoria");
    expect(document.querySelector('input[name="category"]')).toHaveValue(
      "food",
    );

    rerender(
      <Select
        disabled
        error="Selecione uma categoria"
        groups={groups}
        label="Categoria"
      />,
    );

    expect(screen.getByRole("button", { name: "Categoria" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Categoria" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Selecione uma categoria",
    );
  });
});
