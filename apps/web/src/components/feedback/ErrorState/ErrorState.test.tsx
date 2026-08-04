import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("has an alert role, a default title and description", () => {
    render(<ErrorState description="Não foi possível carregar seus dados." />);

    const region = screen.getByRole("alert");
    expect(region).toHaveTextContent("Algo deu errado");
    expect(region).toHaveTextContent("Não foi possível carregar seus dados.");
  });

  it("renders a retry button and fires onRetry", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState title="Erro de conexão" onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("supports a custom retry label", () => {
    render(<ErrorState onRetry={() => {}} retryLabel="Recarregar" />);

    expect(
      screen.getByRole("button", { name: "Recarregar" }),
    ).toBeInTheDocument();
  });

  it("does not render a retry button without onRetry or children", () => {
    render(<ErrorState title="Erro ao exportar" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders custom children instead of the default retry button", () => {
    render(
      <ErrorState title="Erro" onRetry={() => {}}>
        <a href="/suporte">Falar com suporte</a>
      </ErrorState>,
    );

    expect(
      screen.getByRole("link", { name: "Falar com suporte" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
