/**
 * Named easing constants shared across the animation system.
 *
 * The `hud` and `expoOut` names refer to `CustomEase` curves registered once,
 * client-side, in `lib/gsap.ts`. The others are GSAP built-ins. Centralising
 * them keeps the motion language consistent and tweakable in one place.
 */
export const EASE = {
  /** Signature reveal curve — cubic-bezier(0.16, 1, 0.3, 1). */
  hud: "hud",
  /** Strong decelerate, for wipes and large moves. */
  expoOut: "expoOut",
  /** General-purpose ease-out. */
  smooth: "power3.out",
  /** Snappy in/out for state changes. */
  inOut: "power2.inOut",
} as const;

/** Cubic-bezier control points for the `hud` curve, reused in CSS transitions. */
export const HUD_CUBIC_BEZIER = "cubic-bezier(0.16, 1, 0.3, 1)";

export type EaseName = (typeof EASE)[keyof typeof EASE];
