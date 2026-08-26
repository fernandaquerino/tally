import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { OnboardingData } from "../../types";
import { CompanyStep } from "./CompanyStep";

const data: OnboardingData = {
  name: "Ana",
  occupation: null,
  monthlyRevenueCents: "",
  cnpj: null,
  taxRegime: "unknown",
  taxPercentage: 15,
  reservePercentage: 10,
  initialAccountType: "business_account",
};

describe("CompanyStep", () => {
  it("keeps navigation disabled without revenue and reports financial data", () => {
    const onChange = vi.fn();

    render(
      <CompanyStep
        data={data}
        onChange={onChange}
        onNext={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /continuar/i })).toBeDisabled();

    fireEvent.change(
      screen.getByRole("textbox", { name: "Faturamento médio mensal" }),
      { target: { value: "1000" } },
    );
    fireEvent.change(screen.getByRole("textbox", { name: "CNPJ" }), {
      target: { value: "12345678000190" },
    });

    expect(onChange).toHaveBeenCalledWith({ monthlyRevenueCents: "1000" });
    expect(onChange).toHaveBeenCalledWith({ cnpj: "12345678000190" });
  });
});
