"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { useProfile } from "@/components/providers/ProfileProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Reconfiguration transition (§9.9): on loadout change a vertical scan-line in
 * the new accent sweeps the screen while the content briefly blurs + dims and
 * settles back — selling "system switching modes" rather than a re-render.
 * Total ≤ 0.7s. Skipped under reduced motion. Also emits `loadout:reconfigure`
 * so the WebGL particle field can pulse in sync.
 */
export function ReconfigureFX() {
  const { transitionNonce } = useProfile();
  const reduced = usePrefersReducedMotion();
  const scanRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      if (reduced) return;
      registerGsap();

      window.dispatchEvent(new CustomEvent("loadout:reconfigure"));

      const main = document.getElementById("main");
      const tl = gsap.timeline();

      tl.set(scanRef.current, { autoAlpha: 1, xPercent: -130 });
      tl.to(
        scanRef.current,
        { xPercent: 130, duration: 0.62, ease: "power2.inOut" },
        0,
      );
      tl.to(scanRef.current, { autoAlpha: 0, duration: 0.18 }, 0.5);

      if (main) {
        tl.fromTo(
          main,
          { filter: "blur(0px)", opacity: 1 },
          {
            filter: "blur(7px)",
            opacity: 0.55,
            duration: 0.16,
            ease: "power2.in",
          },
          0,
        );
        tl.to(
          main,
          { filter: "blur(0px)", opacity: 1, duration: 0.42, ease: "expoOut" },
          0.2,
        );
      }
    },
    { dependencies: [transitionNonce] },
  );

  return (
    <div
      ref={scanRef}
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-0 z-[90] w-[42vw] opacity-0"
      style={{
        background:
          "linear-gradient(90deg, transparent, color-mix(in srgb, var(--a) 22%, transparent) 60%, var(--a) 80%, color-mix(in srgb, var(--a) 22%, transparent) 92%, transparent)",
        filter: "blur(2px)",
      }}
    />
  );
}
