"use client";

import { type CSSProperties, type InputHTMLAttributes, useState } from "react";

import { cn } from "@/lib/utils";

export type RangeVariant = "primary" | "warning" | "pj";

type RangeA11yProps =
  | { "aria-label": string; "aria-labelledby"?: string }
  | { "aria-label"?: string; "aria-labelledby": string };

export type RangeProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | "type"
  | "value"
  | "defaultValue"
  | "min"
  | "max"
  | "step"
  | "onChange"
  | "readOnly"
  | "aria-label"
  | "aria-labelledby"
> &
  RangeA11yProps & {
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    onValueChange?: (value: number) => void;
    variant?: RangeVariant;
    readOnly?: boolean;
  };

const variantColor: Record<RangeVariant, string> = {
  primary: "var(--primary)",
  warning: "var(--warning)",
  pj: "var(--pj)",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function Range({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  variant = "primary",
  disabled,
  readOnly = false,
  onKeyDown,
  ...props
}: RangeProps) {
  const initialValue = clamp(defaultValue ?? min, min, max);
  const [internalValue, setInternalValue] = useState(initialValue);
  const isControlled = value !== undefined;
  const currentValue = clamp(isControlled ? value : internalValue, min, max);
  const percentage =
    max === min ? 0 : ((currentValue - min) / (max - min)) * 100;
  const rangeColor = variantColor[variant];
  const rangeStyle = {
    "--range-color": rangeColor,
  } as CSSProperties;

  return (
    <div
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cn(
        "relative h-5 w-full rounded-full",
        "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-background",
        "data-disabled:opacity-50",
        className,
      )}
      style={rangeStyle}
    >
      <div
        aria-hidden="true"
        className="absolute top-1/2 h-2 w-full -translate-y-1/2 overflow-hidden rounded-full bg-border"
      >
        <div
          className="h-full rounded-full bg-[var(--range-color)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--range-color)] shadow-sm"
        style={{ left: `${percentage}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        disabled={disabled}
        aria-readonly={readOnly || undefined}
        className={cn(
          "absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0",
          "disabled:cursor-not-allowed",
          readOnly && "cursor-default",
        )}
        onChange={(event) => {
          if (readOnly) return;

          const nextValue = event.currentTarget.valueAsNumber;
          if (!isControlled) {
            setInternalValue(nextValue);
          }
          onValueChange?.(nextValue);
        }}
        onKeyDown={(event) => {
          if (readOnly) {
            event.preventDefault();
          }
          onKeyDown?.(event);
        }}
        {...props}
      />
    </div>
  );
}
