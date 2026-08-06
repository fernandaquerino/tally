import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api/client";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
}));

const login = vi.fn();
vi.mock("../../services/auth-api", () => ({
  login: (...args: unknown[]) => login(...args),
}));

import { LoginFlow } from "./LoginFlow";

function renderWithClient(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

describe("LoginFlow", () => {
  beforeEach(() => {
    push.mockReset();
    login.mockReset();
    document.cookie = "tally_last_login_method=; Max-Age=0; Path=/";
  });

  it("highlights the last login method and shows the suggestion", async () => {
    document.cookie = "tally_last_login_method=google; Path=/";
    renderWithClient(<LoginFlow />);

    expect(
      await screen.findByText("Você usou Google para entrar da última vez"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Continuar com Google" }),
    ).toHaveClass("bg-primary");
    expect(
      screen.getByRole("button", { name: "Continuar com e-mail" }),
    ).toHaveClass("border");
  });

  it("advances by email and validates each step before calling the API", async () => {
    const user = userEvent.setup();
    renderWithClient(<LoginFlow />);

    expect(
      screen.queryByLabelText("E-mail", { selector: "input" }),
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Continuar com e-mail" }),
    );
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    expect(await screen.findByText("Informe seu e-mail.")).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Senha", { selector: "input" }),
    ).not.toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it("navigates to the dashboard on success", async () => {
    login.mockResolvedValue({
      user: {
        id: "1",
        name: "Rafael",
        email: "rafael@example.test",
        householdId: "h1",
        role: "OWNER",
      },
    });
    const user = userEvent.setup();
    renderWithClient(<LoginFlow />);

    await user.click(
      screen.getByRole("button", { name: "Continuar com e-mail" }),
    );
    await user.type(
      screen.getByLabelText("E-mail", { selector: "input" }),
      "rafael@example.test",
    );
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    await user.type(
      screen.getByLabelText("Senha", { selector: "input" }),
      "segredo123",
    );
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/dashboard"));
    expect(login).toHaveBeenCalledWith({
      email: "rafael@example.test",
      password: "segredo123",
    });
  });

  it("shows a generic error when the API rejects the credentials", async () => {
    login.mockRejectedValue(
      new ApiError(401, {
        code: "INVALID_CREDENTIALS",
        message: "E-mail ou senha inválidos.",
      }),
    );
    const user = userEvent.setup();
    renderWithClient(<LoginFlow />);

    await user.click(
      screen.getByRole("button", { name: "Continuar com e-mail" }),
    );
    await user.type(
      screen.getByLabelText("E-mail", { selector: "input" }),
      "rafael@example.test",
    );
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    await user.type(
      screen.getByLabelText("Senha", { selector: "input" }),
      "senhaerrada",
    );
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(
      await screen.findByText("E-mail ou senha inválidos."),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("preserves the email when going back from the password step", async () => {
    const user = userEvent.setup();
    renderWithClient(<LoginFlow />);

    await user.click(
      screen.getByRole("button", { name: "Continuar com e-mail" }),
    );
    await user.type(
      screen.getByLabelText("E-mail", { selector: "input" }),
      "rafael@example.test",
    );
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    await user.click(screen.getByRole("button", { name: "Alterar e-mail" }));

    expect(screen.getByLabelText("E-mail", { selector: "input" })).toHaveValue(
      "rafael@example.test",
    );
  });
});
