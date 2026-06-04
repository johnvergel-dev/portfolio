import type { Profile, ProfileId } from "@/types";

/**
 * Loadout definitions. The HUD reconfigures itself per profile: the `accent`
 * retints every neon/border/particle, and content is filtered by `tags`.
 *
 * To add a loadout: add its id to `ProfileId` in `types/index.ts`, append an
 * entry here, then tag projects/skills/experience with the new id. No other
 * code changes are required.
 */
export const profiles: Profile[] = [
  {
    id: "frontend",
    label: "FRONTEND",
    tagline: "Interfaces that feel alive — motion, depth and sub-16ms frames.",
    accent: "#36e6ff",
    ogHeadline: "Frontend Engineer · Motion & Interaction",
    order: 1,
  },
  {
    id: "data",
    label: "DATA · ML",
    tagline: "Turning raw signal into decisions — pipelines, models, insight.",
    accent: "#c084fc",
    ogHeadline: "Data / ML Engineer · Pipelines & Models",
    order: 2,
  },
  {
    id: "backend",
    label: "BACKEND",
    tagline: "Systems that hold under load — APIs, data, reliability.",
    accent: "#34e5a4",
    ogHeadline: "Backend Engineer · APIs & Systems",
    order: 3,
  },
];

/** Default loadout used when no (or an invalid) `?perfil` is present. */
export const DEFAULT_PROFILE: ProfileId = "frontend";

const profileMap = new Map<ProfileId, Profile>(profiles.map((p) => [p.id, p]));

/** Type guard: is the string a valid ProfileId? */
export function isProfileId(value: unknown): value is ProfileId {
  return typeof value === "string" && profileMap.has(value as ProfileId);
}

/** Resolve a raw search-param value to a valid ProfileId (with default). */
export function resolveProfileId(value: unknown): ProfileId {
  if (Array.isArray(value)) value = value[0];
  return isProfileId(value) ? value : DEFAULT_PROFILE;
}

/** Get the full Profile object for an id. */
export function getProfile(id: ProfileId): Profile {
  return profileMap.get(id) ?? profiles[0];
}

export const profilesOrdered = [...profiles].sort((a, b) => a.order - b.order);
