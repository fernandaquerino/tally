import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormError } from "./FormError";

describe("FormError", () => {
  it("anuncia a mensagem via role=alert", () => {
    render(<FormError message="E-mail ou senha inválidos." />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("E-mail ou senha inválidos.");
  });
});
