import type { Metadata, Viewport } from "next";
import { Chakra_Petch, JetBrains_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { siteConfig, getSiteUrl } from "@/data/site.config";
import "./globals.css";

// Display: angular technical face (§3). Chakra Petch is not a variable font,
// so explicit weights are required.
const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra",
  display: "swap",
});

// Telemetry: monospace.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.callsign} // ${siteConfig.title}`,
    template: `%s // ${siteConfig.callsign}`,
  },
  description:
    "Operator HUD — an interactive sci-fi portfolio with live GitHub telemetry and recruiter-specific loadouts.",
  applicationName: "Operator HUD",
  authors: [{ name: siteConfig.callsign }],
  creator: siteConfig.callsign,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: `${siteConfig.callsign} // Operator HUD`,
    url: siteUrl,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#04060a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

// Structured data (§13) — profile-agnostic Person with social profiles.
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.callsign,
  url: siteUrl,
  jobTitle: siteConfig.title,
  ...(siteConfig.email ? { email: `mailto:${siteConfig.email}` } : {}),
  sameAs: [
    `https://github.com/${siteConfig.githubUser}`,
    ...(siteConfig.linkedinUrl ? [siteConfig.linkedinUrl] : []),
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${chakra.variable} ${jetbrains.variable} antialiased`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
