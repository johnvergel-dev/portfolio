import type { Skill } from "@/types";

/**
 * Skill matrix. `level` (0–100) drives the animated telemetry bars; `group`
 * clusters related skills; `tags` controls which loadouts surface the skill.
 *
 * Levels are self-assessed and calibrated to real project work — tweak freely.
 */
export const skills: Skill[] = [
  // Languages
  { name: "TypeScript", level: 85, group: "LANGUAGES", tags: ["frontend", "backend"] },
  { name: "JavaScript", level: 88, group: "LANGUAGES", tags: ["frontend", "backend"] },
  { name: "Python", level: 80, group: "LANGUAGES", tags: ["data", "backend"] },
  { name: "SQL", level: 70, group: "LANGUAGES", tags: ["data", "backend"] },

  // Frontend
  { name: "Vue 3", level: 88, group: "FRONTEND", tags: ["frontend"] },
  { name: "React / Next.js", level: 84, group: "FRONTEND", tags: ["frontend"] },
  { name: "Tailwind CSS", level: 85, group: "FRONTEND", tags: ["frontend"] },
  { name: "GSAP / Motion", level: 72, group: "FRONTEND", tags: ["frontend"] },
  { name: "WebGL / Three.js", level: 58, group: "FRONTEND", tags: ["frontend"] },

  // Mobile / PWA
  { name: "Capacitor / PWA", level: 82, group: "MOBILE", tags: ["frontend"] },
  { name: "IndexedDB / Dexie", level: 75, group: "MOBILE", tags: ["frontend"] },

  // Backend
  { name: "Node.js / Express", level: 74, group: "BACKEND", tags: ["backend"] },
  { name: "REST APIs", level: 76, group: "BACKEND", tags: ["backend"] },
  { name: "PostgreSQL", level: 66, group: "BACKEND", tags: ["backend", "data"] },
  { name: "Git / CI", level: 80, group: "BACKEND", tags: ["backend", "frontend"] },

  // Data / ML
  { name: "Pandas / NumPy", level: 70, group: "DATA · ML", tags: ["data"] },
  { name: "PyTorch", level: 55, group: "DATA · ML", tags: ["data"] },
  { name: "HuggingFace / NLP", level: 55, group: "DATA · ML", tags: ["data"] },

  // Automation
  { name: "n8n / Automation", level: 68, group: "AUTOMATION", tags: ["backend", "data"] },
  { name: "Web Scraping", level: 78, group: "AUTOMATION", tags: ["data", "backend"] },
];
