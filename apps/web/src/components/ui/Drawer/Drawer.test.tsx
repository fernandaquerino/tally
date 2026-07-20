import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Button } from "../Button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./Drawer";

function DetailDrawer({
  showCloseButton = true,
}: {
  showCloseButton?: boolean;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Ver detalhe</Button>
      </DrawerTrigger>
      <DrawerContent showCloseButton={showCloseButton}>
        <DrawerHeader>
          <DrawerTitle>Detalhe</DrawerTitle>
          <DrawerDescription>Consultoria — Acme</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>+R$ 8.500,00</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

describe("Drawer", () => {
  it("is closed until the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<DetailDrawer />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ver detalhe" }));

    const drawer = await screen.findByRole("dialog");
    expect(drawer).toHaveAccessibleName("Detalhe");
    expect(drawer).toHaveAccessibleDescription("Consultoria — Acme");
  });

  it("closes on the close button", async () => {
    const user = userEvent.setup();
    render(<DetailDrawer />);

    await user.click(screen.getByRole("button", { name: "Ver detalhe" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Fechar" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<DetailDrawer />);

    await user.click(screen.getByRole("button", { name: "Ver detalhe" }));
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("hides the close button when showCloseButton is false", async () => {
    const user = userEvent.setup();
    render(<DetailDrawer showCloseButton={false} />);

    await user.click(screen.getByRole("button", { name: "Ver detalhe" }));
    await screen.findByRole("dialog");

    expect(
      screen.queryByRole("button", { name: "Fechar" }),
    ).not.toBeInTheDocument();
  });
});
