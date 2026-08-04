import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

function InfoTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger>Comprometido</TooltipTrigger>
      <TooltipContent>Valor reservado para faturas e metas.</TooltipContent>
    </Tooltip>
  );
}

describe("Tooltip", () => {
  it("is hidden until the trigger is focused", () => {
    render(<InfoTooltip />);

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows the content on focus and describes the trigger", async () => {
    render(<InfoTooltip />);

    fireEvent.focus(screen.getByText("Comprometido"));

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Valor reservado para faturas e metas.");

    // O trigger é descrito pelo tooltip (a11y).
    const trigger = screen.getByRole("button", { name: /Comprometido/ });
    expect(trigger).toHaveAttribute("aria-describedby");
  });

  it("hides again on blur", async () => {
    render(<InfoTooltip />);

    const trigger = screen.getByText("Comprometido");
    fireEvent.focus(trigger);
    await screen.findByRole("tooltip");

    fireEvent.blur(trigger);

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
