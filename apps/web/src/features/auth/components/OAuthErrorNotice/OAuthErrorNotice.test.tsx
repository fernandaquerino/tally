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

  it("translates a known error code into a friendly message", () => {
    search = "error=oauth_denied";
    render(<OAuthErrorNotice />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Você cancelou o login social.",
    );
  });

  it("renders nothing when there is no error in the URL", () => {
    const { container } = render(<OAuthErrorNotice />);
    expect(container).toBeEmptyDOMElement();
  });

  it("ignores unknown error codes", () => {
    search = "error=algo_inesperado";
    const { container } = render(<OAuthErrorNotice />);
    expect(container).toBeEmptyDOMElement();
  });
});
