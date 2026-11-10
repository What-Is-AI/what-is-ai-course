import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Canonical paths are slash-free (`/lessons/8`, not `/lessons/8/`).
  trailingSlash: false,

  async redirects() {
    return [
      // Typo / alternate path → real lesson URLs
      {
        source: "/lesson/:id",
        destination: "/lessons/:id",
        permanent: true,
      },
      {
        source: "/lesson/:id/",
        destination: "/lessons/:id",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        // Sent on every admin response — visible even when HTML meta isn't parsed.
        // Complements robots.txt Disallow + layout `robots: noindex` (not a substitute).
        source: "/the-other-door/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
