import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card";

describe("Card", () => {
  it("renders composed content with title and description", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>surface + border</CardDescription>
        </CardHeader>
        <CardContent>corpo</CardContent>
        <CardFooter>rodapé</CardFooter>
      </Card>,
    );

    expect(
      screen.getByRole("heading", { name: "Default", level: 3 }),
    ).toBeInTheDocument();
    expect(screen.getByText("surface + border")).toBeInTheDocument();
    expect(screen.getByText("corpo")).toBeInTheDocument();
    expect(screen.getByText("rodapé")).toBeInTheDocument();
  });

  it("applies the default variant styling", () => {
    render(<Card data-testid="card">conteúdo</Card>);

    const card = screen.getByTestId("card");
    expect(card).toHaveClass("bg-card");
    expect(card).toHaveAttribute("data-slot", "card");
  });

  it("applies variant classes for the selected variant", () => {
    render(
      <Card data-testid="card" variant="selected">
        conteúdo
      </Card>,
    );

    expect(screen.getByTestId("card")).toHaveClass("border-primary");
  });

  it("merges consumer className over the variant", () => {
    render(
      <Card data-testid="card" className="bg-red-500">
        conteúdo
      </Card>,
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveClass("bg-red-500");
    expect(card).not.toHaveClass("bg-card");
  });

  it("renders as a child element when asChild is set", () => {
    render(
      <Card asChild variant="interactive">
        <button type="button">Abrir conta</button>
      </Card>,
    );

    const button = screen.getByRole("button", { name: "Abrir conta" });
    expect(button).toHaveAttribute("data-slot", "card");
    expect(button).toHaveClass("cursor-pointer");
  });
});
