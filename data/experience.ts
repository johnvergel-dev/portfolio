import type { ExperienceItem } from "@/types";

/**
 * EXPERIENCE.LOG — hand-maintained career history.
 *
 * Why hand-maintained: LinkedIn has **no free API** to read a personal
 * profile's experience/education. The public tier only returns basic identity
 * via OAuth (OpenID Connect), and scraping LinkedIn violates its ToS and risks
 * bans. So we keep experience here (typed + filterable) and link out to the
 * real LinkedIn profile via `siteConfig.linkedinUrl`.
 *
 * PLACEHOLDER entries — replace with your real history. `tags` control which
 * loadouts surface each role.
 */
export const experience: ExperienceItem[] = [
  {
    role: "Senior Frontend Engineer",
    org: "Placeholder Labs",
    period: "2023 — Present",
    tags: ["frontend"],
    bullets: [
      "Led the motion + interaction layer of the flagship product, holding a 60fps budget on mid-tier mobile.",
      "Built a reusable animation system (GSAP + reduced-motion fallbacks) adopted across 4 teams.",
      "Cut Largest Contentful Paint by 38% through code-splitting and font/CLS work.",
    ],
  },
  {
    role: "Machine Learning Engineer",
    org: "Placeholder Data Co.",
    period: "2021 — 2023",
    tags: ["data"],
    bullets: [
      "Owned a feature store and training pipeline serving both batch and online inference.",
      "Shipped a drift-monitoring + alerting loop that reduced silent model degradation incidents.",
      "Partnered with product to translate ambiguous goals into measurable model objectives.",
    ],
  },
  {
    role: "Backend Engineer",
    org: "Placeholder Systems",
    period: "2019 — 2021",
    tags: ["backend"],
    bullets: [
      "Designed an event-sourced ledger with CQRS projections and idempotent, replayable consumers.",
      "Hardened the API gateway with rate limiting, request coalescing and OpenTelemetry tracing.",
      "Maintained 99.9% availability across a service handling millions of daily requests.",
    ],
  },
  {
    role: "Full-Stack Engineer",
    org: "Placeholder Studio",
    period: "2018 — 2019",
    tags: ["frontend", "backend"],
    bullets: [
      "Delivered end-to-end features from PostgreSQL schema to React UI for client products.",
      "Introduced typed API contracts that eliminated a class of integration bugs.",
    ],
  },
];
