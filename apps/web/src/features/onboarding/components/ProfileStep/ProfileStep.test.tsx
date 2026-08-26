import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { OnboardingData } from "../../types";
import { ProfileStep } from "./ProfileStep";

const data: OnboardingData = {
  name: "Fernanda",
  occupation: null,
  monthlyRevenueCents: "100000",
  cnpj: null,
  taxRegime: "unknown",
  taxPercentage: 15,
  reservePercentage: 10,
  initialAccountType: "business_account",
};

describe("ProfileStep", () => {
  it("reports profile field changes to the onboarding flow", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ProfileStep
        data={data}
        onChange={onChange}
        onNext={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole("textbox", { name: "Seu nome" }), {
      target: { value: "Ana" },
    });
    await user.click(screen.getByText("Desenvolvimento"));

    expect(onChange).toHaveBeenCalledWith({ name: "Ana" });
    expect(onChange).toHaveBeenCalledWith({ occupation: "development" });
  });
});
