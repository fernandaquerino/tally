"use client";

import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

import { useThemeOptional } from "@/components/app/ThemeProvider";

import { Spinner } from "../Spinner";

/**
 * Toaster global da aplicação. Deve ser montado uma única vez, perto da raiz
 * (ver `app/layout.tsx`), dentro do `ThemeProvider`. Toasts são disparados de
 * qualquer lugar via `toast()` — reexportado abaixo.
 */
export function Toaster(props: ToasterProps) {
  const resolvedTheme = useThemeOptional()?.resolvedTheme;

  return (
    <SonnerToaster
      data-slot="toaster"
      theme={resolvedTheme ?? "system"}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-5 text-success" aria-hidden="true" />
        ),
        info: <InfoIcon className="size-5 text-info" aria-hidden="true" />,
        warning: (
          <TriangleAlertIcon
            className="size-5 text-warning"
            aria-hidden="true"
          />
        ),
        error: (
          <CircleAlertIcon className="size-5 text-error" aria-hidden="true" />
        ),
        loading: <Spinner size="md" className="text-primary" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group !rounded-lg !border !border-border !bg-surface-raised !text-foreground !shadow-lg gap-3",
          title: "text-sm font-medium text-foreground",
          description: "!text-foreground-muted text-sm",
          actionButton:
            "!bg-primary !text-primary-foreground !text-sm !font-medium hover:!bg-primary-hover",
          cancelButton:
            "!bg-secondary !text-secondary-foreground !text-sm !font-medium",
          closeButton:
            "!static !order-last !ml-auto !size-5 !translate-x-0 !translate-y-0 !border-0 !bg-transparent !text-foreground-subtle hover:!bg-transparent hover:!text-foreground",
        },
      }}
      {...props}
    />
  );
}

export { toast } from "sonner";
