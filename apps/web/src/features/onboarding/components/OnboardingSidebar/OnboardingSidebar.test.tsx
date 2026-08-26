import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OnboardingSidebar } from "./OnboardingSidebar";

describe("OnboardingSidebar", () => {
  it("shows every step and highlights the current one", () => {
    render(<OnboardingSidebar current={3} />);

    expect(screen.getByText("Perfil")).toBeInTheDocument();
    expect(screen.getByText("Conta inicial")).toBeInTheDocument();
    expect(screen.getByText("Regime fiscal")).toHaveClass("font-medium");
    expect(screen.getByText("Sua empresa")).not.toHaveClass("font-medium");
  });
});
