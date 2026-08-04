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
vi.mock("../services/auth-api", () => ({
  login: (...args: unknown[]) => login(...args),
}));

import { LoginForm } from "./LoginForm";

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

describe("LoginForm", () => {
  beforeEach(() => {
    push.mockReset();
    login.mockReset();
  });

  it("valida campos obrigatórios sem chamar a API", async () => {
    const user = userEvent.setup();
    renderWithClient(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Informe seu e-mail.")).toBeInTheDocument();
    expect(screen.getByText("Informe sua senha.")).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it("navega para o dashboard em caso de sucesso", async () => {
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
    renderWithClient(<LoginForm />);

    await user.type(screen.getByLabelText(/e-mail/i), "rafael@example.test");
    await user.type(screen.getByLabelText(/senha/i), "segredo123");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/dashboard"));
    expect(login).toHaveBeenCalledWith({
      email: "rafael@example.test",
      password: "segredo123",
    });
  });

  it("mostra erro genérico quando a API rejeita credenciais", async () => {
    login.mockRejectedValue(
      new ApiError(401, {
        code: "INVALID_CREDENTIALS",
        message: "E-mail ou senha inválidos.",
      }),
    );
    const user = userEvent.setup();
    renderWithClient(<LoginForm />);

    await user.type(screen.getByLabelText(/e-mail/i), "rafael@example.test");
    await user.type(screen.getByLabelText(/senha/i), "senhaerrada");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(
      await screen.findByText("E-mail ou senha inválidos."),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
