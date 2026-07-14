/** Contexto financeiro: pessoa física ou pessoa jurídica. */
export type ContextType = "PF" | "PJ";

/** Valores possíveis de {@link ContextType}, para iteração/validação. */
export const CONTEXT_TYPES = ["PF", "PJ"] as const satisfies readonly ContextType[];
