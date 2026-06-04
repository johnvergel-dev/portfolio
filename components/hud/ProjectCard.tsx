import { ArrowUpRight, Code2, Star } from "lucide-react";
import { Corners } from "@/components/hud/HudFrame";
import { Chip } from "@/components/ui/Chip";
import { siteConfig } from "@/data/site.config";
import type { Project } from "@/types";

/** A single project card. Tilt-ready (`data-tilt`); used by the grid and rail. */
export function ProjectCard({ project }: { project: Project }) {
  const repoUrl = project.repo
    ? `https://github.com/${siteConfig.githubUser}/${project.repo}`
    : undefined;

  return (
    <article
      data-tilt
      data-cursor={project.href ? "OPEN ↗" : undefined}
      className="glass group relative flex h-full flex-col p-5"
    >
      <Corners />
      <div data-tilt-layer className="flex h-full flex-col">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="display text-lg font-600 leading-tight text-[var(--txt)] transition-colors group-hover:text-[var(--a)]">
            {project.href ? (
              <a
                href={project.href}
                {...(project.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="after:absolute after:inset-0"
                aria-label={`${project.name} — open`}
              >
                {project.name}
              </a>
            ) : (
              project.name
            )}
          </h3>
          {project.featured ? (
            <span className="telemetry flex shrink-0 items-center gap-1 text-[0.55rem] text-[var(--signal)]">
              <Star size={11} /> FEATURED
            </span>
          ) : null}
        </div>

        <p className="mb-4 text-sm leading-relaxed text-[var(--muted)]">
          {project.desc}
        </p>

        <ul className="mb-4 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <li key={s}>
              <Chip>{s}</Chip>
            </li>
          ))}
        </ul>

        <div className="relative z-10 mt-auto flex items-center gap-4 pt-1">
          {project.href ? (
            <span className="telemetry inline-flex items-center gap-1 text-[0.62rem] text-[var(--a)]">
              OPEN <ArrowUpRight size={13} />
            </span>
          ) : null}
          {repoUrl ? (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="telemetry relative z-10 inline-flex items-center gap-1 text-[0.62rem] text-[var(--muted)] transition-colors hover:text-[var(--a)]"
            >
              <Code2 size={13} /> SOURCE
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
