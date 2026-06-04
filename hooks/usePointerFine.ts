"use client";

import { useMediaQuery } from "./useMediaQuery";

/**
 * `true` on devices with a fine, hovering pointer (a real mouse/trackpad).
 * Used to gate the custom cursor, 3D tilt and magnetic effects so touch
 * devices never pay for interactions they cannot use. Defaults to `false` on
 * the server (touch-first, progressive enhancement).
 */
export function usePointerFine(): boolean {
  return useMediaQuery("(pointer: fine) and (hover: hover)", false);
}
