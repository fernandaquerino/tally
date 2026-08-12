import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Range } from "./Range";

describe("Range", () => {
  it("renders an accessible slider with its bounds and value", () => {
    render(
      <Range aria-label="Percentual de imposto" min={0} max={40} value={26} />,
    );

    const slider = screen.getByRole("slider", {
      name: "Percentual de imposto",
    });
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "40");
    expect(slider).toHaveValue("26");
  });

  it("updates an uncontrolled value and reports the change", () => {
    const onValueChange = vi.fn();
    render(
      <Range
        aria-label="Percentual"
        defaultValue={20}
        onValueChange={onValueChange}
      />,
    );

    const slider = screen.getByRole("slider", { name: "Percentual" });
    fireEvent.change(slider, { target: { value: "35" } });

    expect(slider).toHaveValue("35");
    expect(onValueChange).toHaveBeenCalledWith(35);
  });

  it("can receive keyboard focus", async () => {
    const user = userEvent.setup();
    render(<Range aria-label="Percentual" defaultValue={20} />);

    const slider = screen.getByRole("slider", { name: "Percentual" });
    await user.tab();

    expect(slider).toHaveFocus();
  });

  it("does not change or call back when read-only", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Range
        aria-label="Percentual"
        value={26}
        readOnly
        onValueChange={onValueChange}
      />,
    );

    const slider = screen.getByRole("slider", { name: "Percentual" });
    slider.focus();
    await user.keyboard("{ArrowRight}");

    expect(slider).toHaveValue("26");
    expect(slider).toHaveAttribute("aria-readonly", "true");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("uses the selected color variant", () => {
    render(<Range aria-label="Reserva" value={25} variant="pj" />);

    expect(
      screen.getByRole("slider", { name: "Reserva" }).parentElement,
    ).toHaveStyle({
      "--range-color": "var(--pj)",
    });
  });
});
