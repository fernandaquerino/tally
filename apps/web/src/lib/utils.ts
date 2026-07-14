import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Concatena classes condicionais (clsx) e resolve conflitos de utilitários
 * Tailwind (tailwind-merge), para que a `className` passada pelo consumidor
 * sobrescreva a do componente.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
