import { Body, Controller, Put } from "@nestjs/common";
import {
  onboardingProfileSchema,
  type OnboardingProfileInput,
} from "@tally/shared";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe.js";
import type { AuthenticatedUser } from "../../common/types/authenticated-user.js";
import { OnboardingService } from "./onboarding.service.js";

@Controller("onboarding")
export class OnboardingController {
  constructor(private readonly service: OnboardingService) {}

  @Put("complete")
  complete(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(onboardingProfileSchema))
    input: OnboardingProfileInput,
  ) {
    return this.service.complete(user.userId, input);
  }
}
