import type { ExperienceItem } from "@/types";

/**
 * EXPERIENCE.LOG — hand-maintained career history.
 *
 * Why hand-maintained: LinkedIn has **no free API** to read a personal
 * profile's experience/education, and scraping it violates ToS. So we keep
 * experience here (typed + filterable) and link out via `siteConfig.linkedinUrl`.
 *
 * ⚠️ These entries are built from known, real work but still need YOUR review
 *    before deploying:
 *      • add your university name (marked TODO below)
 *      • confirm the freelance start date
 *      • add any internships / jobs not captured here
 */
export const experience: ExperienceItem[] = [
  {
    role: "Freelance Full-Stack Developer",
    org: "Independent · Colombia (remote)",
    period: "2024 — Present", // TODO: confirm your real start date
    tags: ["frontend", "backend"],
    bullets: [
      "Built and shipped production websites and web apps for businesses across the nutrition, industrial-services and transport sectors.",
      "Delivered performance-tuned Next.js sites and a Vue 3 fleet-management app, owning each project end-to-end from design to deploy.",
      "Worked directly with clients to turn requirements into maintainable, typed codebases.",
    ],
  },
  {
    role: "B.Sc. Computer Science (in progress)",
    org: "TODO: add your university", // ← replace before deploying
    period: "Expected 2026",
    tags: ["frontend", "data", "backend"],
    bullets: [
      "Computer Science undergraduate focused on full-stack web, applied ML/AI and automation.",
      "Self-directed builds: an offline-first mobile app (Capacitor/PWA), a WebGL portfolio, and a Python data pipeline.",
    ],
  },
];
