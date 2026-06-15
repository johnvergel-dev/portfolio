"use client";

import { Mail } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { siteConfig } from "@/data/site.config";
import { useProfile } from "@/components/providers/ProfileProvider";

export function Footer() {
  const { profile } = useProfile();
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-[var(--line)] px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="display text-sm text-[var(--txt)]">
            {siteConfig.callsign}
          </span>
          <span className="telemetry text-[0.58rem] text-[var(--muted)]">
            LOADOUT: {profile.label} · © {year}
          </span>
        </div>

        <nav aria-label="Social links" className="flex items-center gap-4">
          <a
            href={`https://github.com/${siteConfig.githubUser}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-[var(--muted)] transition-colors hover:text-[var(--a)]"
          >
            <Github size={18} />
          </a>
          {siteConfig.linkedinUrl ? (
            <a
              href={siteConfig.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[var(--muted)] transition-colors hover:text-[var(--a)]"
            >
              <Linkedin size={18} />
            </a>
          ) : null}
          {siteConfig.email ? (
            <a
              href={`mailto:${siteConfig.email}`}
              aria-label="Email"
              className="text-[var(--muted)] transition-colors hover:text-[var(--a)]"
            >
              <Mail size={18} />
            </a>
          ) : null}
        </nav>
      </div>
      <p className="telemetry mt-6 text-center text-[0.54rem] text-[var(--muted)]">
        OPERATOR HUD // BUILT WITH NEXT.JS · GSAP · REACT-THREE-FIBER
      </p>
    </footer>
  );
}
