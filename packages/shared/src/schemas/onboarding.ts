import { z } from "zod";

export const onboardingProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    occupation: z
      .enum([
        "design",
        "development",
        "consulting",
        "marketing",
        "health",
        "other",
      ])
      .nullable(),
    monthlyRevenueCents: z.string().regex(/^\d+$/),
    cnpj: z
      .string()
      .regex(/^\d{14}$/)
      .nullable(),
    taxRegime: z.enum(["mei", "simples_nacional", "unknown"]),
    taxPercentage: z.number().int().min(0).max(40),
    reservePercentage: z.number().int().min(0).max(40),
    initialAccountType: z.enum([
      "business_account",
      "personal_account",
      "credit_card",
      "later",
    ]),
  })
  .refine(
    ({ taxPercentage, reservePercentage }) =>
      taxPercentage + reservePercentage <= 100,
    {
      message: "A divisão não pode ultrapassar 100%.",
    },
  );

export type OnboardingProfileInput = z.infer<typeof onboardingProfileSchema>;
