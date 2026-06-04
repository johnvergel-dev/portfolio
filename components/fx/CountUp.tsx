"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Counts from 0 to `value` once the element scrolls into view (§9.7). Uses a
 * quartic ease for a satisfying settle. Renders the final value immediately
 * under reduced motion / no-JS.
 */
export function CountUp({
  value,
  duration = 1.6,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  const format = (n: number) =>
    `${prefix}${n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced) return;
      registerGsap();
      const obj = { n: 0 };
      gsap.to(obj, {
        n: value,
        duration,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = format(obj.n);
        },
      });
    },
    { scope: ref, dependencies: [reduced, value], revertOnUpdate: true },
  );

  return (
    <span ref={ref} className={className} aria-label={format(value)}>
      {format(value)}
    </span>
  );
}
