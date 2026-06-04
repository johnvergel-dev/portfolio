"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useProfile } from "@/components/providers/ProfileProvider";
import { usePointerFine } from "@/hooks/usePointerFine";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMounted } from "@/hooks/useMounted";
import { StarfieldFallback } from "./StarfieldFallback";

// three.js is code-split and only loaded client-side when actually used.
const ParticleScene = dynamic(() => import("./ParticleScene"), { ssr: false });

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Fixed background layer (§9.12). Renders the reactive WebGL particle field on
 * capable, fine-pointer, motion-enabled clients; otherwise a 2D starfield
 * fallback. Always paints an accent-tinted gradient (which also retints with
 * the loadout). Heavy work is deferred until after mount to avoid hydration
 * mismatch and keep three.js out of the critical path.
 */
export function Background() {
  const { profile } = useProfile();
  const fine = usePointerFine();
  const reduced = usePrefersReducedMotion();
  const mounted = useMounted();

  const canWebgl = useMemo(
    () => (typeof window !== "undefined" ? webglAvailable() : false),
    [],
  );
  const useScene = mounted && fine && !reduced && canWebgl;

  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, color-mix(in srgb, var(--a) 9%, transparent), transparent 60%), radial-gradient(80% 60% at 80% 110%, color-mix(in srgb, var(--a) 7%, transparent), transparent 55%)",
        }}
      />
      {useScene ? (
        <ParticleScene accent={profile.accent} />
      ) : mounted ? (
        <StarfieldFallback accent={profile.accent} reduced={reduced} />
      ) : null}
    </div>
  );
}
