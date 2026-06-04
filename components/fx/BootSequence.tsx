"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { siteConfig } from "@/data/site.config";

/**
 * Boot sequence (§9.2): a full-screen "INITIALIZING…" overlay with a progress
 * bar that retires with an upward wipe (total ≤ 1.6s). It masks the first paint
 * of the above-the-fold reveals, so there is never a flash. Under reduced
 * motion it is skipped entirely (no overlay, content visible immediately).
 */
export function BootSequence() {
  const reduced = usePrefersReducedMotion();
  const overlay = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      if (reduced) {
        setDone(true);
        return;
      }
      registerGsap();
      document.body.style.overflow = "hidden";

      const counter = { v: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          document.body.style.overflow = "";
          setDone(true);
        },
      });

      tl.set(bar.current, { scaleX: 0, transformOrigin: "left center" });
      tl.to(
        counter,
        {
          v: 100,
          duration: 1.0,
          ease: "power1.in",
          onUpdate: () => {
            if (pct.current)
              pct.current.textContent = Math.round(counter.v)
                .toString()
                .padStart(3, "0");
          },
        },
        0,
      );
      tl.to(bar.current, { scaleX: 1, duration: 1.0 }, 0);
      tl.to(overlay.current, { autoAlpha: 1, duration: 0.2 }, 0);
      tl.to(
        overlay.current,
        { yPercent: -100, duration: 0.62, ease: "expoOut" },
        ">+0.08",
      );
    },
    { dependencies: [reduced] },
  );

  if (done) return null;

  return (
    <div
      ref={overlay}
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-[var(--bg)]"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative flex flex-col items-center gap-5">
        <span className="display neon-text text-2xl font-700 tracking-[0.2em]">
          {siteConfig.callsign}
        </span>
        <div className="h-[2px] w-[min(72vw,360px)] overflow-hidden bg-[var(--line)]">
          <span
            ref={bar}
            className="block h-full w-full origin-left bg-[var(--a)] [box-shadow:0_0_12px_var(--glow)]"
          />
        </div>
        <p className="telemetry flex items-center gap-2 text-[0.62rem] text-[var(--muted)]">
          INITIALIZING OPERATOR HUD
          <span ref={pct} className="text-[var(--a)]">
            000
          </span>
          %
        </p>
      </div>
    </div>
  );
}
