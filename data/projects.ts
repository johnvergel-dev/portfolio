import type { Project } from "@/types";

/**
 * Project catalog — real work. `tags` drive loadout visibility; `byProfile`
 * orders `featured` first. `repo` cross-references live GitHub stats; `href`
 * points at the live site or repo.
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
    id: "threedii",
    name: "Threedii Paint Studio",
    desc: "Web platform for a Colombian studio that 3D-prints and hand-paints collectible figures: filterable bento catalog, WhatsApp quote flow, build-time responsive images and a strict CSP. Live in production.",
    tags: ["frontend"],
    stack: ["React 19", "Vite 8", "React Router", "Playwright", "Lighthouse CI", "Vercel"],
    href: "https://threedii-paint-studio.vercel.app",
    featured: true,
  },
  {
    id: "nutriline",
    name: "Nutriline Corp",
    desc: "Full-stack site + JWT-secured admin panel for a poultry-nutrition company: SSR product catalog with per-product pages, resources library and contact funnel. Cut mobile LCP from ~17s to ~2.9s.",
    tags: ["frontend", "backend"],
    stack: ["Next.js 14", "React", "Tailwind", "Sequelize/MySQL", "JWT", "zod"],
    href: "https://nutrilinecorp.com",
    featured: true,
  },
  {
    id: "mi-cocina",
    name: "Mi Cocina",
    desc: "Offline-first pantry, recipe, shopping and nutrition manager. No account, no server — all data on-device via IndexedDB. Ships as an Android APK and an installable PWA.",
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
  {
    id: "fleet-management",
    name: "Fleet Management Platform",
    desc: "Web app for managing a transport company's vehicle fleet — Spanish-localized, form-driven workflows. In development (private).",
    tags: ["frontend", "backend"],
    stack: ["Vue 3", "Vite"],
    featured: false,
  },
];
