import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FadeIn } from "./FadeIn";

describe("FadeIn", () => {
  it("renderiza o conteúdo (visível por padrão, sem depender da animação)", () => {
    render(
      <FadeIn>
        <p>conteúdo</p>
      </FadeIn>,
    );

    expect(screen.getByText("conteúdo")).toBeInTheDocument();
  });

  it("repassa a className para o wrapper", () => {
    render(
      <FadeIn className="max-w-sm">
        <span>x</span>
      </FadeIn>,
    );

    expect(screen.getByText("x").parentElement).toHaveClass("max-w-sm");
  });
});
