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
vi.mock("../../services/auth-api", () => ({
  register: (...args: unknown[]) => register(...args),
}));

import { RegisterFlow } from "./RegisterFlow";

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

async function reachDetails() {
  const user = userEvent.setup();
  await user.click(
    screen.getByRole("button", { name: "Continuar com e-mail" }),
  );
  await user.type(
    screen.getByLabelText("E-mail", { selector: "input" }),
    "rafael@example.test",
  );
  await user.click(screen.getByRole("button", { name: "Continuar" }));
  return user;
}

describe("RegisterFlow", () => {
  beforeEach(() => {
    push.mockReset();
    register.mockReset();
    document.cookie = "tally_last_login_method=; Max-Age=0; Path=/";
  });

  it("highlights the last used method on the sign-up screen", async () => {
    document.cookie = "tally_last_login_method=github; Path=/";
    renderWithClient(<RegisterFlow />);

    expect(
      await screen.findByText("Você usou GitHub para entrar da última vez"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Continuar com GitHub" }),
    ).toHaveClass("bg-primary");
  });

  it("blocks a short password before calling the API", async () => {
    renderWithClient(<RegisterFlow />);
    const user = await reachDetails();

    await user.type(
      screen.getByLabelText("Nome", { selector: "input" }),
      "Rafael",
    );
    await user.type(
      screen.getByLabelText("Senha", { selector: "input" }),
      "1234",
    );
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(
      await screen.findByText("A senha precisa ter ao menos 8 caracteres."),
    ).toBeInTheDocument();
    expect(register).not.toHaveBeenCalled();
  });

  it("creates the account and navigates to the dashboard", async () => {
    register.mockResolvedValue({
      user: {
        id: "1",
        name: "Rafael",
        email: "rafael@example.test",
        householdId: "h1",
        role: "OWNER",
      },
    });
    renderWithClient(<RegisterFlow />);
    const user = await reachDetails();

    await user.type(
      screen.getByLabelText("Nome", { selector: "input" }),
      "Rafael",
    );
    await user.type(
      screen.getByLabelText("Senha", { selector: "input" }),
      "segredo123",
    );
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/dashboard"));
    expect(register).toHaveBeenCalledWith({
      name: "Rafael",
      email: "rafael@example.test",
      password: "segredo123",
    });
  });

  it("preserves the email when going back from the final step", async () => {
    renderWithClient(<RegisterFlow />);
    const user = await reachDetails();

    await user.click(screen.getByRole("button", { name: "Alterar e-mail" }));

    expect(screen.getByLabelText("E-mail", { selector: "input" })).toHaveValue(
      "rafael@example.test",
    );
  });
});
