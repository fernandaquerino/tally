import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RadioCardGroup, type RadioCardOption } from "./RadioCard";

const pfOption: RadioCardOption = {
  value: "pf",
  label: "Pessoal (PF)",
  description: "Sua vida financeira pessoal",
  accent: "pf",
};

const pjOption: RadioCardOption = {
  value: "pj",
  label: "Empresa (PJ)",
  description: "Faturamento e custos da empresa",
  accent: "pj",
};

const options: RadioCardOption[] = [pfOption, pjOption];

describe("RadioCardGroup", () => {
  it("renders a labelled radiogroup with the given options", () => {
    render(<RadioCardGroup label="Contexto" options={options} />);

    expect(
      screen.getByRole("radiogroup", { name: "Contexto" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("selects an option and reports the new value when uncontrolled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioCardGroup
        label="Contexto"
        options={options}
        onValueChange={onValueChange}
      />,
    );

    const pj = screen.getByRole("radio", { name: /Empresa \(PJ\)/ });
    await user.click(pj);

    expect(pj).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith("pj");
  });

  it("reflects the controlled value and does not update itself", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioCardGroup
        label="Contexto"
        options={options}
        value="pf"
        onValueChange={onValueChange}
      />,
    );

    const pf = screen.getByRole("radio", { name: /Pessoal \(PF\)/ });
    const pj = screen.getByRole("radio", { name: /Empresa \(PJ\)/ });
    expect(pf).toBeChecked();

    await user.click(pj);
    expect(onValueChange).toHaveBeenCalledWith("pj");
    expect(pf).toBeChecked();
    expect(pj).not.toBeChecked();
  });

  it("honors defaultValue", () => {
    render(
      <RadioCardGroup label="Contexto" options={options} defaultValue="pj" />,
    );

    expect(screen.getByRole("radio", { name: /Empresa \(PJ\)/ })).toBeChecked();
  });

  it("does not select a disabled option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioCardGroup
        label="Contexto"
        options={[pfOption, { ...pjOption, disabled: true }]}
        onValueChange={onValueChange}
      />,
    );

    const pj = screen.getByRole("radio", { name: /Empresa \(PJ\)/ });
    expect(pj).toBeDisabled();

    await user.click(pj);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("links the error message and marks the group invalid", () => {
    render(
      <RadioCardGroup
        label="Contexto"
        options={options}
        error="Selecione um contexto"
        required
      />,
    );

    const group = screen.getByRole("radiogroup", { name: "Contexto" });
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAccessibleDescription("Selecione um contexto");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Selecione um contexto",
    );
  });
});
