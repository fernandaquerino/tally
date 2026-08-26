import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { OnboardingData } from "../../types";
import { TaxRegimeStep } from "./TaxRegimeStep";

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

describe("TaxRegimeStep", () => {
  it("reports the selected tax regime and shows the accounting warning", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TaxRegimeStep
        data={data}
        onChange={onChange}
        onNext={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/não é aconselhamento contábil/i),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: /MEI/i }));
    expect(onChange).toHaveBeenCalledWith({ taxRegime: "mei" });
  });
});
