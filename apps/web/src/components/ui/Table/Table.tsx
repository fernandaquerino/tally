import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Table({
  className,
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div
      data-slot="table-container"
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="w-full overflow-x-auto">
        <table
          data-slot="table"
          className={cn(
            "w-full caption-bottom border-collapse text-sm",
            className,
          )}
          {...props}
        />
      </div>
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b [&_tr]:border-border", className)}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

export function TableFooter({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-border bg-background-subtle text-sm font-medium text-foreground-muted",
        className,
      )}
      {...props}
    />
  );
}

export function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border transition-colors",
        "hover:bg-surface-hover",
        "data-[state=selected]:bg-primary-subtle",
        "data-[state=selected]:shadow-[inset_2px_0_0_var(--primary)]",
        className,
      )}
      {...props}
    />
  );
}

type SortDirection = "ascending" | "descending" | "none";

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortDirection?: SortDirection;
}

export function TableHead({
  className,
  sortDirection,
  ...props
}: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      scope="col"
      aria-sort={sortDirection}
      className={cn(
        "h-11 px-4 text-left align-middle font-medium whitespace-nowrap",
        "text-xs tracking-wide text-foreground-subtle uppercase",
        "[&:has([role=checkbox])]:w-0 [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-3 align-middle whitespace-nowrap text-foreground",
        "[&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

export function TableCaption({
  className,
  ...props
}: HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
