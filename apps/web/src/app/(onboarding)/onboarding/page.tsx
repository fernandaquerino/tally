"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Alert } from "@/components/feedback/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { useSession } from "@/features/auth/hooks/useSession";
import { AccountStep } from "@/features/onboarding/components/AccountStep";
import { CompanyStep } from "@/features/onboarding/components/CompanyStep";
import { OnboardingSidebar } from "@/features/onboarding/components/OnboardingSidebar";
import { ProfileStep } from "@/features/onboarding/components/ProfileStep";
import { SplitStep } from "@/features/onboarding/components/SplitStep";
import { TaxRegimeStep } from "@/features/onboarding/components/TaxRegimeStep";
import { WelcomeStep } from "@/features/onboarding/components/WelcomeStep";
import { useCompleteOnboarding } from "@/features/onboarding/hooks/useCompleteOnboarding";
import type { OnboardingData } from "@/features/onboarding/types";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: user, isLoading } = useSession();
  const complete = useCompleteOnboarding();
  const onboardingRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef<1 | -1>(1);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    occupation: null,
    monthlyRevenueCents: "",
    cnpj: null,
    taxRegime: "unknown",
    taxPercentage: 15,
    reservePercentage: 10,
    initialAccountType: "business_account",
  });

  useEffect(() => {
    if (user?.onboardingCompleted) router.replace("/dashboard");
    if (user?.name)
      setData((current) =>
        current.name ? current : { ...current, name: user.name },
      );
  }, [router, user]);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline();

        timeline
          .fromTo(
            "[data-onboarding-step]",
            { autoAlpha: 0, x: 28 * directionRef.current },
            { autoAlpha: 1, x: 0, duration: 0.42, ease: "power3.out" },
          )
          .from(
            "[data-onboarding-reveal]",
            {
              autoAlpha: 0,
              y: 12,
              duration: 0.32,
              stagger: 0.045,
              ease: "power2.out",
            },
            "-=0.24",
          );

        gsap.to(progressRef.current, {
          width: `${step * 20}%`,
          duration: 0.5,
          ease: "power3.inOut",
        });

        gsap.fromTo(
          `[data-sidebar-step="${step}"]`,
          { scale: 0.92 },
          { scale: 1, duration: 0.3, ease: "back.out(1.8)" },
        );
      });

      return () => media.revert();
    },
    { scope: onboardingRef, dependencies: [step], revertOnUpdate: true },
  );

  if (isLoading || user?.onboardingCompleted)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  const common = {
    data,
    onChange: (patch: Partial<OnboardingData>) =>
      setData((current) => ({ ...current, ...patch })),
    onNext: () => goToStep(step + 1, 1),
    onBack: () => goToStep(Math.max(0, step - 1), -1),
  };

  function goToStep(nextStep: number, direction: 1 | -1) {
    directionRef.current = direction;
    setStep(nextStep);
  }

  function submit() {
    complete.mutate(data, { onSuccess: () => router.replace("/dashboard") });
  }

  return (
    <section ref={onboardingRef} className="flex min-h-screen bg-background">
      <OnboardingSidebar current={step} />
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="h-1 bg-border">
          <div
            className="h-full bg-primary transition-[width]"
            ref={progressRef}
            style={{ width: "0%" }}
          />
        </div>
        {complete.error && (
          <Alert variant="danger" className="m-4">
            Não foi possível salvar seu perfil. Revise os dados e tente
            novamente.
          </Alert>
        )}
        {step === 0 && <WelcomeStep onNext={() => goToStep(1, 1)} />}
        {step === 1 && <ProfileStep {...common} />}
        {step === 2 && <CompanyStep {...common} />}
        {step === 3 && <TaxRegimeStep {...common} />}
        {step === 4 && <SplitStep {...common} />}
        {step === 5 && (
          <AccountStep
            {...common}
            onNext={submit}
            loading={complete.isPending}
          />
        )}
      </main>
    </section>
  );
}
