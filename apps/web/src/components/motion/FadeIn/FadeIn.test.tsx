import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FadeIn } from "./FadeIn";

describe("FadeIn", () => {
  it("renders the content (visible by default, without relying on the animation)", () => {
    render(
      <FadeIn>
        <p>conteúdo</p>
      </FadeIn>,
    );

    expect(screen.getByText("conteúdo")).toBeInTheDocument();
  });

  it("forwards the className to the wrapper", () => {
    render(
      <FadeIn className="max-w-sm">
        <span>x</span>
      </FadeIn>,
    );

    expect(screen.getByText("x").parentElement).toHaveClass("max-w-sm");
  });
});
