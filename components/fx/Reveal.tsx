"use client";

import { createElement, useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, SplitText, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type SplitKind = "chars" | "words" | "lines";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Distance (px) the block travels in. */
  y?: number;
  /** Delay before the tween. */
  delay?: number;
  /** Stagger applied to direct children (block mode) or split pieces. */
  stagger?: number;
  /** ScrollTrigger start. */
  start?: string;
  /** When set, splits the (text) child and reveals pieces with a mask. */
  splitType?: SplitKind;
  /** Stagger between direct children; only relevant in block mode. */
  staggerChildren?: boolean;
}

/**
 * Scroll-triggered reveal primitive (§9.4). Two modes:
 *  - block: fades/slides/deblurs the element (optionally staggering children),
 *  - split: uses SplitText + an overflow mask to reveal chars/words/lines.
 *
 * Respects reduced motion (renders content immediately, no transforms) and
 * avoids first-paint flashes via the layout-effect timing of useGSAP + the
 * boot overlay.
 *
 * Implementation note: a `display:contents` wrapper carries the scope ref so we
 * never pass a ref through the polymorphic `as` element — that both keeps the
 * react-hooks ref rule happy and avoids R3F's global JSX augmentation poisoning
 * the polymorphic children type.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  y = 28,
  delay = 0,
  stagger = 0.08,
  start = "top 85%",
  splitType,
  staggerChildren = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const wrap = ref.current;
      if (!wrap || reduced) return;
      const el = (wrap.firstElementChild as HTMLElement | null) ?? wrap;
      registerGsap();

      if (splitType) {
        const split = new SplitText(el, { type: splitType, mask: splitType });
        const pieces =
          splitType === "chars"
            ? split.chars
            : splitType === "words"
              ? split.words
              : split.lines;
        gsap.set(el, { autoAlpha: 1 });
        gsap.from(pieces, {
          yPercent: 110,
          opacity: 0,
          duration: 0.9,
          ease: "hud",
          stagger: splitType === "chars" ? 0.022 : 0.09,
          delay,
          scrollTrigger: { trigger: el, start, once: true },
        });
        return () => split.revert();
      }

      const targets =
        staggerChildren && el.children.length
          ? (Array.from(el.children) as HTMLElement[])
          : el;
      gsap.set(el, { autoAlpha: 1 });
      gsap.from(targets, {
        autoAlpha: 0,
        y,
        filter: "blur(8px)",
        duration: 0.9,
        ease: "hud",
        delay,
        stagger: staggerChildren ? stagger : 0,
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    // revertOnUpdate: when reduced motion turns on, revert the hide so content
    // becomes visible (useGSAP does NOT revert on dependency change by default).
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={ref} style={{ display: "contents" }}>
      {createElement(Tag, { className }, children)}
    </div>
  );
}
