import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";
import { TallyIcon } from "./TallyIcon";

type TallyLogoProps = ComponentPropsWithoutRef<"div"> & {
  iconOnly?: boolean;
  iconSize?: number;
};

export function TallyLogo({
  iconOnly = false,
  iconSize = 28,
  className,
  ...props
}: TallyLogoProps) {
  return (
    <div
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label="Tally"
      {...props}
    >
      <TallyIcon size={iconSize} className="shrink-0" />

      {!iconOnly && (
        <span className="text-xl font-semibold tracking-[-0.03em] text-foreground">
          Tally
        </span>
      )}
    </div>
  );
}
