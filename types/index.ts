/**
 * Domain types for the Operator HUD portfolio.
 *
 * The entire content layer is typed and filterable by `ProfileId` via `tags`.
 * Presentation components never hold hardcoded content — they consume the
 * data exported from `data/*` (filtered through `lib/filterByProfile`).
 */

/** A "loadout" / recruiter profile. Extend the union to add a new loadout. */
export type ProfileId = "frontend" | "data" | "backend";

export interface Profile {
  id: ProfileId;
  /** Short uppercase label, e.g. "FRONTEND". */
  label: string;
  /** One-line positioning statement shown in the hero. */
  tagline: string;
  /** Hex color that retints the whole HUD (injected as the `--a` CSS var). */
  accent: string;
  /** Headline used by the dynamic Open Graph image. */
  ogHeadline: string;
  /** Sort order in the switcher. */
  order: number;
}

export interface Project {
  id: string;
  name: string;
  desc: string;
  /** Loadouts this project appears in. */
  tags: ProfileId[];
  stack: string[];
  /** Live demo / case-study URL. */
  href?: string;
  /** Optional GitHub repo name to cross-reference with live GitHub data. */
  repo?: string;
  /** Featured projects sort first and may render larger. */
  featured?: boolean;
}

export interface Skill {
  name: string;
  /** Proficiency 0–100, used by the animated bars. */
  level: number;
  tags: ProfileId[];
  /** Optional grouping label, e.g. "LANGUAGES". */
  group?: string;
}

export interface ExperienceItem {
  role: string;
  org: string;
  /** Free-form period, e.g. "2023 — Present". */
  period: string;
  bullets?: string[];
  tags: ProfileId[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  href?: string;
  tags: ProfileId[];
}

export interface SiteConfig {
  /** Author name rendered as the HUD "callsign". */
  callsign: string;
  title: string;
  location: string;
  githubUser: string;
  linkedinUrl: string;
  email?: string;
  resumeUrl?: string;
}

/** Anything filterable by loadout. */
export interface Taggable {
  tags: ProfileId[];
}
