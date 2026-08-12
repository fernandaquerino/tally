import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PillRadioGroup, type PillRadioOption } from "./PillRadioGroup";

const options: PillRadioOption[] = [
  { value: "design", label: "Design" },
  { value: "development", label: "Desenvolvimento" },
  { value: "consulting", label: "Consultoria" },
];

describe("PillRadioGroup", () => {
  it("renders an accessible group and its options", () => {
    render(
      <PillRadioGroup label="O que você faz?" options={options} optional />,
    );

    expect(
      screen.getByRole("group", { name: /O que você faz?/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByText("Opcional")).toBeInTheDocument();
  });

  it("selects only one option and reports changes when uncontrolled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <PillRadioGroup
        label="O que você faz?"
        options={options}
        onValueChange={onValueChange}
      />,
    );

    const design = screen.getByRole("radio", { name: "Design" });
    const development = screen.getByRole("radio", {
      name: "Desenvolvimento",
    });

    await user.click(design);
    expect(design).toBeChecked();

    await user.click(development);
    expect(design).not.toBeChecked();
    expect(development).toBeChecked();
    expect(onValueChange).toHaveBeenNthCalledWith(1, "design");
    expect(onValueChange).toHaveBeenNthCalledWith(2, "development");
  });

  it("honors a default value", () => {
    render(
      <PillRadioGroup
        label="O que você faz?"
        options={options}
        defaultValue="consulting"
      />,
    );

    expect(screen.getByRole("radio", { name: "Consultoria" })).toBeChecked();
  });

  it("reflects a controlled value without changing it internally", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <PillRadioGroup
        label="O que você faz?"
        options={options}
        value="design"
        onValueChange={onValueChange}
      />,
    );

    const design = screen.getByRole("radio", { name: "Design" });
    const development = screen.getByRole("radio", {
      name: "Desenvolvimento",
    });

    await user.click(development);

    expect(onValueChange).toHaveBeenCalledWith("development");
    expect(design).toBeChecked();
    expect(development).not.toBeChecked();
  });

  it("does not select disabled options", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <PillRadioGroup
        label="O que você faz?"
        options={[
          { value: "design", label: "Design" },
          {
            value: "development",
            label: "Desenvolvimento",
            disabled: true,
          },
        ]}
        onValueChange={onValueChange}
      />,
    );

    const development = screen.getByRole("radio", {
      name: "Desenvolvimento",
    });
    expect(development).toBeDisabled();

    await user.click(development);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("can receive keyboard focus", async () => {
    const user = userEvent.setup();
    render(<PillRadioGroup label="O que você faz?" options={options} />);

    await user.tab();

    expect(screen.getByRole("radio", { name: "Design" })).toHaveFocus();
  });
});
