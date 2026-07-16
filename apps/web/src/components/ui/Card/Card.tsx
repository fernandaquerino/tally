import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const cardVariants = cva(
  [
    "rounded-xl border",
    "transition-[background-color,border-color,box-shadow]",
    "duration-[150ms]",
  ],
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground",

        interactive: [
          "border-border bg-card text-card-foreground",
          "cursor-pointer",
          "hover:border-border-strong hover:shadow-md",
          "focus-visible:outline-none focus-visible:border-primary",
          "focus-visible:ring-2 focus-visible:ring-primary-border",
        ],

        selected: [
          "border-primary bg-card text-card-foreground",
          "ring-2 ring-primary-border",
        ],

        muted: "border-border bg-background-subtle text-card-foreground",

        alert: "border-error-border bg-error-subtle text-card-foreground",

        ai: "border-primary-border bg-primary-subtle text-card-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

export function Card({
  className,
  variant,
  asChild = false,
  ...props
}: CardProps) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-5", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "text-[15px] leading-tight font-semibold text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-5 pt-0", className)}
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-5 pt-0", className)}
      {...props}
    />
  );
}
