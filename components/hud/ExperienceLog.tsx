"use client";

import { Linkedin } from "@/components/ui/BrandIcons";
import { experience } from "@/data/experience";
import { byProfile } from "@/lib/filterByProfile";
import { useProfile } from "@/components/providers/ProfileProvider";
import { siteConfig } from "@/data/site.config";
import { HudSection } from "@/components/hud/HudFrame";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HudButton } from "@/components/ui/HudButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/fx/Reveal";

export function ExperienceLog() {
  const { profileId } = useProfile();
  const items = byProfile(experience, profileId);

  return (
    <HudSection id="experience" aria-label="Experience" className="py-24">
      <SectionHeader
        index="04"
        title="EXPERIENCE.LOG"
        status={
          <HudButton href={siteConfig.linkedinUrl} external icon={Linkedin}>
            LINKEDIN
          </HudButton>
        }
      />

      {items.length ? (
        <Reveal
          as="ol"
          staggerChildren
          className="relative ml-2 border-l border-[var(--line)] pl-7"
        >
          {items.map((item, i) => (
            <li key={`${item.org}-${i}`} className="relative pb-10 last:pb-0">
              <span
                aria-hidden
                className="absolute -left-[34px] top-1.5 h-2.5 w-2.5 rounded-full border border-[var(--a)] bg-[var(--bg)] [box-shadow:0_0_12px_-2px_var(--glow)]"
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="display text-lg font-600 text-[var(--txt)]">
                  {item.role}
                  <span className="text-[var(--a)]"> @ </span>
                  {item.org}
                </h3>
                <span className="telemetry text-[0.62rem] text-[var(--muted)]">
                  {item.period}
                </span>
              </div>
              {item.bullets?.length ? (
                <ul className="mt-3 flex flex-col gap-2">
                  {item.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="flex gap-2 text-sm leading-relaxed text-[var(--muted)]"
                    >
                      <span className="mt-2 h-px w-3 shrink-0 bg-[var(--line-strong)]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </Reveal>
      ) : (
        <EmptyState />
      )}

      <p className="telemetry mt-8 max-w-2xl text-[0.58rem] leading-relaxed text-[var(--muted)]">
        {`// NOTE: LinkedIn exposes no free API for personal experience; this log is hand-maintained in data/experience.ts. Full history on LinkedIn.`}
      </p>
    </HudSection>
  );
}
