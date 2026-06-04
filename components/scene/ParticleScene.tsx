"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { ParticleField } from "./ParticleField";

/**
 * R3F canvas for the particle field. DPR is capped at 1.75 and the render loop
 * pauses when the tab is hidden (the canvas is fixed full-screen, so it is
 * always in-viewport). Default export so it can be `dynamic(ssr:false)`-loaded,
 * keeping three.js out of the initial bundle.
 */
export default function ParticleScene({ accent }: { accent: string }) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ParticleField accent={accent} />
      <EffectComposer>
        <Bloom
          intensity={0.7}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
