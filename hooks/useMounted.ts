"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns `false` during SSR and the first (hydration) render, then `true`.
 * Uses `useSyncExternalStore` so it never triggers a setState-in-effect and
 * never causes a hydration mismatch — the idiomatic way to defer client-only
 * work (e.g. mounting WebGL) until after hydration.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
