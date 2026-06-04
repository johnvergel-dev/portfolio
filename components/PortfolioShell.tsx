"use client";

import { ProfileProvider } from "@/components/providers/ProfileProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { BootSequence } from "@/components/fx/BootSequence";
import { Background } from "@/components/scene/Background";
import { Cursor } from "@/components/fx/Cursor";
import { InteractionFX } from "@/components/fx/InteractionFX";
import { ReconfigureFX } from "@/components/fx/ReconfigureFX";
import { HudChrome } from "@/components/hud/HudFrame";
import { TopBar } from "@/components/hud/TopBar";
import { Hero } from "@/components/hud/Hero";
import { GithubModule } from "@/components/hud/GithubModule";
import { ProjectsModule } from "@/components/hud/ProjectsModule";
import { SkillMatrix } from "@/components/hud/SkillMatrix";
import { ExperienceLog } from "@/components/hud/ExperienceLog";
import { CertificationsModule } from "@/components/hud/CertificationsModule";
import { Footer } from "@/components/hud/Footer";
import type { ProfileId } from "@/types";

/**
 * Client root. Holds the loadout context and composes the HUD. Heavier layers
 * are added by later phases: SmoothScrollProvider + boot (Phase 3), Cursor +
 * reconfiguration FX (Phase 4), WebGL Background (Phase 5).
 */
export function PortfolioShell({
  initialProfile,
}: {
  initialProfile: ProfileId;
}) {
  return (
    <ProfileProvider initialProfile={initialProfile}>
      <SmoothScrollProvider>
        <BootSequence />
        <Background />
        <Cursor />
        <InteractionFX />
        <ReconfigureFX />
        <HudChrome />
        <TopBar />
        <main id="main" className="relative z-10">
          <Hero />
          <GithubModule />
          <ProjectsModule />
          <SkillMatrix />
          <ExperienceLog />
          <CertificationsModule />
        </main>
        <Footer />
      </SmoothScrollProvider>
    </ProfileProvider>
  );
}
