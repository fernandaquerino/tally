import { Injectable } from "@nestjs/common";
import type { OnboardingProfileInput } from "@tally/shared";
import { OnboardingRepository } from "./onboarding.repository.js";

@Injectable()
export class OnboardingService {
  constructor(private readonly repository: OnboardingRepository) {}

  async complete(userId: string, input: OnboardingProfileInput) {
    await this.repository.complete(userId, input);
    return { onboardingCompleted: true as const };
  }
}
