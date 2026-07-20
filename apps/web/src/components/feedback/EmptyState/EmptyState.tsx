import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  /** Rendered inside a neutral rounded container. */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Action buttons, rendered centered below the description. */
  children?: ReactNode;
}

export function EmptyState({
  className,
  icon,
  title,
  description,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-10 text-center",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div
          aria-hidden="true"
          className="flex size-12 items-center justify-center rounded-xl bg-surface-hover text-foreground-muted [&_svg]:size-6"
        >
          {icon}
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-xs text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {children ? (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}
