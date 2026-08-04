import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar, AvatarGroup } from "./Avatar";

describe("Avatar", () => {
  it("derives initials from a full name", () => {
    render(<Avatar name="Marina Alves" />);

    const avatar = screen.getByRole("img", { name: "Marina Alves" });
    expect(avatar).toHaveTextContent("MA");
  });

  it("uses explicit initials when provided", () => {
    render(<Avatar name="Rafael Souza" initials="RS" />);

    expect(screen.getByRole("img", { name: "Rafael Souza" })).toHaveTextContent(
      "RS",
    );
  });

  it("renders the image when src is provided", () => {
    render(<Avatar name="Marina Alves" src="/avatar.png" />);

    const image = screen.getByRole("img", { name: "Marina Alves" });
    expect(image.tagName).toBe("IMG");
    expect(image).toHaveAttribute("src", "/avatar.png");
  });

  it("falls back to initials when the image fails to load", () => {
    const { container } = render(
      <Avatar name="Marina Alves" src="/broken.png" />,
    );

    const wrapper = container.querySelector("[data-slot='avatar']")!;
    fireEvent.error(wrapper.querySelector("img")!);

    expect(wrapper).toHaveTextContent("MA");
    expect(wrapper.querySelector("img")).toBeNull();
    expect(screen.getByRole("img", { name: "Marina Alves" })).toBe(wrapper);
  });

  it("assigns a deterministic fallback color for the same seed", () => {
    const { rerender } = render(<Avatar name="Marina Alves" />);
    const first = screen.getByRole("img", { name: "Marina Alves" }).className;

    rerender(<Avatar name="Marina Alves" />);
    const second = screen.getByRole("img", { name: "Marina Alves" }).className;

    expect(first).toBe(second);
  });
});

describe("AvatarGroup", () => {
  it("shows an overflow count beyond max", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Marina Alves" />
        <Avatar name="Rafael Souza" />
        <Avatar name="Bruno Lima" />
        <Avatar name="Carla Dias" />
        <Avatar name="Diego Nunes" />
      </AvatarGroup>,
    );

    expect(screen.getByText("MA")).toBeInTheDocument();
    expect(screen.getByText("RS")).toBeInTheDocument();
    expect(screen.queryByText("BL")).not.toBeInTheDocument();
    expect(screen.getByText("+3")).toBeInTheDocument();
  });

  it("renders every avatar when under the max", () => {
    render(
      <AvatarGroup max={5}>
        <Avatar name="Marina Alves" />
        <Avatar name="Rafael Souza" />
      </AvatarGroup>,
    );

    const group = screen.getByText("MA").closest("[data-slot='avatar-group']")!;
    expect(within(group as HTMLElement).queryByText(/^\+/)).toBeNull();
  });
});
