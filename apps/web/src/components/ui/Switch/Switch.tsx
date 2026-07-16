"use client";

import { CircleAlertIcon } from "lucide-react";
import {
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
  useState,
} from "react";

import { cn } from "@/lib/utils";

interface BaseSwitchProps extends Omit<
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
  onCheckedChange?: (checked: boolean) => void;
  helperText?: string;
  error?: string;
}

type SwitchA11yProps =
  | { label: ReactNode; "aria-label"?: string; "aria-labelledby"?: string }
  | { label?: never; "aria-label": string; "aria-labelledby"?: string }
  | { label?: never; "aria-label"?: string; "aria-labelledby": string };

export type SwitchProps = BaseSwitchProps & SwitchA11yProps;

export function Switch({
  className,
  id,
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  helperText,
  error,
  disabled,
  required,
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const hasError = Boolean(error);
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(
    defaultChecked ?? false,
  );
  const isChecked = isControlled ? checked : internalChecked;

  const accessibleName =
    label ?? props["aria-label"] ?? props["aria-labelledby"];

  const descriptionId = hasError
    ? `${switchId}-error`
    : helperText
      ? `${switchId}-helper`
      : undefined;

  if (process.env.NODE_ENV !== "production" && !accessibleName) {
    console.warn("Switch must include label, aria-label, or aria-labelledby.");
  }

  const state = isChecked ? "checked" : "unchecked";

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.checked;
    if (!isControlled) {
      setInternalChecked(next);
    }
    onCheckedChange?.(next);
  }

  const control = (
    <span className="relative inline-flex h-6 w-11 shrink-0">
      <input
        id={switchId}
        type="checkbox"
        role="switch"
        className="peer absolute inset-0 z-10 m-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        checked={isChecked}
        disabled={disabled}
        required={required}
        aria-checked={isChecked}
        aria-invalid={hasError || undefined}
        aria-describedby={descriptionId}
        onChange={handleChange}
        {...props}
      />
      <span
        aria-hidden="true"
        data-state={state}
        className={cn(
          "pointer-events-none flex h-6 w-11 items-center rounded-full border border-transparent transition-colors duration-[140ms]",
          "bg-border-strong",
          "data-[state=checked]:bg-primary",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
          "peer-disabled:opacity-50",
          className,
        )}
      >
        <span
          data-state={state}
          className={cn(
            "pointer-events-none size-5 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform duration-[140ms]",
            "data-[state=checked]:translate-x-[22px]",
          )}
        />
      </span>
    </span>
  );

  return (
    <div className="grid gap-2">
      {label ? (
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor={switchId}
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
          {control}
        </div>
      ) : (
        control
      )}

      {helperText && !error ? (
        <p id={`${switchId}-helper`} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}

      {error ? (
        <p
          id={`${switchId}-error`}
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
