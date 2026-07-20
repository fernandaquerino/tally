import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Alert, AlertDescription, AlertTitle } from "./Alert";

describe("Alert", () => {
  it("renders with the alert role and default info styling and icon", () => {
    render(<Alert>Sua fatura fecha em 3 dias.</Alert>);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Sua fatura fecha em 3 dias.");
    expect(alert).toHaveClass("bg-info-subtle");
    expect(alert.querySelector("svg")).toBeInTheDocument();
  });

  it("applies variant styling", () => {
    render(<Alert variant="danger">Conta atrasada há 2 dias.</Alert>);

    expect(screen.getByRole("alert")).toHaveClass("bg-error-subtle");
  });

  it("hides the icon when icon is null", () => {
    render(
      <Alert variant="warning" icon={null}>
        Gasto acima da média.
      </Alert>,
    );

    expect(screen.getByRole("alert").querySelector("svg")).toBeNull();
  });

  it("supports composed title and description", () => {
    render(
      <Alert variant="warning">
        <AlertTitle>Gasto acima da média</AlertTitle>
        <AlertDescription>40% acima do mês passado.</AlertDescription>
      </Alert>,
    );

    expect(screen.getByText("Gasto acima da média")).toBeInTheDocument();
    expect(screen.getByText("40% acima do mês passado.")).toBeInTheDocument();
  });
});
