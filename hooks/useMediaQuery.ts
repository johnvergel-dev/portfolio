"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe media query hook built on `useSyncExternalStore` so the value is
 * correct on the client immediately after hydration (no flash, no mismatch).
 * On the server it returns `serverValue`.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  function subscribe(callback: () => void): () => void {
    if (typeof window === "undefined" || !window.matchMedia) return () => {};
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  }

  function getSnapshot(): boolean {
    if (typeof window === "undefined" || !window.matchMedia) return serverValue;
    return window.matchMedia(query).matches;
  }

  return useSyncExternalStore(subscribe, getSnapshot, () => serverValue);
}
