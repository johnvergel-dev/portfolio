import type { Skill } from "@/types";

/**
 * Skill matrix. `level` (0–100) drives the bars; `group` clusters; `tags`
 * controls loadout visibility. Self-assessed and deliberately honest — still
 * learning, strongest in what I actually ship with. Soft strengths included.
 */
export const skills: Skill[] = [
  // Languages
  { name: "JavaScript", level: 72, group: "LANGUAGES", tags: ["frontend", "backend"] },
  { name: "TypeScript", level: 66, group: "LANGUAGES", tags: ["frontend", "backend"] },
  { name: "Python", level: 64, group: "LANGUAGES", tags: ["data", "backend"] },
  { name: "SQL", level: 55, group: "LANGUAGES", tags: ["data", "backend"] },

  // Frontend
  { name: "Vue 3", level: 72, group: "FRONTEND", tags: ["frontend"] },
  { name: "React / Next.js", level: 66, group: "FRONTEND", tags: ["frontend"] },
  { name: "HTML / CSS", level: 75, group: "FRONTEND", tags: ["frontend"] },
  { name: "Tailwind CSS", level: 70, group: "FRONTEND", tags: ["frontend"] },
  { name: "GSAP / Motion", level: 52, group: "FRONTEND", tags: ["frontend"] },

  // Mobile / PWA
  { name: "Capacitor / PWA", level: 70, group: "MOBILE", tags: ["frontend"] },
  { name: "IndexedDB / Dexie", level: 62, group: "MOBILE", tags: ["frontend"] },

  // Backend
  { name: "Node.js / Express", level: 58, group: "BACKEND", tags: ["backend"] },
  { name: "REST APIs", level: 60, group: "BACKEND", tags: ["backend"] },
  { name: "MySQL / PostgreSQL", level: 54, group: "BACKEND", tags: ["backend", "data"] },
  { name: "Git / CI", level: 68, group: "BACKEND", tags: ["backend", "frontend"] },

  // Data / Automation
  { name: "Web Scraping / ETL", level: 66, group: "DATA · ML", tags: ["data", "backend"] },
  { name: "Pandas / NumPy", level: 56, group: "DATA · ML", tags: ["data"] },
  { name: "PyTorch (learning)", level: 38, group: "DATA · ML", tags: ["data"] },
  { name: "n8n / Automation", level: 52, group: "DATA · ML", tags: ["backend", "data"] },

  // Strengths (soft skills)
  { name: "Leadership", level: 82, group: "STRENGTHS", tags: ["frontend", "data", "backend"] },
  { name: "Communication", level: 84, group: "STRENGTHS", tags: ["frontend", "data", "backend"] },
  { name: "Teamwork", level: 85, group: "STRENGTHS", tags: ["frontend", "data", "backend"] },
  { name: "Fast learner", level: 88, group: "STRENGTHS", tags: ["frontend", "data", "backend"] },
];
