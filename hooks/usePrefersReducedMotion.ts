"use client";

import { useMediaQuery } from "./useMediaQuery";

/**
 * `true` when the user has requested reduced motion. Every animation in the
 * project branches on this to either disable motion or fall back to a short
 * opacity fade. Defaults to `false` on the server.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}
