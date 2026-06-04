"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePointerFine } from "@/hooks/usePointerFine";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Custom cursor (§9.8): a dot that tracks 1:1 and a ring with inertia (lerp via
 * gsap.ticker). States: grows over interactive elements, shows a contextual
 * label over `[data-cursor]` targets, becomes a crosshair over the WebGL layer.
 * Mounts only on fine pointers with motion enabled; hides the native cursor.
 */
export function Cursor() {
  const fine = usePointerFine();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<"default" | "interactive" | "crosshair">(
    "default",
  );

  useEffect(() => {
    if (!enabled) return;
    registerGsap();
    document.body.classList.add("cursor-none");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...pos };
    gsap.set([dotRef.current, ringRef.current], {
      xPercent: -50,
      yPercent: -50,
    });
    const setDotX = gsap.quickSetter(dotRef.current, "x", "px");
    const setDotY = gsap.quickSetter(dotRef.current, "y", "px");
    const setRingX = gsap.quickSetter(ringRef.current, "x", "px");
    const setRingY = gsap.quickSetter(ringRef.current, "y", "px");

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      setDotX(pos.x);
      setDotY(pos.y);
    };

    const tick = () => {
      ring.x += (pos.x - ring.x) * 0.18;
      ring.y += (pos.y - ring.y) * 0.18;
      setRingX(ring.x);
      setRingY(ring.y);
    };
    gsap.ticker.add(tick);

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const labelTarget = t.closest<HTMLElement>("[data-cursor]");
      if (labelRef.current) {
        labelRef.current.textContent = labelTarget?.dataset.cursor ?? "";
        labelRef.current.dataset.show = labelTarget ? "true" : "false";
      }
      if (t.closest("canvas")) setState("crosshair");
      else if (
        t.closest('a, button, [role="radio"], [data-magnetic], [data-cursor]')
      )
        setState("interactive");
      else setState("default");
    };
    const onDown = () =>
      gsap.to(ringRef.current, { scale: 0.8, duration: 0.15 });
    const onUp = () => gsap.to(ringRef.current, { scale: 1, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      document.body.classList.remove("cursor-none");
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-[var(--a)]"
      />
      <div
        ref={ringRef}
        data-state={state}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-[var(--a)] transition-[width,height,background-color,border-radius] duration-200 data-[state=crosshair]:rounded-none data-[state=default]:h-8 data-[state=default]:w-8 data-[state=interactive]:h-12 data-[state=interactive]:w-12 data-[state=interactive]:bg-[color-mix(in_srgb,var(--a)_12%,transparent)] data-[state=crosshair]:h-6 data-[state=crosshair]:w-6"
      >
        <span
          ref={labelRef}
          className="telemetry whitespace-nowrap text-[0.5rem] text-[var(--a)] opacity-0 transition-opacity data-[show=true]:opacity-100"
        />
      </div>
    </div>
  );
}
