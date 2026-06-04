"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { useProfile } from "@/components/providers/ProfileProvider";
import { ProjectCard } from "@/components/hud/ProjectCard";
import type { Project } from "@/types";

/**
 * Featured projects rail (§9.10). Defaults to a safe vertical stack (mobile and
 * reduced motion). On desktop with motion enabled it switches to a pinned
 * horizontal scrub: JS sets `data-rail="on"`, which a CSS rule turns into a
 * horizontal track, and the track scrubs along `x`. Re-initializes per loadout.
 */
export function FeaturedRail({ items }: { items: Project[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { profileId } = useProfile();

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      registerGsap();

      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          section.dataset.rail = "on";
          const distance = () =>
            Math.max(0, track.scrollWidth - section.clientWidth);
          const tween = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + distance(),
              scrub: true,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          return () => {
            section.dataset.rail = "off";
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        },
      );
      return () => mm.revert();
    },
    // revertOnUpdate so a loadout switch tears down the old pin/ScrollTrigger.
    {
      scope: sectionRef,
      dependencies: [profileId, items.length],
      revertOnUpdate: true,
    },
  );

  return (
    <div ref={sectionRef} data-rail="off" className="relative overflow-hidden">
      <div ref={trackRef} className="rail-track flex flex-col gap-4">
        {items.map((p) => (
          <div key={p.id} className="rail-item">
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
