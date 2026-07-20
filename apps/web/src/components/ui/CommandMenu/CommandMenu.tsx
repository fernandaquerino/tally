"use client";

import {
  Command as CommandPrimitive,
  CommandEmpty as CommandEmptyPrimitive,
  CommandGroup as CommandGroupPrimitive,
  CommandInput as CommandInputPrimitive,
  CommandItem as CommandItemPrimitive,
  CommandList as CommandListPrimitive,
  CommandSeparator as CommandSeparatorPrimitive,
} from "cmdk";
import { SearchIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../Dialog";

export function Command({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-xl bg-surface-raised text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export interface CommandDialogProps extends ComponentProps<typeof Dialog> {
  title?: string;
  description?: string;
  className?: string;
}

export function CommandDialog({
  title = "Menu de comandos",
  description = "Busque ou execute uma ação",
  className,
  children,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent
        showCloseButton={false}
        className={cn("overflow-hidden p-0", className)}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        <Command className="rounded-none bg-transparent">{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

export interface CommandInputProps extends ComponentProps<
  typeof CommandInputPrimitive
> {
  /** Optional element rendered on the right of the search field (e.g. ESC). */
  trailing?: ReactNode;
}

export function CommandInput({
  className,
  trailing,
  ...props
}: CommandInputProps) {
  return (
    <div className="flex items-center gap-2.5 border-b border-border px-4">
      <SearchIcon
        className="size-5 shrink-0 text-foreground-subtle"
        aria-hidden="true"
      />
      <CommandInputPrimitive
        data-slot="command-input"
        className={cn(
          "h-12 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      {trailing}
    </div>
  );
}

export function CommandList({
  className,
  ...props
}: ComponentProps<typeof CommandListPrimitive>) {
  return (
    <CommandListPrimitive
      data-slot="command-list"
      className={cn(
        "max-h-80 scroll-py-2 overflow-x-hidden overflow-y-auto p-2",
        className,
      )}
      {...props}
    />
  );
}

export function CommandEmpty(
  props: ComponentProps<typeof CommandEmptyPrimitive>,
) {
  return (
    <CommandEmptyPrimitive
      data-slot="command-empty"
      className="py-6 text-center text-sm text-muted-foreground"
      {...props}
    />
  );
}

export function CommandGroup({
  className,
  ...props
}: ComponentProps<typeof CommandGroupPrimitive>) {
  return (
    <CommandGroupPrimitive
      data-slot="command-group"
      className={cn(
        "overflow-hidden text-foreground",
        "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1.5",
        "[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-foreground-subtle [&_[cmdk-group-heading]]:uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function CommandItem({
  className,
  ...props
}: ComponentProps<typeof CommandItemPrimitive>) {
  return (
    <CommandItemPrimitive
      data-slot="command-item"
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-none select-none",
        "text-foreground [&_svg]:size-[18px] [&_svg]:shrink-0",
        "data-[selected=true]:bg-primary-subtle data-[selected=true]:text-foreground",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function CommandSeparator({
  className,
  ...props
}: ComponentProps<typeof CommandSeparatorPrimitive>) {
  return (
    <CommandSeparatorPrimitive
      data-slot="command-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

export function CommandShortcut({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      data-slot="command-shortcut"
      className={cn(
        "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-surface px-1.5",
        "text-[11px] font-medium text-foreground-subtle",
        className,
      )}
      {...props}
    />
  );
}
