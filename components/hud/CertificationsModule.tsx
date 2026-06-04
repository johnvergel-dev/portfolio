"use client";

import { Lock, BadgeCheck, ArrowUpRight } from "lucide-react";
import { certifications } from "@/data/certifications";
import { byProfile } from "@/lib/filterByProfile";
import { useProfile } from "@/components/providers/ProfileProvider";
import { HudSection } from "@/components/hud/HudFrame";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Panel } from "@/components/ui/Panel";
import { Corners } from "@/components/hud/HudFrame";
import { Reveal } from "@/components/fx/Reveal";

/**
 * Certifications. v1 ships with an empty data set, so this renders a "MODULE
 * LOCKED" stub. Populate `data/certifications.ts` to activate it — no code
 * changes required (§17).
 */
export function CertificationsModule() {
  const { profileId } = useProfile();
  const items = byProfile(certifications, profileId);
  const locked = items.length === 0;

  return (
    <HudSection
      id="certifications"
      aria-label="Certifications"
      className="py-24"
    >
      <SectionHeader index="05" title="CERTIFICATIONS" />

      {locked ? (
        <Reveal>
          <div className="glass relative flex flex-col items-center gap-3 px-6 py-16 text-center">
            <Corners />
            <Lock size={22} className="text-[var(--muted)]" />
            <p className="telemetry text-[var(--a)]">MODULE LOCKED</p>
            <p className="telemetry max-w-md text-[0.6rem] leading-relaxed text-[var(--muted)]">
              No credentials registered for this loadout yet. This module
              activates automatically once entries are added to the data layer.
            </p>
          </div>
        </Reveal>
      ) : (
        <Reveal
          staggerChildren
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {items.map((c) => (
            <Panel
              key={`${c.name}-${c.year}`}
              className="flex items-start gap-4 p-5"
            >
              <BadgeCheck
                size={20}
                className="mt-0.5 shrink-0 text-[var(--a)]"
              />
              <div className="flex flex-col">
                <h3 className="display text-base font-600 text-[var(--txt)]">
                  {c.href ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-[var(--a)]"
                    >
                      {c.name} <ArrowUpRight size={13} />
                    </a>
                  ) : (
                    c.name
                  )}
                </h3>
                <p className="telemetry mt-1 text-[0.6rem] text-[var(--muted)]">
                  {c.issuer} · {c.year}
                </p>
              </div>
            </Panel>
          ))}
        </Reveal>
      )}
    </HudSection>
  );
}
