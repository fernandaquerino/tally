import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { OnboardingData } from "../../types";
import { SplitStep } from "./SplitStep";

const data: OnboardingData = {
  name: "Ana",
  occupation: null,
  monthlyRevenueCents: "100000",
  cnpj: null,
  taxRegime: "unknown",
  taxPercentage: 15,
  reservePercentage: 10,
  initialAccountType: "business_account",
};

describe("SplitStep", () => {
  it("calculates the split in cents and reports percentage changes", () => {
    const onChange = vi.fn();

    render(
      <SplitStep
        data={data}
        onChange={onChange}
        onNext={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    expect(screen.getByText("R$ 750,00")).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole("slider", { name: "Separado para imposto" }),
      { target: { value: "20" } },
    );

    expect(onChange).toHaveBeenCalledWith({ taxPercentage: 20 });
  });
});
