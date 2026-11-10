import {
  PAGE_SEO,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  type SeoPageKey,
} from "@/lib/seo";

/**
 * Structured-data policy (keep lean):
 * - Use Organization, WebSite, Course / ItemList, BreadcrumbList, WebPage.
 * - Do NOT add FAQPage / Question schema on lessons or site-wide.
 *   Manufactured FAQ blocks are not worth the trust hit; natural questions
 *   belong in lesson pedagogy only when authors put them there — never via SEO.
 */

/** Course provider (organization offering the curriculum). */
export const COURSE_PROVIDER = {
  "@type": "Organization" as const,
  name: "Pro AI Assistant",
  url: "https://www.proaiassistant.com",
  sameAs: "https://www.proaiassistant.com",
};

/** Site organization — the What is AI project itself. */
export function organizationJsonLd() {
  return {
    "@type": "Organization" as const,
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    parentOrganization: COURSE_PROVIDER,
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite" as const,
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** Homepage only: Organization + WebSite (no schema scatter site-wide). */
export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(), websiteJsonLd()],
  };
}

/** Indexed lesson keys for the course list (excludes stubs / noindex). */
export const COURSE_INDEX_KEYS = [
  "lessons/1",
  "lessons/2",
  "lessons/3",
  "lessons/4",
  "lessons/5",
  "lessons/6",
  "lessons/7",
  "lessons/8",
  "lessons/working-with-llms",
  "lessons/delegate-real-work",
  "lessons/just-because-it-can",
] as const satisfies readonly SeoPageKey[];

export type CourseIndexKey = (typeof COURSE_INDEX_KEYS)[number];

/**
 * Google Course rich results: description display limit ~60 characters.
 * Keep these short; page meta descriptions can stay longer.
 */
const COURSE_SCHEMA_DESCRIPTION: Record<CourseIndexKey, string> = {
  "lessons/1": "Interactive intro to what counts as AI.",
  "lessons/2": "Why hard-coded rules fail for real AI.",
  "lessons/3": "How data unlocked modern AI progress.",
  "lessons/4": "How a machine learns from data.",
  "lessons/5": "Neural nets, weights, layers, patterns.",
  "lessons/6": "Deep learning and what layers learn.",
  "lessons/7": "Learned representations vs features.",
  "lessons/8": "Transformers, attention, self-attention.",
  "lessons/working-with-llms": "How LLMs generate text from tokens.",
  "lessons/delegate-real-work": "What changes when AI does the work.",
  "lessons/just-because-it-can": "What an assistant should be allowed to touch.",
};

/** Short breadcrumb labels (hierarchy, not keyword titles). */
const BREADCRUMB_NAME: Record<CourseIndexKey, string> = {
  "lessons/1": "What Is AI?",
  "lessons/2": "Why Rules Aren't Enough",
  "lessons/3": "Why Data Changed Everything",
  "lessons/4": "How Machines Learn",
  "lessons/5": "Neural Networks",
  "lessons/6": "Deep Learning",
  "lessons/7": "Representations",
  "lessons/8": "Transformers",
  "lessons/working-with-llms": "Working With LLMs",
  "lessons/delegate-real-work": "Delegate Real Work",
  "lessons/just-because-it-can": "Just Because It Can",
};

export type CourseIndexEntry = {
  key: CourseIndexKey;
  name: string;
  description: string;
  schemaDescription: string;
  breadcrumbName: string;
  path: string;
  url: string;
};

export function getCourseIndexEntries(): CourseIndexEntry[] {
  return COURSE_INDEX_KEYS.map((key) => {
    const page = PAGE_SEO[key];
    return {
      key,
      name: page.title,
      description: page.description,
      schemaDescription: COURSE_SCHEMA_DESCRIPTION[key],
      breadcrumbName: BREADCRUMB_NAME[key],
      path: page.path,
      url: absoluteUrl(page.path),
    };
  });
}

export function isCourseIndexKey(key: SeoPageKey): key is CourseIndexKey {
  return (COURSE_INDEX_KEYS as readonly string[]).includes(key);
}

type Crumb = {
  name: string;
  /** Omit on the current (last) crumb. */
  path?: string;
};

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => {
      const item: Record<string, unknown> = {
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
      };
      if (crumb.path) {
        item.item = absoluteUrl(crumb.path);
      }
      return item;
    }),
  };
}

export function webPageJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage";
}) {
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "WebPage",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    inLanguage: "en",
  };
}

export function courseJsonLd(key: CourseIndexKey) {
  const page = PAGE_SEO[key];
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: page.title,
    description: COURSE_SCHEMA_DESCRIPTION[key],
    url: absoluteUrl(page.path),
    isAccessibleForFree: true,
    provider: COURSE_PROVIDER,
    inLanguage: "en",
  };
}

/** Course index: ItemList of Course modules + breadcrumbs + CollectionPage. */
export function lessonsIndexJsonLd() {
  const entries = getCourseIndexEntries();
  return [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${SITE_NAME} — Interactive AI Lessons`,
      numberOfItems: entries.length,
      itemListElement: entries.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Course",
          url: entry.url,
          name: entry.name,
          description: entry.schemaDescription,
          provider: COURSE_PROVIDER,
          isAccessibleForFree: true,
        },
      })),
    },
    breadcrumbJsonLd([
      { name: SITE_NAME, path: "/" },
      { name: "Lessons" },
    ]),
    webPageJsonLd({
      name: PAGE_SEO.lessons.title,
      description: PAGE_SEO.lessons.description,
      path: "/lessons",
      type: "CollectionPage",
    }),
  ];
}

/** Individual lesson: Course module + BreadcrumbList + WebPage. */
export function lessonPageJsonLd(key: CourseIndexKey) {
  const page = PAGE_SEO[key];
  const crumbName = BREADCRUMB_NAME[key];
  return [
    courseJsonLd(key),
    breadcrumbJsonLd([
      { name: SITE_NAME, path: "/" },
      { name: "Lessons", path: "/lessons" },
      { name: crumbName },
    ]),
    webPageJsonLd({
      name: page.title,
      description: page.description,
      path: page.path,
    }),
  ];
}

export function aboutPageJsonLd() {
  return [
    breadcrumbJsonLd([
      { name: SITE_NAME, path: "/" },
      { name: "About" },
    ]),
    webPageJsonLd({
      name: `${PAGE_SEO.about.title} | ${SITE_NAME}`,
      description: PAGE_SEO.about.description,
      path: "/about",
      type: "AboutPage",
    }),
  ];
}
