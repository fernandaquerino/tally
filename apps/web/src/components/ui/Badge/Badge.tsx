import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-full border",
    "px-2.5 py-1 text-[13px] font-medium leading-none whitespace-nowrap",
    "[&>svg]:size-3.5 [&>svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        neutral: "border-border bg-secondary text-foreground-muted",
        success: "border-success-border bg-success-subtle text-success",
        warning: "border-warning-border bg-warning-subtle text-warning",
        danger: "border-error-border bg-error-subtle text-error",
        info: "border-info-border bg-info-subtle text-info",
        income: "border-income-border bg-income-subtle text-income",
        expense: "border-expense-border bg-expense-subtle text-expense",
        pf: "border-pf-border bg-pf-subtle text-pf",
        pj: "border-pj-border bg-pj-subtle text-pj",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

export function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}
