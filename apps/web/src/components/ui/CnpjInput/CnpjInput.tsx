"use client";

import { type ChangeEvent, useId, useState } from "react";

import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export interface CnpjInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  name?: string;
}

export function formatCnpj(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function CnpjInput({
  value,
  defaultValue = "",
  onValueChange,
  disabled,
  className,
  name = "cnpj",
}: CnpjInputProps) {
  const generatedId = useId();
  const labelId = `${generatedId}-label`;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(() =>
    defaultValue.replace(/\D/g, "").slice(0, 14),
  );
  const digits = isControlled
    ? value.replace(/\D/g, "").slice(0, 14)
    : internalValue;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value.replace(/\D/g, "").slice(0, 14);

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  return (
    <div className="grid gap-2">
      <div
        id={labelId}
        className="flex items-center justify-between gap-4 text-xs font-medium text-foreground"
      >
        <span>CNPJ</span>
        <span aria-hidden="true" className="font-normal text-muted-foreground">
          Opcional
        </span>
      </div>
      <Input
        aria-labelledby={labelId}
        className={cn("h-11 text-base", className)}
        disabled={disabled}
        inputMode="numeric"
        name={name}
        placeholder="00.000.000/0000-00"
        autoComplete="off"
        value={formatCnpj(digits)}
        onChange={handleChange}
      />
    </div>
  );
}
