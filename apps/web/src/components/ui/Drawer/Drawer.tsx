"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Drawer(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="drawer" {...props} />;
}

export function DrawerTrigger(
  props: ComponentProps<typeof DialogPrimitive.Trigger>,
) {
  return <DialogPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

export function DrawerClose(
  props: ComponentProps<typeof DialogPrimitive.Close>,
) {
  return <DialogPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerPortal(props: ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}

const drawerVariants = cva(
  [
    "fixed z-50 flex flex-col bg-surface-raised text-foreground shadow-xl",
    "focus:outline-none",
  ],
  {
    variants: {
      side: {
        right:
          "inset-y-0 right-0 h-full w-full max-w-sm border-l border-border",
        left: "inset-y-0 left-0 h-full w-full max-w-sm border-r border-border",
        top: "inset-x-0 top-0 max-h-[85vh] w-full border-b border-border",
        bottom: "inset-x-0 bottom-0 max-h-[85vh] w-full border-t border-border",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

export interface DrawerContentProps
  extends
    ComponentProps<typeof DialogPrimitive.Content>,
    VariantProps<typeof drawerVariants> {
  showCloseButton?: boolean;
}

export function DrawerContent({
  className,
  children,
  side,
  showCloseButton = true,
  ...props
}: DrawerContentProps) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DialogPrimitive.Content
        data-slot="drawer-content"
        className={cn(drawerVariants({ side }), className)}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            data-slot="drawer-close"
            aria-label="Fechar"
            className={cn(
              "absolute top-4 right-4 rounded-sm text-foreground-subtle transition-colors",
              "hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised",
            )}
          >
            <XIcon className="size-4" aria-hidden="true" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DrawerPortal>
  );
}

export function DrawerHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-1.5 p-6 pb-4", className)}
      {...props}
    />
  );
}

export function DrawerBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-body"
      className={cn("flex-1 overflow-y-auto px-6", className)}
      {...props}
    />
  );
}

export function DrawerFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex flex-col gap-2 border-t border-border p-6",
        className,
      )}
      {...props}
    />
  );
}

export function DrawerTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-base font-semibold text-foreground", className)}
      {...props}
    />
  );
}

export function DrawerDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
