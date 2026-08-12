"use client";

import { type ReactNode, useId, useState } from "react";

import { cn } from "@/lib/utils";

export interface PillRadioOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface PillRadioGroupProps {
  label: string;
  options: PillRadioOption[];
  value?: string;
  defaultValue?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  optional?: boolean;
  className?: string;
}

export function PillRadioGroup({
  label,
  options,
  value,
  defaultValue,
  name,
  onValueChange,
  disabled: groupDisabled = false,
  optional = false,
  className,
}: PillRadioGroupProps) {
  const generatedId = useId();
  const groupName = name ?? `${generatedId}-pill-radio`;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const selectedValue = isControlled ? value : internalValue;

  function handleChange(nextValue: string) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  return (
    <fieldset
      className={cn("grid gap-2.5", className)}
      disabled={groupDisabled}
    >
      <legend className="w-full mb-2">
        <span className="flex items-center justify-between gap-4 text-xs font-medium text-foreground">
          <span>{label}</span>
          {optional ? (
            <span className="font-normal text-muted-foreground">Opcional</span>
          ) : null}
        </span>
      </legend>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const optionId = `${generatedId}-${option.value}`;
          const isSelected = selectedValue === option.value;
          const isDisabled = groupDisabled || option.disabled;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              data-state={isSelected ? "checked" : "unchecked"}
              className={cn(
                "relative inline-flex min-h-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground-subtle select-none",
                "transition-[background-color,border-color,color,box-shadow] duration-[120ms] hover:border-border-strong hover:text-foreground",
                "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-background",
                "data-[state=checked]:border-primary data-[state=checked]:bg-primary-subtle data-[state=checked]:font-medium data-[state=checked]:text-primary",
                isDisabled &&
                  "cursor-not-allowed opacity-50 hover:border-border hover:text-foreground-subtle",
              )}
            >
              <input
                id={optionId}
                type="radio"
                name={groupName}
                value={option.value}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => handleChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
