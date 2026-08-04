import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders a decorative, animated placeholder", () => {
    render(<Skeleton data-testid="sk" className="h-4 w-40" />);

    const skeleton = screen.getByTestId("sk");
    expect(skeleton).toHaveAttribute("data-slot", "skeleton");
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton).toHaveClass("animate-pulse");
  });

  it("merges consumer classes for sizing/shape", () => {
    render(<Skeleton data-testid="sk" className="size-10 rounded-full" />);

    const skeleton = screen.getByTestId("sk");
    expect(skeleton).toHaveClass("rounded-full");
    expect(skeleton).not.toHaveClass("rounded-md");
  });
});
