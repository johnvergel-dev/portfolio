import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/data/site.config";
import { profiles, DEFAULT_PROFILE } from "@/data/profiles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...profiles
      .filter((p) => p.id !== DEFAULT_PROFILE)
      .map((p) => ({
        url: `${base}/?perfil=${p.id}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  ];
}
