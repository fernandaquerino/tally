import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { endOfMonth, startOfMonth } from "date-fns";
import { describe, expect, it, vi } from "vitest";

import { DatePicker, type DatePickerPresetRange } from "./DatePicker";

const reference = new Date(2026, 5, 9); // 9 Jun 2026

describe("DatePicker", () => {
  it("renders the referenced month caption", () => {
    render(<DatePicker mode="single" defaultMonth={reference} />);

    expect(screen.getByText("Junho 2026")).toBeInTheDocument();
  });

  it("selects a day and reports it (single mode)", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DatePicker
        mode="single"
        defaultMonth={reference}
        onValueChange={onValueChange}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "terça-feira, 9 de junho de 2026" }),
    );

    expect(onValueChange).toHaveBeenCalledTimes(1);
    const selected = onValueChange.mock.calls[0]![0] as Date;
    expect(selected.getDate()).toBe(9);
    expect(selected.getMonth()).toBe(5);
  });

  it("navigates to the next month", async () => {
    const user = userEvent.setup();
    render(<DatePicker mode="single" defaultMonth={reference} />);

    await user.click(
      screen.getByRole("button", { name: "Ir para o próximo mês" }),
    );

    expect(screen.getByText("Julho 2026")).toBeInTheDocument();
  });

  it("applies a preset range and marks it active", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const presets: DatePickerPresetRange[] = [
      {
        label: "Este mês",
        value: { from: startOfMonth(reference), to: endOfMonth(reference) },
      },
    ];
    render(
      <DatePicker
        mode="range"
        defaultMonth={reference}
        presets={presets}
        onValueChange={onValueChange}
      />,
    );

    const presetButton = screen.getByRole("button", { name: "Este mês" });
    expect(presetButton).toHaveAttribute("aria-pressed", "false");

    await user.click(presetButton);

    expect(onValueChange).toHaveBeenCalledTimes(1);
    const range = onValueChange.mock.calls[0]![0] as {
      from: Date;
      to: Date;
    };
    expect(range.from.getDate()).toBe(1);
    expect(range.to.getDate()).toBe(30);
    expect(presetButton).toHaveAttribute("aria-pressed", "true");
  });
});
