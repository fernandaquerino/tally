import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its content with the default neutral variant", () => {
    render(<Badge>Recorrente</Badge>);

    const badge = screen.getByText("Recorrente");
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge).toHaveClass("text-foreground-muted");
  });

  it("applies variant classes", () => {
    render(<Badge variant="success">Pago</Badge>);

    expect(screen.getByText("Pago")).toHaveClass("bg-success-subtle");
  });

  it("lets the consumer className override the variant", () => {
    render(
      <Badge variant="success" className="bg-black">
        Pago
      </Badge>,
    );

    const badge = screen.getByText("Pago");
    expect(badge).toHaveClass("bg-black");
    expect(badge).not.toHaveClass("bg-success-subtle");
  });

  it("renders as a child element when asChild is set", () => {
    render(
      <Badge asChild variant="info">
        <a href="/filtro">Filtro</a>
      </Badge>,
    );

    const link = screen.getByRole("link", { name: "Filtro" });
    expect(link).toHaveAttribute("data-slot", "badge");
  });
});
