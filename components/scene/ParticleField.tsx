"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const VERT = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform float uPixelRatio;
  uniform float uPulse;
  attribute float aScale;
  attribute float aSpeed;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.2 + p.x * 0.5) * 0.18;
    p.x += cos(uTime * 0.15 + p.z * 0.4) * 0.18;
    // scroll drifts the field back and down
    p.z += uScroll * 7.0;
    p.y -= uScroll * 2.5;
    // mouse parallax (closer particles move more)
    p.xy += uMouse * (0.35 + aScale * 0.8);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = aScale * (58.0 + uPulse * 46.0) * uPixelRatio;
    gl_PointSize = size / max(-mv.z, 0.1);
    vAlpha = smoothstep(0.0, 1.0, aScale) * (0.45 + 0.55 * sin(uTime * aSpeed + aScale * 10.0));
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPulse;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * vAlpha * (0.6 + uPulse * 0.6);
    gl_FragColor = vec4(uColor, a);
  }
`;

/** Deterministic PRNG — avoids Math.random's "impure during render" lint and
 * keeps the field stable across re-renders. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Instanced-ish point field reacting to (a) mouse, (b) scroll progress and
 * (c) the loadout accent. Listens for `loadout:reconfigure` to fire a brief
 * brightness/size pulse. Cheap: one draw call, additive blending, no depth.
 */
export function ParticleField({
  accent,
  count = 4000,
}: {
  accent: string;
  count?: number;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const mouseTarget = useRef(new THREE.Vector2(0, 0));
  const pulse = useRef(0);
  const colorCurrent = useRef(new THREE.Color(accent));
  const colorTarget = useRef(new THREE.Color(accent));

  const { positions, scales, speeds } = useMemo(() => {
    const rand = mulberry32(0x9e3779b9 ^ count);
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 16;
      positions[i * 3 + 1] = (rand() - 0.5) * 12;
      positions[i * 3 + 2] = (rand() - 0.5) * 10 - 2;
      scales[i] = rand() * 0.9 + 0.1;
      speeds[i] = rand() * 1.5 + 0.3;
    }
    return { positions, scales, speeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uPixelRatio: { value: 1 },
      uPulse: { value: 0 },
      uColor: { value: new THREE.Color(accent) },
    }),
    // accent intentionally excluded; updated via lerp in useFrame
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    colorTarget.current.set(accent);
  }, [accent]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouseTarget.current.set(
        (e.clientX / window.innerWidth - 0.5) * 2,
        -(e.clientY / window.innerHeight - 0.5) * 2,
      );
    };
    const onPulse = () => {
      pulse.current = 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("loadout:reconfigure", onPulse);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("loadout:reconfigure", onPulse);
    };
  }, []);

  useFrame((state, delta) => {
    const mat = matRef.current;
    if (!mat) return;
    const u = mat.uniforms;
    u.uTime.value += delta;
    u.uPixelRatio.value = state.gl.getPixelRatio();

    mouse.current.lerp(mouseTarget.current, 0.05);
    (u.uMouse.value as THREE.Vector2).copy(mouse.current);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    u.uScroll.value = max > 0 ? window.scrollY / max : 0;

    pulse.current = THREE.MathUtils.damp(pulse.current, 0, 3, delta);
    u.uPulse.value = pulse.current;

    colorCurrent.current.lerp(colorTarget.current, 0.06);
    (u.uColor.value as THREE.Color).copy(colorCurrent.current);
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
