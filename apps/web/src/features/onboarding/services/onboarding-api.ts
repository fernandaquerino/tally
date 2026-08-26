import type { OnboardingProfileInput } from "@tally/shared";
import { apiFetch } from "@/lib/api/client";

export function completeOnboarding(body: OnboardingProfileInput) {
  return apiFetch<{ onboardingCompleted: true }>("/onboarding/complete", {
    method: "PUT",
    body,
  });
}
