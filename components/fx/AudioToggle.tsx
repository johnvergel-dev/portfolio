"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const KEY = "ophud:audio";

/**
 * Optional ambient UI sound (§9.11): subtle blips on hover of interactive
 * elements + a lower tone on loadout change. OFF by default, preference
 * persisted. Tone.js is imported lazily only when first enabled (kept out of
 * the initial bundle), and the audio context is unlocked by the toggle click.
 */
export function AudioToggle() {
  const [on, setOn] = useState(false);
  const disposeRef = useRef<(() => void) | null>(null);

  // Restore preference post-mount (avoids hydration mismatch).
  useEffect(() => {
    try {
      // One-time restore of a persisted UI preference after mount (must run
      // post-hydration to stay SSR-safe — can't be a lazy initializer).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem(KEY) === "1") setOn(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!on) {
      disposeRef.current?.();
      disposeRef.current = null;
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        const Tone = await import("tone");
        if (cancelled) return;
        await Tone.start();
        const vol = new Tone.Volume(-22).toDestination();
        const filter = new Tone.Filter(1300, "lowpass").connect(vol);
        const synth = new Tone.Synth({
          oscillator: { type: "triangle" },
          envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 },
        }).connect(filter);

        const blip = (f: number) => {
          try {
            synth.triggerAttackRelease(f, 0.04);
          } catch {
            /* context may be suspended until a gesture */
          }
        };

        let last = 0;
        const onOver = (e: PointerEvent) => {
          const t = e.target as HTMLElement | null;
          if (!t?.closest('a, button, [data-magnetic], [role="radio"]')) return;
          const now = performance.now();
          if (now - last < 90) return;
          last = now;
          blip(480 + Math.random() * 140);
        };
        const onRecon = () => blip(280);

        window.addEventListener("pointerover", onOver, { passive: true });
        window.addEventListener("loadout:reconfigure", onRecon);

        disposeRef.current = () => {
          window.removeEventListener("pointerover", onOver);
          window.removeEventListener("loadout:reconfigure", onRecon);
          synth.dispose();
          filter.dispose();
          vol.dispose();
        };
      } catch {
        /* Tone failed to load — silently keep audio off */
      }
    })();

    return () => {
      cancelled = true;
      disposeRef.current?.();
      disposeRef.current = null;
    };
  }, [on]);

  const toggle = () =>
    setOn((v) => {
      const next = !v;
      try {
        localStorage.setItem(KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Mute interface sounds" : "Enable interface sounds"}
      title={on ? "Sound on" : "Sound off"}
      className="text-[var(--muted)] transition-colors hover:text-[var(--a)]"
    >
      {on ? <Volume2 size={14} /> : <VolumeX size={14} />}
    </button>
  );
}
