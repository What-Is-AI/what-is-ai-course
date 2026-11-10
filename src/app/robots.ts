import type { MetadataRoute } from "next";
import { NON_PUBLIC_PATHS } from "@/lib/public-ia";
import { SITE_URL } from "@/lib/seo";

/**
 * Crawl policy (public course is open; admin / unpublished closed).
 *
 * /the-other-door/** uses BOTH robots Disallow and noindex/X-Robots-Tag —
 * they are not interchangeable (see the-other-door layout + next.config).
 *
 * OAI-SearchBot ≠ GPTBot — ChatGPT Search uses OAI-SearchBot.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = [...NON_PUBLIC_PATHS];

  return {
    rules: [
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
