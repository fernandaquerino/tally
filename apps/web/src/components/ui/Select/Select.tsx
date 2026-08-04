"use client";

import { CheckIcon, ChevronDownIcon, CircleAlertIcon } from "lucide-react";
import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  color?: string;
  disabled?: boolean;
}

export interface SelectGroup {
  label?: string;
  options: SelectOption[];
}

export interface SelectProps {
  label: string;
  groups: SelectGroup[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

export function Select({
  label,
  groups,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Selecione uma opção",
  helperText,
  error,
  disabled,
  required,
  name,
  id,
  className,
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listboxId = `${selectId}-listbox`;
  const descriptionId = error
    ? `${selectId}-error`
    : helperText
      ? `${selectId}-helper`
      : undefined;
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [activeIndex, setActiveIndex] = useState(-1);
  const currentValue = value ?? internalValue;
  const options = groups.flatMap((group) => group.options);
  const selectedOption = options.find(
    (option) => option.value === currentValue,
  );

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  function findNextEnabledIndex(from: number, direction: 1 | -1) {
    for (let offset = 1; offset <= options.length; offset += 1) {
      const index =
        (from + direction * offset + options.length) % options.length;
      if (!options[index]?.disabled) return index;
    }
    return -1;
  }

  function open() {
    if (disabled || options.length === 0) return;
    const selectedIndex = options.findIndex(
      (option) => option.value === currentValue && !option.disabled,
    );
    setActiveIndex(
      selectedIndex >= 0 ? selectedIndex : findNextEnabledIndex(-1, 1),
    );
    setIsOpen(true);
  }

  function selectOption(option: SelectOption) {
    if (option.disabled) return;
    if (value === undefined) setInternalValue(option.value);
    onValueChange?.(option.value);
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!isOpen) {
        open();
        return;
      }

      if (event.key === "Home") {
        setActiveIndex(findNextEnabledIndex(-1, 1));
      } else if (event.key === "End") {
        setActiveIndex(findNextEnabledIndex(0, -1));
      } else {
        setActiveIndex(
          findNextEnabledIndex(activeIndex, event.key === "ArrowDown" ? 1 : -1),
        );
      }
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && isOpen) {
      event.preventDefault();
      const activeOption = options[activeIndex];
      if (activeOption) selectOption(activeOption);
    }
  }

  let optionIndex = -1;

  return (
    <div className={cn("grid w-full gap-2", className)} ref={rootRef}>
      <label
        id={`${selectId}-label`}
        htmlFor={selectId}
        className="text-xs font-medium text-foreground"
      >
        {label}
        {required ? (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      <div className="relative">
        <button
          id={selectId}
          type="button"
          aria-activedescendant={
            isOpen && activeIndex >= 0
              ? `${selectId}-option-${activeIndex}`
              : undefined
          }
          aria-controls={isOpen ? listboxId : undefined}
          aria-describedby={descriptionId}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={Boolean(error) || undefined}
          aria-labelledby={`${selectId}-label`}
          disabled={disabled}
          onClick={() => (isOpen ? setIsOpen(false) : open())}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex h-[38px] w-full items-center justify-between rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-[140ms] focus-visible:border-primary focus-visible:outline-[3px_solid_var(--primary-border)] disabled:cursor-not-allowed disabled:opacity-50 aria-expanded:border-primary aria-invalid:border-destructive aria-invalid:bg-error-subtle",
            !selectedOption && "text-muted-foreground",
          )}
        >
          <span className="flex min-w-0 items-center gap-2 truncate">
            {selectedOption?.color ? (
              <span
                className="size-[9px] shrink-0 rounded-full"
                style={{ backgroundColor: selectedOption.color }}
                aria-hidden="true"
              />
            ) : null}
            <span className="truncate">
              {selectedOption?.label ?? placeholder}
            </span>
          </span>
          <ChevronDownIcon
            className={cn(
              "size-4 shrink-0 text-foreground-subtle transition-transform",
              isOpen && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>

        {isOpen ? (
          <div
            id={listboxId}
            role="listbox"
            aria-labelledby={`${selectId}-label`}
            className="absolute top-11 right-0 left-0 z-50 overflow-hidden rounded-[10px] border border-border bg-card p-1.5 shadow-[0_16px_40px_-12px_rgb(18_21_27/0.16)]"
          >
            {groups.map((group, groupIndex) => (
              <div
                key={`${group.label ?? "group"}-${groupIndex}`}
                role="group"
                aria-label={group.label}
              >
                {group.label ? (
                  <div className="px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.04em] text-foreground-subtle uppercase">
                    {group.label}
                  </div>
                ) : null}
                {group.options.map((option) => {
                  optionIndex += 1;
                  const index = optionIndex;
                  const isSelected = option.value === currentValue;
                  const isActive = index === activeIndex;

                  return (
                    <div
                      id={`${selectId}-option-${index}`}
                      key={option.value}
                      role="option"
                      aria-disabled={option.disabled || undefined}
                      aria-selected={isSelected}
                      onMouseEnter={() =>
                        !option.disabled && setActiveIndex(index)
                      }
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectOption(option)}
                      className={cn(
                        "flex cursor-pointer items-center gap-[9px] rounded-[7px] px-2.5 py-2 text-sm text-foreground outline-none",
                        (isSelected || isActive) && "bg-primary-subtle",
                        option.disabled && "cursor-not-allowed opacity-50",
                      )}
                    >
                      {option.color ? (
                        <span
                          className="size-[9px] shrink-0 rounded-full"
                          style={{ backgroundColor: option.color }}
                          aria-hidden="true"
                        />
                      ) : null}
                      <span className="truncate">{option.label}</span>
                      {isSelected ? (
                        <CheckIcon
                          className="ml-auto size-[15px] text-primary"
                          aria-hidden="true"
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : null}

        {name ? <input type="hidden" name={name} value={currentValue} /> : null}
      </div>

      {helperText && !error ? (
        <p id={`${selectId}-helper`} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}

      {error ? (
        <p
          id={`${selectId}-error`}
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
