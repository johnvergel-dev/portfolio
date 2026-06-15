import type { SiteConfig } from "@/types";

/**
 * Single source of truth for the author's identity and links.
 *
 * ▸ TO PERSONALISE THE SITE, EDIT ONLY THIS FILE (and the other `data/*` files).
 *   No component contains hardcoded personal content.
 */
export const siteConfig: SiteConfig = {
  // Name shown as the HUD callsign.
  callsign: "JOHN VERGEL",
  // Professional title / tagline.
  title: "Full-Stack Developer · ML/AI & Automation",
  // Location.
  location: "Colombia · Remote-ready",
  // Live GitHub handle powering the GITHUB.FEED module.
  githubUser: "johnvergel-dev",
  // No LinkedIn yet — left empty; the LinkedIn buttons auto-hide when this is "".
  linkedinUrl: "",
  email: "jvergelc03@gmail.com",
  // Optional résumé link (PDF in /public or external URL). Leave undefined to
  // hide the RESUME button.
  resumeUrl: undefined,
};

/**
 * Absolute site URL used for canonical links, sitemap and Open Graph.
 * Falls back to the Vercel-provided URL, then localhost in dev.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
