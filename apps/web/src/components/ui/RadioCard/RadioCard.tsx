"use client";

import { CircleAlertIcon } from "lucide-react";
import { type ReactNode, useId, useState } from "react";

import { cn } from "@/lib/utils";

export type RadioCardAccent = "default" | "pf" | "pj";

export interface RadioCardOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  trailing?: ReactNode;
  accent?: RadioCardAccent;
  disabled?: boolean;
}

export interface RadioCardGroupProps {
  label: string;
  options: RadioCardOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  error?: string;
  hideLabel?: boolean;
  hideControl?: boolean;
  className?: string;
}

const accentStyles: Record<
  RadioCardAccent,
  { card: string; control: string; dot: string; icon: string }
> = {
  default: {
    card: "border-primary bg-primary-subtle",
    control: "border-primary",
    dot: "bg-primary",
    icon: "text-primary",
  },
  pf: {
    card: "border-pf bg-pf-subtle",
    control: "border-pf",
    dot: "bg-pf",
    icon: "text-pf",
  },
  pj: {
    card: "border-pj bg-pj-subtle",
    control: "border-pj",
    dot: "bg-pj",
    icon: "text-pj",
  },
};

export function RadioCardGroup({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled: groupDisabled,
  required,
  helperText,
  error,
  hideLabel,
  hideControl = false,
  className,
}: RadioCardGroupProps) {
  const generatedId = useId();
  const groupId = generatedId;
  const groupName = name ?? `${generatedId}-radiocard`;
  const labelId = `${groupId}-label`;
  const hasError = Boolean(error);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const currentValue = isControlled ? value : internalValue;

  const descriptionId = hasError
    ? `${groupId}-error`
    : helperText
      ? `${groupId}-helper`
      : undefined;

  function handleChange(next: string) {
    if (!isControlled) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <span
        id={labelId}
        className={cn(
          "text-xs font-medium text-foreground",
          hideLabel && "sr-only",
        )}
      >
        {label}
        {required ? (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        ) : null}
      </span>

      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        aria-invalid={hasError || undefined}
        aria-required={required || undefined}
        className="grid gap-3"
      >
        {options.map((option) => {
          const accent = accentStyles[option.accent ?? "default"];
          const isSelected = currentValue === option.value;
          const isDisabled = groupDisabled || option.disabled;
          const optionId = `${groupId}-${option.value}`;
          const descId = option.description
            ? `${optionId}-description`
            : undefined;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              data-state={isSelected ? "checked" : "unchecked"}
              className={cn(
                "relative flex cursor-pointer items-start gap-3 rounded-xl border-2 p-[15px] transition-[background-color,border-color,box-shadow] duration-[120ms]",
                "border-border bg-card",
                "hover:border-border-strong",
                "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-background",
                isSelected && accent.card,
                hideControl && "items-center",
                isDisabled &&
                  "cursor-not-allowed opacity-60 hover:border-border",
              )}
            >
              <input
                id={optionId}
                type="radio"
                name={groupName}
                value={option.value}
                checked={isSelected}
                disabled={isDisabled}
                required={required}
                aria-describedby={descId}
                onChange={() => handleChange(option.value)}
                className="peer sr-only"
              />

              {!hideControl ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 bg-card transition-colors duration-[120ms]",
                    "border-border-strong",
                    isSelected && accent.control,
                  )}
                >
                  {isSelected ? (
                    <span className={cn("size-2.5 rounded-full", accent.dot)} />
                  ) : null}
                </span>
              ) : null}

              {option.icon ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex shrink-0 items-center justify-center [&_svg]:size-[18px]",
                    accent.icon,
                  )}
                >
                  {option.icon}
                </span>
              ) : null}

              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex w-full items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {option.label}
                  </span>
                  {option.trailing ? (
                    <>
                      {" "}
                      <span className="ml-auto shrink-0">
                        {option.trailing}
                      </span>
                    </>
                  ) : null}
                </span>
                {option.description ? (
                  <span
                    id={descId}
                    className="text-[13px] text-muted-foreground"
                  >
                    {option.description}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>

      {helperText && !error ? (
        <p id={`${groupId}-helper`} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}

      {error ? (
        <p
          id={`${groupId}-error`}
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
