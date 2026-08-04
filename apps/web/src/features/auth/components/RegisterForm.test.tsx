import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
}));

const register = vi.fn();
vi.mock("../services/auth-api", () => ({
  register: (...args: unknown[]) => register(...args),
}));

import { RegisterForm } from "./RegisterForm";

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

describe("RegisterForm", () => {
  beforeEach(() => {
    push.mockReset();
    register.mockReset();
  });

  it("bloqueia senha curta antes de chamar a API", async () => {
    const user = userEvent.setup();
    renderWithClient(<RegisterForm />);

    await user.type(screen.getByLabelText(/nome/i), "Rafael");
    await user.type(screen.getByLabelText(/e-mail/i), "rafael@example.test");
    await user.type(screen.getByLabelText(/senha/i), "1234");
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(
      await screen.findByText("A senha precisa ter ao menos 8 caracteres."),
    ).toBeInTheDocument();
    expect(register).not.toHaveBeenCalled();
  });

  it("cria conta e navega para o dashboard", async () => {
    register.mockResolvedValue({
      user: {
        id: "1",
        name: "Rafael",
        email: "rafael@example.test",
        householdId: "h1",
        role: "OWNER",
      },
    });
    const user = userEvent.setup();
    renderWithClient(<RegisterForm />);

    await user.type(screen.getByLabelText(/nome/i), "Rafael");
    await user.type(screen.getByLabelText(/e-mail/i), "rafael@example.test");
    await user.type(screen.getByLabelText(/senha/i), "segredo123");
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/dashboard"));
    expect(register).toHaveBeenCalledWith({
      name: "Rafael",
      email: "rafael@example.test",
      password: "segredo123",
    });
  });
});
