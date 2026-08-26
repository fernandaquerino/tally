import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { StepLayout } from "./StepLayout";

describe("StepLayout", () => {
  it("renders the step content and handles navigation", async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    const onBack = vi.fn();

    render(
      <StepLayout
        step={2}
        title="Sua empresa"
        description="Conte sobre o faturamento."
        onNext={onNext}
        onBack={onBack}
      >
        <span>Conteúdo do passo</span>
      </StepLayout>,
    );

    expect(screen.getByText("Passo 2 de 5")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo do passo")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /continuar/i }));
    await user.click(screen.getByRole("button", { name: /voltar/i }));

    expect(onNext).toHaveBeenCalledOnce();
    expect(onBack).toHaveBeenCalledOnce();
  });
});
