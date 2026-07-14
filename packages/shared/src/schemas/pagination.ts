import { z } from "zod";

/**
 * Paginação cursor-based (system-design: cursor em `/transactions`).
 *
 * `limit` é coagido a partir de query string e limitado a `[1, 100]`.
 */
export const paginationSchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type Pagination = z.infer<typeof paginationSchema>;
