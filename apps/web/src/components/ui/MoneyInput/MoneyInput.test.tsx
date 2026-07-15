import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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

  it.each([
    ["income", "text-income"],
    ["expense", "text-expense"],
  ] as const)("uses the %s color", (transactionType, expectedClass) => {
    render(
      <MoneyInput
        aria-label="Valor"
        transactionType={transactionType}
        value="1.250,00"
        readOnly
      />,
    );

    expect(screen.getByLabelText("Valor")).toHaveClass(expectedClass);
  });
});
