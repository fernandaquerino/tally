import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Toaster, toast } from "./Toaster";

function Harness() {
  return (
    <>
      <button
        type="button"
        onClick={() =>
          toast.success("Transação adicionada.", {
            action: { label: "Desfazer", onClick: () => {} },
          })
        }
      >
        disparar
      </button>
      <Toaster />
    </>
  );
}

describe("Toaster", () => {
  it("shows a toast (with its action) when toast() is called", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "disparar" }));

    expect(
      await screen.findByText("Transação adicionada."),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "Desfazer" }),
    ).toBeInTheDocument();
  });

  it("fires the action handler on click", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    function ActionHarness() {
      return (
        <>
          <button
            type="button"
            onClick={() =>
              toast("Pró-labore registrado.", {
                action: { label: "Ver", onClick: onAction },
              })
            }
          >
            disparar
          </button>
          <Toaster />
        </>
      );
    }

    render(<ActionHarness />);
    await user.click(screen.getByRole("button", { name: "disparar" }));
    await user.click(await screen.findByRole("button", { name: "Ver" }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
