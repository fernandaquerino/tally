"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  /** Deslocamento vertical inicial, em px. */
  y?: number;
  durationSeconds?: number;
  delaySeconds?: number;
}

/**
 * Envolve o conteúdo em uma entrada suave (fade + slide) com GSAP. O conteúdo é
 * renderizado visível por padrão: quem tem `prefers-reduced-motion` (ou está sem
 * JS) vê tudo estático — a animação só roda quando o movimento é bem-vindo.
 */
export function FadeIn({
  children,
  className,
  y = 12,
  durationSeconds = 0.6,
  delaySeconds = 0,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, {
          autoAlpha: 0,
          y,
          duration: durationSeconds,
          delay: delaySeconds,
          ease: "power3.out",
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
