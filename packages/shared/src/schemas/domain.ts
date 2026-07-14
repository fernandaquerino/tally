import { z } from "zod";

import { CONTEXT_TYPES, TRANSACTION_TYPES } from "@tally/shared/types";

/** Contexto financeiro (`PF` | `PJ`). */
export const contextTypeSchema = z.enum(CONTEXT_TYPES);

/** Tipo de transação (`income` | `expense` | `transfer`). */
export const transactionTypeSchema = z.enum(TRANSACTION_TYPES);
