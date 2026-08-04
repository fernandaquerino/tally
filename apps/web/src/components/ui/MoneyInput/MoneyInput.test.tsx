import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MoneyInput } from "./MoneyInput";

describe("MoneyInput", () => {
  it("renders a monetary input with the expected typography", () => {
    render(<MoneyInput label="Valor" placeholder="0,00" />);

    const input = screen.getByLabelText("Valor");

    expect(screen.getByText("R$")).toBeInTheDocument();
    expect(input).toHaveAttribute("inputmode", "decimal");
    expect(input).toHaveClass(
      "font-mono",
      "text-lg",
      "font-semibold",
      "tabular-nums",
      "pl-10",
    );
    // Sem valor => campo vazio (placeholder aparece).
    expect(input).toHaveValue("");
  });

  it("preserves the Input states and custom classes", () => {
    render(
      <MoneyInput
        className="text-primary"
        error="Informe um valor"
        label="Valor"
      />,
    );

    expect(screen.getByLabelText("Valor")).toHaveClass("text-primary");
    expect(screen.getByRole("alert")).toHaveTextContent("Informe um valor");
  });

  it("formats a controlled cents value as pt-BR", () => {
    render(<MoneyInput aria-label="Valor" value={850000n} readOnly />);

    expect(screen.getByLabelText("Valor")).toHaveValue("8.500,00");
  });

  it("accumulates typed digits as cents and reports bigint cents", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<MoneyInput label="Valor" onValueChange={onValueChange} />);

    const input = screen.getByLabelText("Valor");
    await user.type(input, "125000");

    // Cada dígito é um centavo: 125000 centavos => "1.250,00".
    expect(input).toHaveValue("1.250,00");
    expect(onValueChange).toHaveBeenLastCalledWith(125000n);
  });

  it("ignores non-digit characters while typing", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<MoneyInput label="Valor" onValueChange={onValueChange} />);

    const input = screen.getByLabelText("Valor");
    await user.type(input, "R$ 10,5a");

    // Dígitos: "1","0","5" => 105 centavos => "1,05".
    expect(input).toHaveValue("1,05");
    expect(onValueChange).toHaveBeenLastCalledWith(105n);
  });

  it("reports undefined when the field is cleared", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <MoneyInput
        label="Valor"
        defaultValue={5000n}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByLabelText("Valor");
    expect(input).toHaveValue("50,00");

    await user.clear(input);

    expect(input).toHaveValue("");
    expect(onValueChange).toHaveBeenLastCalledWith(undefined);
  });

  it.each([
    ["income", "text-income"],
    ["expense", "text-expense"],
  ] as const)("uses the %s color", (transactionType, expectedClass) => {
    render(
      <MoneyInput
        aria-label="Valor"
        transactionType={transactionType}
        value={125000n}
        readOnly
      />,
    );

    expect(screen.getByLabelText("Valor")).toHaveClass(expectedClass);
  });
});
