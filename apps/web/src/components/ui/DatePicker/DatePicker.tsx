"use client";

import { format, isSameDay } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import {
  DayPicker,
  type ChevronProps,
  type DateRange,
  type Matcher,
} from "react-day-picker";
import { ptBR } from "react-day-picker/locale";

import { cn } from "@/lib/utils";

export interface DatePickerPresetSingle {
  label: string;
  value: Date;
}

export interface DatePickerPresetRange {
  label: string;
  value: DateRange;
}

interface CommonProps {
  className?: string;
  numberOfMonths?: number;
  disabled?: Matcher | Matcher[];
  defaultMonth?: Date;
}

interface SingleDatePickerProps extends CommonProps {
  mode?: "single";
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (value: Date | undefined) => void;
  presets?: DatePickerPresetSingle[];
}

interface RangeDatePickerProps extends CommonProps {
  mode: "range";
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange | undefined) => void;
  presets?: DatePickerPresetRange[];
}

export type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

function Chevron({ orientation, className }: ChevronProps) {
  const Icon = orientation === "left" ? ChevronLeftIcon : ChevronRightIcon;
  return <Icon className={cn("size-4", className)} aria-hidden="true" />;
}

function formatCaption(month: Date) {
  const label = format(month, "LLLL yyyy", { locale: ptBR });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

const selectedPill = cn(
  "[&>button]:bg-primary [&>button]:font-medium [&>button]:text-primary-foreground",
  "[&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
);

function buildClassNames(mode: "single" | "range") {
  return {
    months: "relative flex flex-col",
    month: "flex flex-col gap-3",
    month_caption: "relative flex h-8 items-center justify-center",
    caption_label: "text-sm font-semibold text-foreground",
    nav: "absolute inset-x-0 top-0 flex h-8 items-center justify-between",
    button_previous:
      "inline-flex size-8 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
    button_next:
      "inline-flex size-8 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
    month_grid: "w-full border-collapse",
    weekdays: "flex",
    weekday:
      "flex-1 pb-1 text-center text-xs font-normal text-foreground-subtle",
    weeks: "",
    week: "mt-1 flex w-full",
    day: "relative flex-1 p-0 text-center text-sm",
    day_button:
      "flex h-9 w-full items-center justify-center rounded-md text-sm text-foreground transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
    today: "[&>button]:font-semibold [&>button]:text-primary",
    outside: "text-foreground-subtle opacity-50",
    disabled: "opacity-40 [&>button]:pointer-events-none",
    hidden: "invisible",
    selected: mode === "single" ? selectedPill : "",
    range_start: cn("rounded-l-md bg-primary-subtle", selectedPill),
    range_end: cn("rounded-r-md bg-primary-subtle", selectedPill),
    range_middle: "bg-primary-subtle [&>button]:text-foreground",
  };
}

export function DatePicker(props: DatePickerProps) {
  const {
    className,
    numberOfMonths = 1,
    disabled,
    defaultMonth,
    mode = "single",
    presets,
  } = props;

  const isControlled = props.value !== undefined;
  const [internalValue, setInternalValue] = useState<
    Date | DateRange | undefined
  >(props.defaultValue);
  const currentValue = isControlled ? props.value : internalValue;

  const initialMonth =
    defaultMonth ??
    (mode === "range"
      ? (currentValue as DateRange | undefined)?.from
      : (currentValue as Date | undefined)) ??
    new Date();
  const [month, setMonth] = useState<Date>(initialMonth);

  function commit(next: Date | DateRange | undefined) {
    if (!isControlled) {
      setInternalValue(next);
    }
    if (mode === "range") {
      (props as RangeDatePickerProps).onValueChange?.(
        next as DateRange | undefined,
      );
    } else {
      (props as SingleDatePickerProps).onValueChange?.(
        next as Date | undefined,
      );
    }
  }

  function isPresetActive(
    preset: DatePickerPresetSingle | DatePickerPresetRange,
  ) {
    if (!currentValue) return false;
    if (mode === "range") {
      const range = currentValue as DateRange;
      const presetRange = preset.value as DateRange;
      return (
        Boolean(range.from) &&
        Boolean(presetRange.from) &&
        isSameDay(range.from!, presetRange.from!) &&
        Boolean(range.to) === Boolean(presetRange.to) &&
        (!range.to || isSameDay(range.to, presetRange.to!))
      );
    }
    return isSameDay(currentValue as Date, preset.value as Date);
  }

  function handlePreset(
    preset: DatePickerPresetSingle | DatePickerPresetRange,
  ) {
    commit(preset.value);
    const nextMonth =
      mode === "range"
        ? (preset.value as DateRange).from
        : (preset.value as Date);
    if (nextMonth) {
      setMonth(nextMonth);
    }
  }

  const classNames = buildClassNames(mode);

  return (
    <div
      className={cn(
        "w-fit rounded-xl border border-border bg-card p-4",
        className,
      )}
    >
      {presets && presets.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {presets.map((preset) => {
            const active = isPresetActive(preset);
            return (
              <button
                key={preset.label}
                type="button"
                aria-pressed={active}
                onClick={() => handlePreset(preset)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                  active
                    ? "bg-primary-subtle text-primary"
                    : "bg-secondary text-foreground-muted hover:bg-border hover:text-foreground",
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {mode === "range" ? (
        <DayPicker
          mode="range"
          locale={ptBR}
          showOutsideDays
          month={month}
          onMonthChange={setMonth}
          numberOfMonths={numberOfMonths}
          disabled={disabled}
          selected={currentValue as DateRange | undefined}
          onSelect={(next) => commit(next)}
          classNames={classNames}
          components={{ Chevron }}
          formatters={{ formatCaption }}
        />
      ) : (
        <DayPicker
          mode="single"
          locale={ptBR}
          showOutsideDays
          month={month}
          onMonthChange={setMonth}
          numberOfMonths={numberOfMonths}
          disabled={disabled}
          selected={currentValue as Date | undefined}
          onSelect={(next) => commit(next)}
          classNames={classNames}
          components={{ Chevron }}
          formatters={{ formatCaption }}
        />
      )}
    </div>
  );
}
