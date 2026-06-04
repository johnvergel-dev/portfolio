import type { Skill } from "@/types";

/**
 * Skill matrix. `level` (0–100) drives the animated telemetry bars; `group`
 * clusters related skills; `tags` controls which loadouts surface the skill.
 *
 * PLACEHOLDER values — calibrate to your real proficiencies.
 */
export const skills: Skill[] = [
  // Languages
  {
    name: "TypeScript",
    level: 95,
    group: "LANGUAGES",
    tags: ["frontend", "backend"],
  },
  {
    name: "JavaScript",
    level: 95,
    group: "LANGUAGES",
    tags: ["frontend", "backend"],
  },
  { name: "Python", level: 90, group: "LANGUAGES", tags: ["data", "backend"] },
  { name: "Go", level: 75, group: "LANGUAGES", tags: ["backend"] },
  { name: "SQL", level: 85, group: "LANGUAGES", tags: ["data", "backend"] },

  // Frontend
  { name: "React / Next.js", level: 95, group: "FRONTEND", tags: ["frontend"] },
  { name: "GSAP / Motion", level: 88, group: "FRONTEND", tags: ["frontend"] },
  {
    name: "WebGL / Three.js",
    level: 72,
    group: "FRONTEND",
    tags: ["frontend"],
  },
  { name: "CSS / Tailwind", level: 92, group: "FRONTEND", tags: ["frontend"] },
  {
    name: "Accessibility (a11y)",
    level: 85,
    group: "FRONTEND",
    tags: ["frontend"],
  },

  // Data / ML
  { name: "PyTorch", level: 82, group: "DATA · ML", tags: ["data"] },
  { name: "Pandas / NumPy", level: 90, group: "DATA · ML", tags: ["data"] },
  { name: "Airflow / ETL", level: 80, group: "DATA · ML", tags: ["data"] },
  {
    name: "Vector / Embeddings",
    level: 78,
    group: "DATA · ML",
    tags: ["data"],
  },
  {
    name: "Experiment Tracking",
    level: 75,
    group: "DATA · ML",
    tags: ["data"],
  },

  // Backend / Infra
  { name: "Node.js / APIs", level: 90, group: "BACKEND", tags: ["backend"] },
  {
    name: "PostgreSQL",
    level: 85,
    group: "BACKEND",
    tags: ["backend", "data"],
  },
  { name: "Docker / CI", level: 84, group: "BACKEND", tags: ["backend"] },
  { name: "Kafka / Queues", level: 76, group: "BACKEND", tags: ["backend"] },
  { name: "Observability", level: 80, group: "BACKEND", tags: ["backend"] },
];
