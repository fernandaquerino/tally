import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { OnboardingData } from "../../types";
import { AccountStep } from "./AccountStep";

const data: OnboardingData = {
  name: "Ana",
  occupation: null,
  monthlyRevenueCents: "100000",
  cnpj: null,
  taxRegime: "mei",
  taxPercentage: 6,
  reservePercentage: 10,
  initialAccountType: "business_account",
};

describe("AccountStep", () => {
  it("reports the initial account choice and completes the flow", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onNext = vi.fn();

    render(
      <AccountStep
        data={data}
        onChange={onChange}
        onNext={onNext}
        onBack={vi.fn()}
        loading={false}
      />,
    );

    await user.click(screen.getByRole("radio", { name: /conta pessoal/i }));
    expect(onChange).toHaveBeenCalledWith({
      initialAccountType: "personal_account",
    });

    await user.click(screen.getByRole("button", { name: /concluir/i }));
    expect(onNext).toHaveBeenCalledOnce();
  });
});
