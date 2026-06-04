"use client";

import { useRef } from "react";
import { profilesOrdered } from "@/data/profiles";
import { useProfile } from "@/components/providers/ProfileProvider";
import type { ProfileId } from "@/types";

/**
 * Loadout selector (§7). Implemented as an ARIA radiogroup with roving
 * tabindex + arrow-key navigation. Selecting a loadout updates the URL
 * (?perfil=), retints the HUD and re-filters every module.
 */
export function LoadoutSwitcher({ className = "" }: { className?: string }) {
  const { profileId, setProfile } = useProfile();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (dir: 1 | -1) => {
    const idx = profilesOrdered.findIndex((p) => p.id === profileId);
    const next = (idx + dir + profilesOrdered.length) % profilesOrdered.length;
    const id = profilesOrdered[next].id;
    setProfile(id);
    refs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Loadout — curated view per role"
      onKeyDown={onKeyDown}
      className={`flex items-center gap-1 rounded-[2px] border border-[var(--line)] bg-black/30 p-1 ${className}`}
    >
      {profilesOrdered.map((p, i) => {
        const active = p.id === profileId;
        return (
          <button
            key={p.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            data-magnetic
            onClick={() => setProfile(p.id as ProfileId)}
            className={`telemetry relative rounded-[1px] px-3 py-1.5 text-[0.62rem] transition-colors duration-300 ${
              active
                ? "text-[var(--a)]"
                : "text-[var(--muted)] hover:text-[var(--txt)]"
            }`}
          >
            {active ? (
              <span
                aria-hidden
                className="absolute inset-0 rounded-[1px] border border-[var(--line-strong)] bg-[color-mix(in_srgb,var(--a)_14%,transparent)] [box-shadow:0_0_18px_-6px_var(--glow)]"
              />
            ) : null}
            <span className="relative flex items-center gap-1.5">
              <span
                className={`h-1 w-1 rounded-full ${active ? "bg-[var(--a)]" : "bg-[var(--muted)]"}`}
              />
              {p.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
