import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CnpjInput, formatCnpj } from "./CnpjInput";

describe("CnpjInput", () => {
  it("formats a complete CNPJ", () => {
    expect(formatCnpj("12345678000195")).toBe("12.345.678/0001-95");
  });

  it("renders an optional, numeric input with the expected placeholder", () => {
    render(<CnpjInput />);

    const input = screen.getByRole("textbox", { name: "CNPJ" });
    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(input).toHaveAttribute("placeholder", "00.000.000/0000-00");
  });

  it("applies the mask progressively and reports digits only", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<CnpjInput onValueChange={onValueChange} />);

    const input = screen.getByRole("textbox", { name: "CNPJ" });
    await user.type(input, "12345678000195");

    expect(input).toHaveValue("12.345.678/0001-95");
    expect(onValueChange).toHaveBeenLastCalledWith("12345678000195");
  });

  it("ignores non-digit characters and limits the value to 14 digits", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<CnpjInput onValueChange={onValueChange} />);

    const input = screen.getByRole("textbox", { name: "CNPJ" });
    await user.type(input, "12ab34567800019599");

    expect(input).toHaveValue("12.345.678/0001-95");
    expect(onValueChange).toHaveBeenLastCalledWith("12345678000195");
  });

  it("supports a controlled value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<CnpjInput value="12345678000195" onValueChange={onValueChange} />);

    const input = screen.getByRole("textbox", { name: "CNPJ" });
    expect(input).toHaveValue("12.345.678/0001-95");

    await user.clear(input);
    expect(onValueChange).toHaveBeenCalledWith("");
    expect(input).toHaveValue("12.345.678/0001-95");
  });
});
