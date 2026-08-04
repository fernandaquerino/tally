import type { ButtonHTMLAttributes, MouseEvent } from "react";

import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { Spinner } from "../Spinner";

export const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 select-none items-center justify-center cursor-pointer",
    "whitespace-nowrap rounded-md font-medium",
    "transition-[background-color,color,border-color,box-shadow,filter]",
    "duration-[120ms]",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-ring",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-background",
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
    "data-[loading]:cursor-wait",
    "data-[disabled]:pointer-events-none",
    "data-[disabled]:cursor-not-allowed",
    "data-[disabled]:border-transparent",
    "data-[disabled]:bg-border",
    "data-[disabled]:text-foreground-subtle",
    "data-[disabled]:shadow-none",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary-hover",
          "active:bg-primary-800",
          "dark:active:bg-primary-700",
        ],

        secondary: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-border",
          "active:bg-border-strong",
        ],

        outline: [
          "border border-border-strong",
          "bg-transparent text-secondary-foreground",
          "hover:bg-surface-hover",
          "active:bg-surface-selected",
        ],

        ghost: [
          "bg-transparent text-foreground-muted",
          "hover:bg-surface-hover hover:text-foreground",
          "active:bg-surface-selected",
        ],

        destructive: [
          "bg-destructive text-destructive-foreground",
          "hover:bg-destructive-hover",
          "active:bg-destructive-hover active:brightness-90",
        ],

        link: [
          "bg-transparent text-primary",
          "underline underline-offset-4",
          "hover:text-primary-hover",
          "active:text-primary-800",
          "dark:active:text-primary-300",
          "data-[disabled]:bg-transparent",
        ],
      },

      size: {
        sm: [
          "h-8 gap-1.5 px-3",
          "text-[13px] leading-4",
          "[&_svg:not([class*='size-'])]:size-3.5",
        ],

        default: [
          "h-[38px] gap-[7px] px-4",
          "text-sm leading-5",
          "[&_svg:not([class*='size-'])]:size-4",
        ],
        md: [
          "h-[38px] gap-[7px] px-4",
          "text-sm leading-5",
          "[&_svg:not([class*='size-'])]:size-4",
        ],

        lg: [
          "h-11 gap-2 px-5",
          "text-[15px] leading-5",
          "[&_svg:not([class*='size-'])]:size-[18px]",
        ],

        "icon-sm": ["size-8 p-0", "[&_svg:not([class*='size-'])]:size-3.5"],

        icon: ["size-[38px] p-0", "[&_svg:not([class*='size-'])]:size-4"],

        "icon-lg": ["size-11 p-0", "[&_svg:not([class*='size-'])]:size-[18px]"],
      },
    },

    compoundVariants: [
      {
        variant: "ghost",
        size: "sm",
        className: "px-2",
      },
      {
        variant: "ghost",
        size: "default",
        className: "px-3",
      },
      {
        variant: "ghost",
        size: "md",
        className: "px-3",
      },
      {
        variant: "ghost",
        size: "lg",
        className: "px-4",
      },

      {
        variant: "link",
        size: "sm",
        className: "px-1",
      },
      {
        variant: "link",
        size: "default",
        className: "px-1",
      },
      {
        variant: "link",
        size: "md",
        className: "px-1",
      },
      {
        variant: "link",
        size: "lg",
        className: "px-1",
      },
    ],

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonSize = NonNullable<ButtonVariantProps["size"]>;

type IconButtonSize = Extract<ButtonSize, "icon-sm" | "icon" | "icon-lg">;

type TextButtonSize = Exclude<ButtonSize, IconButtonSize>;

const spinnerSizeClass: Record<ButtonSize, string> = {
  sm: "size-3.5",
  default: "size-4",
  md: "size-4",
  lg: "size-[18px]",
  "icon-sm": "size-3.5",
  icon: "size-4",
  "icon-lg": "size-[18px]",
};

interface BaseButtonProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">,
    Omit<ButtonVariantProps, "size"> {
  size?: ButtonSize;
  asChild?: boolean;
  loading?: boolean;
}

type ButtonA11yProps =
  | { size: IconButtonSize; "aria-label": string; "aria-labelledby"?: string }
  | { size: IconButtonSize; "aria-labelledby": string; "aria-label"?: string }
  | {
      size?: TextButtonSize;
      "aria-label"?: string;
      "aria-labelledby"?: string;
    };

export type ButtonProps = BaseButtonProps & ButtonA11yProps;

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  type,
  tabIndex,
  onClick,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  const isDisabled = disabled || loading;

  const accessibleName = props["aria-label"] ?? props["aria-labelledby"];

  if (
    process.env.NODE_ENV !== "production" &&
    size?.startsWith("icon") &&
    !accessibleName
  ) {
    console.warn(
      `Button with size="${size}" must include aria-label or aria-labelledby.`,
    );
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  }

  return (
    <Comp
      {...props}
      type={asChild ? undefined : (type ?? "button")}
      tabIndex={asChild && isDisabled ? -1 : tabIndex}
      data-slot="button"
      data-loading={loading ? "" : undefined}
      data-disabled={isDisabled ? "" : undefined}
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        }),
      )}
      disabled={!asChild ? isDisabled : undefined}
      aria-disabled={asChild && isDisabled ? true : undefined}
      aria-busy={loading || undefined}
      onClick={handleClick}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 items-center justify-center"
        >
          <Spinner className={spinnerSizeClass[size ?? "default"]} />
        </span>
      )}

      {asChild ? (
        <Slottable>{children}</Slottable>
      ) : (
        <span className="contents">{children}</span>
      )}
    </Comp>
  );
}
