import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "../Button";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders the title as a heading with a description", () => {
    render(
      <EmptyState
        title="Nenhuma transação ainda"
        description="Adicione sua primeira transação."
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Nenhuma transação ainda" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Adicione sua primeira transação."),
    ).toBeInTheDocument();
  });

  it("renders action buttons passed as children", () => {
    render(
      <EmptyState title="Vazio">
        <Button>Adicionar transação</Button>
        <Button variant="outline">Importar extrato</Button>
      </EmptyState>,
    );

    expect(
      screen.getByRole("button", { name: "Adicionar transação" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Importar extrato" }),
    ).toBeInTheDocument();
  });

  it("omits the description and actions when not provided", () => {
    render(<EmptyState title="Vazio" />);

    expect(screen.getByRole("heading", { name: "Vazio" })).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
