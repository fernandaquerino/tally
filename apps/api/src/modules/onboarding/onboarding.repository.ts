import { Injectable } from "@nestjs/common";
import type { OnboardingProfileInput } from "@tally/shared";
import { PrismaService } from "../../prisma/prisma.service.js";

@Injectable()
export class OnboardingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async complete(userId: string, input: OnboardingProfileInput): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: input.name,
        occupation: input.occupation,
        monthlyRevenueCents: BigInt(input.monthlyRevenueCents),
        cnpj: input.cnpj,
        taxRegime: input.taxRegime,
        taxPercentage: input.taxPercentage,
        reservePercentage: input.reservePercentage,
        initialAccountType: input.initialAccountType,
        onboardingCompletedAt: new Date(),
      },
    });
  }
}
