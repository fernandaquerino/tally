import type { OnboardingProfileInput } from "@tally/shared";

export type OnboardingData = OnboardingProfileInput;
export type OnboardingStepProps = {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
};
