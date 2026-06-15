import type { Project } from "@/types";

/**
 * Project catalog — real projects. Each declares the loadouts it appears in via
 * `tags`; `byProfile` filters them and orders `featured` first. `repo` cross-
 * references live GitHub stats. Client work is shown anonymized and WITHOUT a
 * code link (proprietary).
 *
 * TODO: verify the inferred stacks on the client entries below.
 */
export const projects: Project[] = [
  {
    id: "operator-hud",
    name: "Operator HUD Portfolio",
    desc: "This site: a sci-fi HUD with GSAP scroll choreography, a reactive WebGL particle field, a URL-driven loadout system and a live GitHub feed.",
    tags: ["frontend"],
    stack: ["Next.js", "TypeScript", "GSAP", "react-three-fiber", "Tailwind", "Playwright"],
    href: "/",
    repo: "portfolio",
    featured: true,
  },
  {
    id: "mi-cocina",
    name: "Mi Cocina",
    desc: "Offline-first pantry, recipe, shopping and nutrition manager. No account, no server — all data lives on-device via IndexedDB. Ships as an Android APK and an installable PWA.",
    tags: ["frontend"],
    stack: ["Vue 3", "Vite", "Capacitor 8", "PWA", "Dexie/IndexedDB", "Pinia"],
    href: "https://github.com/johnvergel-dev/App-cocina",
    repo: "App-cocina",
    featured: true,
  },
  {
    id: "house-research",
    name: "House Research",
    desc: "Apartment-hunting research tool: a Python pipeline that scrapes listings across portals, then normalizes, filters and exports clean datasets.",
    tags: ["data", "backend"],
    stack: ["Python", "Web scraping", "Pandas", "CSV / ETL"],
    href: "https://github.com/johnvergel-dev/House-Research",
    repo: "House-Research",
    featured: true,
  },

  // ── Client work (proprietary — code private, shown anonymized) ──
  {
    id: "nutrition-brand-site",
    name: "Nutrition Brand Website",
    desc: "Production marketing site for a nutrition company — performance-tuned (caching, image/LCP optimization) with a maintainable content layer.",
    tags: ["frontend"],
    stack: ["Next.js", "React", "TypeScript"],
    featured: false,
  },
  {
    id: "industrial-services-site",
    name: "Industrial Services Corporate Site",
    desc: "Corporate website and contact funnel for an industrial-services company, delivered as a fast static build with a Next.js variant.",
    tags: ["frontend"],
    stack: ["Next.js", "HTML / CSS", "JavaScript"],
    featured: false,
  },
  {
    id: "fleet-management-app",
    name: "Fleet Management Platform",
    desc: "Web app for managing a transport company's vehicle fleet — Spanish-localized, form-driven workflows. (In development.)",
    tags: ["frontend", "backend"],
    stack: ["Vue 3", "Vite"],
    featured: false,
  },
  {
    id: "interactive-landing",
    name: "Interactive Brand Landing",
    desc: "Interactive landing / brand microsite built for a client proposal.",
    tags: ["frontend"],
    stack: ["JavaScript", "HTML / CSS"],
    featured: false,
  },
];
