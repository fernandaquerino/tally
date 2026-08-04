import { PipeTransform, UnprocessableEntityException } from "@nestjs/common";
import type { ZodType } from "zod";

/**
 * Valida o body/param contra um schema Zod (AGENTS §11: valide input sempre no
 * backend). Em falha, lança 422 no envelope `{ error: { code, message, details } }`
 * já esperado pelo HttpExceptionFilter.
 *
 * Uso: `@Body(new ZodValidationPipe(registerSchema)) dto: RegisterInput`.
 */
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new UnprocessableEntityException({
        code: "VALIDATION_ERROR",
        message: "Dados inválidos.",
        details: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    return result.data;
  }
}
