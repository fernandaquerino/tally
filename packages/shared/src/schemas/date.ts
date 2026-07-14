import { z } from "zod";

/** Data-hora ISO-8601 com offset (borda de API). */
export const isoDateTimeSchema = z.iso.datetime({ offset: true });

/** Data (sem hora) no formato `YYYY-MM-DD`. */
export const dateOnlySchema = z.iso.date();

/**
 * Intervalo de datas opcional (`from`/`to` como data-hora ISO).
 *
 * Quando ambos presentes, `from` deve ser <= `to`.
 */
export const dateRangeSchema = z
  .object({
    from: isoDateTimeSchema.optional(),
    to: isoDateTimeSchema.optional(),
  })
  .refine(
    ({ from, to }) => from === undefined || to === undefined || from <= to,
    { message: "`from` deve ser anterior ou igual a `to`", path: ["from"] },
  );
export type DateRange = z.infer<typeof dateRangeSchema>;
