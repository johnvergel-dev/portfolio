"use client";

import { projects } from "@/data/projects";
import { byProfile } from "@/lib/filterByProfile";
import { useProfile } from "@/components/providers/ProfileProvider";
import { HudSection } from "@/components/hud/HudFrame";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/fx/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectCard } from "@/components/hud/ProjectCard";
import { FeaturedRail } from "@/components/hud/FeaturedRail";

export function ProjectsModule() {
  const { profileId } = useProfile();
  const items = byProfile(projects, profileId);
  const featured = items.filter((p) => p.featured);
  const rest = items.filter((p) => !p.featured);

  return (
    <HudSection id="projects" aria-label="Projects" className="py-24">
      <SectionHeader
        index="02"
        title="PROJECTS // DEPLOYMENTS"
        status={
          <span className="telemetry text-[0.62rem] text-[var(--muted)]">
            {items.length.toString().padStart(2, "0")} UNITS
          </span>
        }
      />

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-12">
          {featured.length ? (
            <div>
              <p className="telemetry mb-4 flex items-center gap-2 text-[0.6rem] text-[var(--a)]">
                {"// FEATURED"}
                <span className="hidden text-[var(--muted)] lg:inline">
                  {"— SCROLL →"}
                </span>
              </p>
              <FeaturedRail items={featured} />
            </div>
          ) : null}

          {rest.length ? (
            <Reveal
              staggerChildren
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {rest.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </Reveal>
          ) : null}
        </div>
      )}
    </HudSection>
  );
}
