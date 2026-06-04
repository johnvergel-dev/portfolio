"use client";

import { useEffect } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePointerFine } from "@/hooks/usePointerFine";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Global tilt + magnetic controller (§9.5, §9.6). Rather than wrapping every
 * card/button, it wires elements by data-attribute — keeping motion fully
 * decoupled from content. A debounced MutationObserver attaches handlers to
 * elements added later (async GitHub cards, re-rendered loadouts). Fine pointer
 * + motion only.
 */
export function InteractionFX() {
  const fine = usePointerFine();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!fine || reduced) return;
    registerGsap();

    const cleanups = new Map<Element, () => void>();

    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        if (!cleanups.has(el)) cleanups.set(el, attachTilt(el));
      });
      document
        .querySelectorAll<HTMLElement>("[data-magnetic]")
        .forEach((el) => {
          if (!cleanups.has(el)) cleanups.set(el, attachMagnetic(el));
        });
      for (const [el, dispose] of cleanups) {
        if (!el.isConnected) {
          dispose();
          cleanups.delete(el);
        }
      }
    };

    scan();
    let raf = 0;
    const observer = new MutationObserver(() => {
      window.clearTimeout(raf);
      raf = window.setTimeout(scan, 150);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      window.clearTimeout(raf);
      cleanups.forEach((dispose) => dispose());
      cleanups.clear();
    };
  }, [fine, reduced]);

  return null;
}

function attachTilt(el: HTMLElement): () => void {
  const MAX = 8; // degrees
  gsap.set(el, { transformPerspective: 900, transformStyle: "preserve-3d" });
  const layers = el.querySelectorAll<HTMLElement>("[data-tilt-layer]");
  gsap.set(layers, { z: 22, transformStyle: "preserve-3d" });

  const rotX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
  const rotY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });

  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    rotY((px / r.width - 0.5) * 2 * MAX);
    rotX(-(py / r.height - 0.5) * 2 * MAX);
    el.style.setProperty("--mx", `${px}px`);
    el.style.setProperty("--my", `${py}px`);
    el.style.setProperty("--sheen", "0.7");
  };
  const onLeave = () => {
    rotX(0);
    rotY(0);
    el.style.setProperty("--sheen", "0");
  };

  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerleave", onLeave);
  return () => {
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerleave", onLeave);
    gsap.set(el, {
      clearProps: "transform,transformPerspective,transformStyle",
    });
    gsap.set(layers, { clearProps: "transform,transformStyle" });
  };
}

function attachMagnetic(el: HTMLElement): () => void {
  const STRENGTH = 0.35;
  const x = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
  const y = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    x((e.clientX - (r.left + r.width / 2)) * STRENGTH);
    y((e.clientY - (r.top + r.height / 2)) * STRENGTH);
  };
  const onLeave = () => {
    x(0);
    y(0);
  };

  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerleave", onLeave);
  return () => {
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerleave", onLeave);
    gsap.set(el, { clearProps: "transform" });
  };
}
