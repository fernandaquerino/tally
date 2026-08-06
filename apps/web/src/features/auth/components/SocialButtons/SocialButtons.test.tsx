import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SocialButtons } from "./SocialButtons";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/v1";

describe("SocialButtons", () => {
  it("points to the API OAuth endpoints (top-level redirect, not fetch)", () => {
    render(<SocialButtons />);

    expect(
      screen.getByRole("link", { name: "Continuar com Google" }),
    ).toHaveAttribute("href", `${API_URL}/auth/oauth/google`);
    expect(
      screen.getByRole("link", { name: "Continuar com GitHub" }),
    ).toHaveAttribute("href", `${API_URL}/auth/oauth/github`);
  });

  it("highlights the last used provider and shows the hint", () => {
    render(<SocialButtons lastUsedMethod="github" />);

    expect(
      screen.getByRole("link", { name: "Continuar com GitHub" }),
    ).toHaveClass("bg-primary");
    expect(
      screen.getByText("Você usou GitHub para entrar da última vez"),
    ).toBeInTheDocument();
  });

  it("omits the divider when showDivider is false", () => {
    render(<SocialButtons showDivider={false} />);
    expect(screen.queryByText("ou")).not.toBeInTheDocument();
  });
});
