import type { ExperienceItem } from "@/types";

/**
 * EXPERIENCE.LOG — hand-maintained (LinkedIn has no free read API).
 *
 * ⚠️ TODO before deploying: fill the cultural-exchange org/role/dates (marked
 *    below) and confirm the freelance start date.
 */
export const experience: ExperienceItem[] = [
  {
    role: "Freelance Full-Stack Developer",
    org: "Independent · Colombia (remote)",
    period: "2025 — Present", // TODO: confirm your real start date
    tags: ["frontend", "backend"],
    bullets: [
      "Built and shipped production web apps for real clients: Threedii Paint Studio (React 19 + Vite SPA, catalog + WhatsApp quote flow) and Nutriline Corp (Next.js 14 site + JWT-secured admin panel over MySQL).",
      "Cut Nutriline's mobile LCP from ~17s to ~2.9s and page weight from 4.4MB to ~0.5MB via SSR, a sharp image pipeline and low-cost animations.",
      "Worked directly with business owners — turning requirements into maintainable, typed codebases, and handling deploys, security headers and SEO.",
    ],
  },
  {
    role: "B.Sc. Computer Science (in progress)",
    org: "Universidad Santo Tomás",
    period: "Expected 2026",
    tags: ["frontend", "data", "backend"],
    bullets: [
      "Computer Science undergraduate focused on full-stack web, applied ML/AI and automation.",
      "Self-directed builds: an offline-first mobile app (Capacitor/PWA), a WebGL portfolio, and a Python data pipeline.",
    ],
  },
  {
    role: "Team Member", // TODO: your exact role
    org: "Cultural Exchange Program", // TODO: program / organization name
    period: "Present", // TODO: dates
    tags: ["frontend", "data", "backend"],
    bullets: [
      "Lead and collaborate within a multicultural team — communication, organization and reliability in a non-technical setting.",
      "Strengths I carry into engineering: leadership, a friendly and committed attitude, and a fast, eager-to-learn mindset.",
    ],
  },
];
