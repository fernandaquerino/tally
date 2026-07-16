import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContextBadge } from "./ContextBadge";

describe("ContextBadge", () => {
  it("renders the default PF label with the pf styling and an icon", () => {
    render(<ContextBadge context="pf" />);

    const badge = screen.getByText("Pessoal");
    expect(badge).toHaveClass("text-pf");
    expect(badge).toHaveAttribute("data-context", "pf");
    // icon + text (não apenas cor) — regra do design system
    expect(badge.querySelector("svg")).toBeInTheDocument();
  });

  it("renders the default PJ label with the pj styling", () => {
    render(<ContextBadge context="pj" />);

    const badge = screen.getByText("Empresa");
    expect(badge).toHaveClass("text-pj");
    expect(badge).toHaveAttribute("data-context", "pj");
  });

  it("supports a custom label", () => {
    render(<ContextBadge context="pj" label="Minha empresa" />);

    expect(screen.getByText("Minha empresa")).toBeInTheDocument();
  });

  it("can hide the icon", () => {
    render(<ContextBadge context="pf" showIcon={false} />);

    expect(screen.getByText("Pessoal").querySelector("svg")).toBeNull();
  });
});
