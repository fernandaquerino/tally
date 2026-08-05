import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

let search = "";
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(search),
}));

import { OAuthErrorNotice } from "./OAuthErrorNotice";

describe("OAuthErrorNotice", () => {
  beforeEach(() => {
    search = "";
  });

  it("traduz um código de erro conhecido para mensagem amigável", () => {
    search = "error=oauth_denied";
    render(<OAuthErrorNotice />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Você cancelou o login social.",
    );
  });

  it("não renderiza nada sem erro na URL", () => {
    const { container } = render(<OAuthErrorNotice />);
    expect(container).toBeEmptyDOMElement();
  });

  it("ignora códigos de erro desconhecidos", () => {
    search = "error=algo_inesperado";
    const { container } = render(<OAuthErrorNotice />);
    expect(container).toBeEmptyDOMElement();
  });
});
