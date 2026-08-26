import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { WelcomeStep } from "./WelcomeStep";

describe("WelcomeStep", () => {
  it("presents the onboarding benefits and starts the flow", async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();

    render(<WelcomeStep onNext={onNext} />);

    expect(screen.getByText("Bem-vindo ao Tally")).toBeInTheDocument();
    expect(
      screen.getByText(/separa o dinheiro da empresa/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /começar/i }));
    expect(onNext).toHaveBeenCalledOnce();
  });
});
