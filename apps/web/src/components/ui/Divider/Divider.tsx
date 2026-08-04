import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const dividerVariants = cva("shrink-0 bg-border", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export interface DividerProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof dividerVariants> {
  label?: ReactNode;
}

export function Divider({
  className,
  orientation = "horizontal",
  label,
  ...props
}: DividerProps) {
  const isVertical = orientation === "vertical";

  if (label != null && !isVertical) {
    return (
      <div
        data-slot="divider"
        role="separator"
        aria-orientation="horizontal"
        className={cn("flex w-full items-center gap-3", className)}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(dividerVariants({ orientation }))}
        />
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <span
          aria-hidden="true"
          className={cn(dividerVariants({ orientation }))}
        />
      </div>
    );
  }

  return (
    <div
      data-slot="divider"
      role="separator"
      aria-orientation={orientation ?? "horizontal"}
      className={cn(dividerVariants({ orientation }), className)}
      {...props}
    />
  );
}
