import { Building2Icon, UserIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Badge, type BadgeProps } from "../Badge";

export type FinancialContext = "pf" | "pj";

const contextConfig: Record<
  FinancialContext,
  { label: string; icon: ReactNode; variant: BadgeProps["variant"] }
> = {
  pf: {
    label: "Pessoal",
    icon: <UserIcon aria-hidden="true" />,
    variant: "pf",
  },
  pj: {
    label: "Empresa",
    icon: <Building2Icon aria-hidden="true" />,
    variant: "pj",
  },
};

export interface ContextBadgeProps extends Omit<
  BadgeProps,
  "variant" | "children"
> {
  context: FinancialContext;
  label?: ReactNode;
  showIcon?: boolean;
}

export function ContextBadge({
  context,
  label,
  showIcon = true,
  className,
  ...props
}: ContextBadgeProps) {
  const config = contextConfig[context];

  return (
    <Badge
      variant={config.variant}
      data-context={context}
      className={cn(className)}
      {...props}
    >
      {showIcon ? config.icon : null}
      {label ?? config.label}
    </Badge>
  );
}
