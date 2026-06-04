import type { Metadata } from "next";
import { PortfolioShell } from "@/components/PortfolioShell";
import { resolveProfileId, getProfile, DEFAULT_PROFILE } from "@/data/profiles";
import { siteConfig } from "@/data/site.config";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/**
 * Per-loadout metadata (§13): each `?perfil=` gets its own title, description,
 * canonical URL and (dynamic) OG image, so every shared link previews
 * differently. `searchParams` is available to `generateMetadata` in page
 * segments and is a Promise in Next 16 — hence the `await`.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const id = resolveProfileId((await searchParams).perfil);
  const profile = getProfile(id);
  const description = `${siteConfig.title} — ${profile.tagline}`;
  const ogImage = `/api/og?perfil=${id}`;
  const canonical = id === DEFAULT_PROFILE ? "/" : `/?perfil=${id}`;

  return {
    title: profile.ogHeadline,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${profile.ogHeadline} // ${siteConfig.callsign}`,
      description,
      url: canonical,
      images: [
        { url: ogImage, width: 1200, height: 630, alt: profile.ogHeadline },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: profile.ogHeadline,
      description,
      images: [ogImage],
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const initialProfile = resolveProfileId((await searchParams).perfil);
  return <PortfolioShell initialProfile={initialProfile} />;
}
