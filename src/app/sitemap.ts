import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { COURSE_INDEX_KEYS } from "@/lib/seo-json-ld";

/**
 * Explicit public sitemap allowlist.
 *
 * Includes: home, about, /lessons index, numbered lessons 1–8,
 * indexable practice pages (working-with-llms, delegate-real-work,
 * just-because-it-can).
 *
 * Excludes: /the-other-door/** (admin/analytics), stubs
 * (when-it-goes-looking), and any temporary routes.
 *
 * Language note: en / es / lt are client-side UI locales (same URLs), not
 * separate paths. Sitemap lists one URL per page — matching alternates.canonical.
 * Do not invent /es/… or /en/… entries until URL-based i18n exists.
 * Submit this sitemap in Google Search Console after deploy.
 */
const HUB_ENTRIES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/lessons", priority: 0.9, changeFrequency: "weekly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const hubs: MetadataRoute.Sitemap = HUB_ENTRIES.map((entry) => ({
    url: absoluteUrl(entry.path),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const lessons: MetadataRoute.Sitemap = COURSE_INDEX_KEYS.map((key) => {
    const path = `/${key}`;
    return {
      url: absoluteUrl(path),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
  });

  return [...hubs, ...lessons];
}
