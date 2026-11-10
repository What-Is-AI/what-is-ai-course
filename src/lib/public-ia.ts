/**
 * Public site information architecture (crawlable + linked).
 *
 * Home
 * ├── About
 * ├── Lessons (/lessons)
 * │    └── VISIBLE_LESSONS only (numbered + published practice)
 * └── (never admin / analytics / drafts)
 *
 * Source of truth for nav/home/index: `VISIBLE_LESSONS` in `@/lib/lessons`.
 */

/** Paths that exist but must not appear in the public link/crawl graph. */
export const NON_PUBLIC_PATHS = [
  "/the-other-door/",
  "/lessons/when-it-goes-looking",
] as const;
