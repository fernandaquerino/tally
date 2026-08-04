import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
}));

const useSession = vi.fn();
vi.mock("../../hooks/useSession", () => ({
  useSession: () => useSession(),
}));

import { AuthGuard } from "./AuthGuard";

describe("AuthGuard", () => {
  beforeEach(() => {
    replace.mockReset();
    useSession.mockReset();
  });

  it("mostra loading enquanto a sessão carrega, sem redirecionar", () => {
    useSession.mockReturnValue({ isLoading: true });
    render(
      <AuthGuard>
        <p>conteúdo</p>
      </AuthGuard>,
    );

    expect(screen.queryByText("conteúdo")).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("renderiza os filhos quando há sessão válida", () => {
    useSession.mockReturnValue({
      data: { id: "1", name: "Rafael" },
      isLoading: false,
    });
    render(
      <AuthGuard>
        <p>conteúdo</p>
      </AuthGuard>,
    );

    expect(screen.getByText("conteúdo")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("redireciona para /login quando não há sessão", async () => {
    useSession.mockReturnValue({ data: null, isLoading: false });
    render(
      <AuthGuard>
        <p>conteúdo</p>
      </AuthGuard>,
    );

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
    expect(screen.queryByText("conteúdo")).not.toBeInTheDocument();
  });

  it("redireciona para /login quando a sessão falha", async () => {
    useSession.mockReturnValue({ isError: true, isLoading: false });
    render(
      <AuthGuard>
        <p>conteúdo</p>
      </AuthGuard>,
    );

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
  });
});
