import { ImageResponse } from "next/og";
import { resolveProfileId, getProfile } from "@/data/profiles";
import { siteConfig } from "@/data/site.config";

/**
 * Per-loadout Open Graph image (§13). Driven by `?perfil=` and wired through
 * `generateMetadata`, so each shared link (?perfil=data, etc.) unfurls with its
 * own callsign / role / accent in the HUD style.
 */
export const runtime = "nodejs";

const BG = "#04060a";
const TXT = "#cfe2ec";
const MUTED = "#6f8a96";

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const profile = getProfile(resolveProfileId(searchParams.get("perfil")));
  const a = profile.accent;

  const bracket = (pos: Record<string, number>, sides: string[]) => ({
    position: "absolute" as const,
    width: 48,
    height: 48,
    ...pos,
    ...Object.fromEntries(sides.map((s) => [s, `3px solid ${a}`])),
  });

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 70,
        backgroundColor: BG,
        color: TXT,
      }}
    >
      <div
        style={bracket({ top: 34, left: 34 }, ["borderTop", "borderLeft"])}
      />
      <div
        style={bracket({ top: 34, right: 34 }, ["borderTop", "borderRight"])}
      />
      <div
        style={bracket({ bottom: 34, left: 34 }, [
          "borderBottom",
          "borderLeft",
        ])}
      />
      <div
        style={bracket({ bottom: 34, right: 34 }, [
          "borderBottom",
          "borderRight",
        ])}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 12,
              backgroundColor: a,
            }}
          />
          <div style={{ fontSize: 24, letterSpacing: 6, color: MUTED }}>
            OPERATOR HUD
          </div>
        </div>
        <div style={{ fontSize: 24, letterSpacing: 6, color: a }}>
          {profile.label}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 30,
            letterSpacing: 8,
            color: MUTED,
            marginBottom: 12,
          }}
        >
          {"// " + siteConfig.title.toUpperCase()}
        </div>
        <div
          style={{
            fontSize: 132,
            fontWeight: 700,
            letterSpacing: 2,
            color: "#ffffff",
            lineHeight: 1,
          }}
        >
          {siteConfig.callsign}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginTop: 28,
          }}
        >
          <div style={{ width: 64, height: 4, backgroundColor: a }} />
          <div style={{ fontSize: 32, color: a }}>{profile.ogHeadline}</div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: 4,
          color: MUTED,
        }}
      >
        <div>{"@" + siteConfig.githubUser}</div>
        <div>{siteConfig.location}</div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400, immutable",
      },
    },
  );
}
