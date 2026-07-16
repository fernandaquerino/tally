import { CircleAlertIcon, RefreshCwIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Button } from "../Button";

export interface ErrorStateProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  /** Bare, danger-tinted icon. Defaults to an alert circle. */
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Renders the default "Tentar novamente" button wired to this handler. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Custom actions; overrides the default retry button when provided. */
  children?: ReactNode;
}

export function ErrorState({
  className,
  icon,
  title = "Algo deu errado",
  description,
  onRetry,
  retryLabel = "Tentar novamente",
  children,
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      data-slot="error-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-10 text-center",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="text-error [&_svg]:size-7">
        {icon ?? <CircleAlertIcon />}
      </span>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-xs text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {children ??
        (onRetry ? (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCwIcon />
            {retryLabel}
          </Button>
        ) : null)}
    </div>
  );
}
