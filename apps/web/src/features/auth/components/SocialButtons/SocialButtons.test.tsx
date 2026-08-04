import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SocialButtons } from "./SocialButtons";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/v1";

describe("SocialButtons", () => {
  it("aponta para os endpoints OAuth da API (redirect top-level, não fetch)", () => {
    render(<SocialButtons />);

    expect(
      screen.getByRole("link", { name: "Continuar com Google" }),
    ).toHaveAttribute("href", `${API_URL}/auth/oauth/google`);
    expect(
      screen.getByRole("link", { name: "Continuar com GitHub" }),
    ).toHaveAttribute("href", `${API_URL}/auth/oauth/github`);
  });

  it("destaca o último provedor usado e mostra a dica", () => {
    render(<SocialButtons lastUsedMethod="github" />);

    expect(
      screen.getByRole("link", { name: "Continuar com GitHub" }),
    ).toHaveClass("bg-primary");
    expect(
      screen.getByText("Você usou GitHub para entrar da última vez"),
    ).toBeInTheDocument();
  });

  it("omite o divisor quando showDivider é falso", () => {
    render(<SocialButtons showDivider={false} />);
    expect(screen.queryByText("ou")).not.toBeInTheDocument();
  });
});
