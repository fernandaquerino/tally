import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
}));

const mutate = vi.fn();
vi.mock("../../hooks/useLogout", () => ({
  useLogout: () => ({ mutate, isPending: false }),
}));

import { LogoutButton } from "./LogoutButton";

describe("LogoutButton", () => {
  beforeEach(() => {
    replace.mockReset();
    mutate.mockReset();
  });

  it("dispara o logout e volta para /login no sucesso", async () => {
    mutate.mockImplementation((_input, { onSuccess }) => onSuccess());
    const user = userEvent.setup();
    render(<LogoutButton />);

    await user.click(screen.getByRole("button", { name: "Sair" }));

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith("/login");
  });
});
