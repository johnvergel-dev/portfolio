"use client";

import { useRef } from "react";
import { skills } from "@/data/skills";
import { byProfile, groupBy } from "@/lib/filterByProfile";
import { useProfile } from "@/components/providers/ProfileProvider";
import { HudSection } from "@/components/hud/HudFrame";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Panel } from "@/components/ui/Panel";
import { MeterBar } from "@/components/ui/MeterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/fx/Reveal";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function SkillMatrix() {
  const { profileId } = useProfile();
  const groups = groupBy(byProfile(skills, profileId));
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Fill the telemetry bars (scaleX 0→1) as they scroll into view (§9.11).
  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reduced) return;
      registerGsap();
      const bars = root.querySelectorAll<HTMLElement>(".meter-fill");
      bars.forEach((bar) => {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "hud",
            scrollTrigger: { trigger: bar, start: "top 92%", once: true },
          },
        );
      });
      // useGSAP reverts these tweens + their ScrollTriggers automatically.
    },
    { scope: ref, dependencies: [reduced, profileId], revertOnUpdate: true },
  );

  return (
    <HudSection id="skills" aria-label="Skills" className="py-24">
      <SectionHeader index="03" title="SKILL.MATRIX" />
      {groups.length ? (
        <div ref={ref} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {groups.map((g, i) => (
            <Reveal key={g.group} delay={i * 0.03}>
              <Panel label={g.group} className="h-full p-6 pt-7">
                <div className="flex flex-col gap-5">
                  {g.items.map((s) => (
                    <MeterBar key={s.name} label={s.name} value={s.level} />
                  ))}
                </div>
              </Panel>
            </Reveal>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </HudSection>
  );
}
