import type { SiteConfig } from "@/types";

/**
 * Single source of truth for the author's identity and links.
 *
 * ▸ TO PERSONALISE THE SITE, EDIT ONLY THIS FILE (and the other `data/*` files).
 *   No component contains hardcoded personal content.
 *
 * The values below marked `PLACEHOLDER` are coherent stand-ins — replace them
 * with the real data. `githubUser` is already wired to the live GitHub module.
 */
export const siteConfig: SiteConfig = {
  // PLACEHOLDER (derived from your GitHub handle) — your name, shown as the
  // HUD callsign. Refine to your exact preferred display name.
  callsign: "JOHN VERGEL",
  // PLACEHOLDER — your professional title.
  title: "Software Engineer",
  // PLACEHOLDER — your location.
  location: "Remote · UTC−5",
  // Live GitHub handle powering the GITHUB.FEED module (verified to exist).
  githubUser: "johnvergel-dev",
  // PLACEHOLDER — your real LinkedIn profile URL.
  linkedinUrl: "https://www.linkedin.com/in/johnvergel",
  email: "jvergelc03@gmail.com",
  // PLACEHOLDER — optional résumé link (PDF in /public or external URL). Leave
  // undefined to hide the RESUME button.
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
