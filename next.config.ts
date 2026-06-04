import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // GitHub avatars (used by the live GITHUB.FEED module).
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "*.githubusercontent.com" },
    ],
  },
  // three.js ships untranspiled modern syntax; keep transpilation explicit.
  transpilePackages: ["three"],
};

export default nextConfig;
