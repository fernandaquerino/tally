import { cva, type VariantProps } from "class-variance-authority";
import {
  CircleCheckIcon,
  InfoIcon,
  OctagonAlertIcon,
  TriangleAlertIcon,
} from "lucide-react";
import type { ComponentType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const alertVariants = cva(
  ["flex w-full items-start gap-3 rounded-lg border", "px-4 py-3 text-sm"],
  {
    variants: {
      variant: {
        info: "border-info-border bg-info-subtle text-info",
        success: "border-success-border bg-success-subtle text-success",
        warning: "border-warning-border bg-warning-subtle text-warning",
        danger: "border-error-border bg-error-subtle text-error",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>["variant"]>;

const defaultIcon: Record<
  AlertVariant,
  ComponentType<{ className?: string }>
> = {
  info: InfoIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  danger: OctagonAlertIcon,
};

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  /** Override the default variant icon. Pass `null` to hide it. */
  icon?: ReactNode;
}

export function Alert({
  className,
  variant,
  icon,
  children,
  ...props
}: AlertProps) {
  const resolvedVariant = variant ?? "info";
  const Icon = defaultIcon[resolvedVariant];

  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon === undefined ? (
        <Icon className="mt-0.5 size-[18px] shrink-0" aria-hidden="true" />
      ) : (
        icon
      )}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function AlertTitle({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="alert-title"
      className={cn("font-medium", className)}
      {...props}
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="alert-description"
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  );
}
