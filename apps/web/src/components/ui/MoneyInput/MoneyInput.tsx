import { Input, type InputProps } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

export type MoneyInputProps = DistributiveOmit<InputProps, "prefix"> & {
  transactionType?: "income" | "expense";
};

export function MoneyInput({
  className,
  inputMode,
  transactionType,
  ...props
}: MoneyInputProps) {
  return (
    <Input
      className={cn(
        "font-mono text-lg font-semibold tabular-nums",
        transactionType === "income" && "text-income",
        transactionType === "expense" && "text-expense",
        className,
      )}
      inputMode={inputMode ?? "decimal"}
      prefix="R$"
      {...props}
    />
  );
}
