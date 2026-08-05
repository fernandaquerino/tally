import type { Metadata } from "next";

import { LandingHero } from "./_components/LandingHero";

export const metadata: Metadata = {
  title: "Tally — Finanças PF e PJ no mesmo lugar",
  description:
    "Saiba quanto do seu faturamento é imposto, reserva da empresa e dinheiro realmente disponível para você.",
};

export default function LandingPage() {
  return <LandingHero />;
}
