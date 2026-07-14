import { cva, type VariantProps } from "class-variance-authority";
import type { SVGAttributes } from "react";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("shrink-0 animate-spin", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

export interface SpinnerProps
  extends SVGAttributes<SVGSVGElement>, VariantProps<typeof spinnerVariants> {}

export function Spinner({ size, className, ...props }: SpinnerProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn(spinnerVariants({ size }), className)}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
        fill="currentColor"
      />
    </svg>
  );
}
