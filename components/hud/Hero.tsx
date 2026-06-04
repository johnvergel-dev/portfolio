"use client";

import { useRef } from "react";
import { Mail, FileText, ArrowDown } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { siteConfig } from "@/data/site.config";
import { useProfile } from "@/components/providers/ProfileProvider";
import { Reveal } from "@/components/fx/Reveal";
import { HudButton } from "@/components/ui/HudButton";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";

/**
 * Hero / header. Renders the callsign, the active loadout's tagline and the
 * primary links. Structured so the pinned scale/blur ScrollTrigger (Phase 3)
 * can target `[data-hero]` (stage) and `[data-hero-content]` (the layer that
 * scales out).
 */
export function Hero() {
  const { profile } = useProfile();
  const githubUrl = `https://github.com/${siteConfig.githubUser}`;
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Pinned scale/blur signature (§9.3): scrub the content out over ~150vh.
  // Desktop + motion only; mobile and reduced-motion keep a normal hero.
  useGSAP(
    () => {
      registerGsap();
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.to(contentRef.current, {
            scale: 0.85,
            y: -40,
            autoAlpha: 0,
            filter: "blur(7px)",
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "+=150%",
              scrub: true,
              pin: true,
              pinSpacing: true,
            },
          });
        },
      );
      return () => mm.revert();
    },
    { scope: heroRef },
  );

  return (
    <section
      ref={heroRef}
      data-hero
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col justify-center px-5 pt-20 sm:px-8"
    >
      <div
        ref={contentRef}
        data-hero-content
        className="mx-auto w-full max-w-6xl will-change-transform"
      >
        <Reveal as="p" className="telemetry mb-5 text-[0.7rem] text-[var(--a)]">
          {`// OPERATOR PROFILE — ${profile.label}`}
        </Reveal>

        <Reveal
          as="h1"
          splitType="chars"
          className="display neon-text text-[clamp(2.75rem,11vw,8.5rem)] font-700 leading-[0.92]"
        >
          {siteConfig.callsign}
        </Reveal>

        <div className="mt-6 max-w-2xl">
          <Reveal
            as="p"
            className="display text-lg text-[var(--txt)] sm:text-2xl"
          >
            {siteConfig.title}
          </Reveal>
          <Reveal
            as="p"
            delay={0.05}
            className="mt-3 text-base leading-relaxed text-[var(--muted)] sm:text-lg"
          >
            {profile.tagline}
          </Reveal>
        </div>

        <Reveal
          staggerChildren
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <HudButton href={githubUrl} external icon={Github} variant="solid">
            GITHUB
          </HudButton>
          <HudButton href={siteConfig.linkedinUrl} external icon={Linkedin}>
            LINKEDIN
          </HudButton>
          {siteConfig.email ? (
            <HudButton href={`mailto:${siteConfig.email}`} icon={Mail}>
              CONTACT
            </HudButton>
          ) : null}
          {siteConfig.resumeUrl ? (
            <HudButton href={siteConfig.resumeUrl} external icon={FileText}>
              RESUME
            </HudButton>
          ) : null}
        </Reveal>

        <Reveal
          as="dl"
          delay={0.1}
          className="mt-12 flex flex-wrap gap-x-10 gap-y-3"
        >
          <div>
            <dt className="telemetry text-[0.58rem] text-[var(--muted)]">
              LOCATION
            </dt>
            <dd className="display text-sm text-[var(--txt)]">
              {siteConfig.location}
            </dd>
          </div>
          <div>
            <dt className="telemetry text-[0.58rem] text-[var(--muted)]">
              STATUS
            </dt>
            <dd className="display flex items-center gap-2 text-sm text-[var(--txt)]">
              <span className="live-dot" aria-hidden />
              OPEN TO WORK
            </dd>
          </div>
          <div>
            <dt className="telemetry text-[0.58rem] text-[var(--muted)]">
              CALLSIGN
            </dt>
            <dd className="display text-sm text-[var(--txt)]">
              @{siteConfig.githubUser}
            </dd>
          </div>
        </Reveal>
      </div>

      <a
        href="#github"
        aria-label="Scroll to content"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[var(--muted)] transition-colors hover:text-[var(--a)] sm:flex"
      >
        <span className="telemetry text-[0.58rem]">SCROLL</span>
        <ArrowDown size={16} className="animate-bounce" />
      </a>
    </section>
  );
}
