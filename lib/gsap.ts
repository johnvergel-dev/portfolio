"use client";

/**
 * Single client-only entry point for GSAP. Registers every plugin the project
 * uses exactly once and defines the project's `CustomEase` curves.
 *
 * Import `gsap`, `useGSAP` and the plugins from here (not from `gsap` directly)
 * and call `registerGsap()` at the top of any animation component. The call is
 * idempotent and a no-op on the server.
 */
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

export function registerGsap(): void {
  if (registered || typeof window === "undefined") return;

  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    SplitText,
    DrawSVGPlugin,
    CustomEase,
  );

  // Signature curves (see lib/ease.ts for the named references).
  CustomEase.create("hud", "M0,0 C0.16,1 0.3,1 1,1"); // cubic-bezier(0.16,1,0.3,1)
  CustomEase.create("expoOut", "M0,0 C0.19,1 0.22,1 1,1");

  // Lenis drives scroll position; let ScrollTrigger read transformed values.
  gsap.config({ nullTargetWarn: false });

  registered = true;
}

export { gsap, useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase };
