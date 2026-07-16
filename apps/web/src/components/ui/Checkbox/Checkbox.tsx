"use client";

import { CheckIcon, CircleAlertIcon, MinusIcon } from "lucide-react";
import {
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
  useState,
} from "react";

import { cn } from "@/lib/utils";

interface BaseCheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | "type"
  | "checked"
  | "defaultChecked"
  | "onChange"
  | "aria-label"
  | "aria-labelledby"
> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  helperText?: string;
  error?: string;
}

type CheckboxA11yProps =
  | { label: ReactNode; "aria-label"?: string; "aria-labelledby"?: string }
  | { label?: never; "aria-label": string; "aria-labelledby"?: string }
  | { label?: never; "aria-label"?: string; "aria-labelledby": string };

export type CheckboxProps = BaseCheckboxProps & CheckboxA11yProps;

export function Checkbox({
  className,
  id,
  label,
  checked,
  defaultChecked,
  indeterminate = false,
  onCheckedChange,
  helperText,
  error,
  disabled,
  required,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const hasError = Boolean(error);
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(
    defaultChecked ?? false,
  );
  const isChecked = isControlled ? checked : internalChecked;

  const accessibleName =
    label ?? props["aria-label"] ?? props["aria-labelledby"];

  const descriptionId = hasError
    ? `${checkboxId}-error`
    : helperText
      ? `${checkboxId}-helper`
      : undefined;

  if (process.env.NODE_ENV !== "production" && !accessibleName) {
    console.warn(
      "Checkbox must include label, aria-label, or aria-labelledby.",
    );
  }

  const state = indeterminate
    ? "indeterminate"
    : isChecked
      ? "checked"
      : "unchecked";

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.checked;
    if (!isControlled) {
      setInternalChecked(next);
    }
    onCheckedChange?.(next);
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2.5">
        <span className="relative inline-flex size-5 shrink-0">
          <input
            id={checkboxId}
            type="checkbox"
            className="peer absolute inset-0 z-10 m-0 size-5 cursor-pointer opacity-0 disabled:cursor-not-allowed"
            checked={isChecked}
            disabled={disabled}
            required={required}
            aria-checked={indeterminate ? "mixed" : isChecked}
            aria-invalid={hasError || undefined}
            aria-describedby={descriptionId}
            onChange={handleChange}
            {...props}
          />
          <span
            aria-hidden="true"
            data-state={state}
            className={cn(
              "pointer-events-none flex size-5 items-center justify-center rounded-[6px] border transition-[background-color,border-color,box-shadow,color] duration-[120ms]",
              "border-border-strong bg-card text-transparent",
              "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
              "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
              "peer-disabled:border-border peer-disabled:bg-surface-hover peer-disabled:text-foreground-subtle",
              className,
            )}
          >
            {indeterminate ? (
              <MinusIcon className="size-3.5" strokeWidth={3} />
            ) : isChecked ? (
              <CheckIcon className="size-3.5" strokeWidth={3} />
            ) : null}
          </span>
        </span>

        {label ? (
          <label
            htmlFor={checkboxId}
            className={cn(
              "cursor-pointer text-sm text-foreground select-none",
              disabled && "cursor-not-allowed text-foreground-subtle",
            )}
          >
            {label}
            {required ? (
              <span className="ml-1 text-destructive" aria-hidden="true">
                *
              </span>
            ) : null}
          </label>
        ) : null}
      </div>

      {helperText && !error ? (
        <p
          id={`${checkboxId}-helper`}
          className="text-xs text-muted-foreground"
        >
          {helperText}
        </p>
      ) : null}

      {error ? (
        <p
          id={`${checkboxId}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-xs text-destructive"
        >
          <CircleAlertIcon className="size-3.5" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
