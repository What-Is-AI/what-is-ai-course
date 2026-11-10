import type { Metadata } from "next";

/** Canonical production origin. */
export const SITE_URL = "https://whatisai.proaiassistant.com";

/** Public GitHub repo (set in env after the repo exists). */
export const SITE_REPO_URL =
  process.env.NEXT_PUBLIC_SITE_REPO_URL?.trim() || "";

export const SITE_NAME = "What is AI";

export const LICENSE_CODE_URL = "https://www.gnu.org/licenses/agpl-3.0.html";
export const LICENSE_CONTENT_URL =
  "https://creativecommons.org/licenses/by-nc-sa/4.0/";

/**
 * Search-facing site description (concrete category language).
 * Brand UI copy (home.tagline etc.) stays poetic separately.
 */
export const SITE_DESCRIPTION =
  "Free interactive AI course for beginners and curious adults. Learn how artificial intelligence, machine learning, neural networks, deep learning, Transformers, and large language models work through hands-on lessons.";

export const HOME_TITLE = "What Is AI? — An Interactive AI Literacy Course";

/** Default social share image (1200×630). Absolute via metadataBase. */
const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
} as const;

type PageSeo = {
  /** Search / social title (UI lesson titles stay unchanged). */
  title: string;
  description: string;
  path: string;
  /** Thin or unfinished routes should stay out of the index. */
  index?: boolean;
};

/**
 * Two-layer naming: search titles live here; human-facing world/lesson names
 * stay in messages/ and lesson UI. Meta descriptions describe the experience.
 * Never change lesson UI/copy for SEO. Do not add FAQPage schema.
 */
export const PAGE_SEO = {
  home: {
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
    path: "/",
  },
  about: {
    title: "About",
    description:
      "How What is AI teaches: predict first, then explore. Interactive lessons on AI for curious adults — free, no signup.",
    path: "/about",
  },
  lessons: {
    title: "Interactive AI Lessons",
    description:
      "Browse free interactive lessons on artificial intelligence — machine learning, neural networks, deep learning, Transformers, and LLMs. No signup.",
    path: "/lessons",
  },
  "lessons/1": {
    title: "What Is Artificial Intelligence? An Interactive Introduction",
    description:
      "Explore what actually counts as AI — from ChatGPT to everyday tools — and what doesn’t. An interactive introduction with no signup.",
    path: "/lessons/1",
  },
  "lessons/2": {
    title: "Why Rules Aren't Enough for AI",
    description:
      "See what happens when intelligence is written as rules: sticky notes pile up, edge cases multiply, and the system breaks. An interactive AI lesson.",
    path: "/lessons/2",
  },
  "lessons/3": {
    title: "How Data Changed Artificial Intelligence",
    description:
      "Explore why learning from data changed AI — and why systems that could learn decades ago only took off when data and compute arrived.",
    path: "/lessons/3",
  },
  "lessons/4": {
    title: "How Does Machine Learning Work?",
    description:
      "How does a machine learn from data? See prediction, error, and repeated adjustment — machine learning explained without the jargon wall.",
    path: "/lessons/4",
  },
  "lessons/5": {
    title: "What Is a Neural Network?",
    description:
      "What is a neural network, and how do neural networks learn? Explore weights, layers, and how networks recognize patterns — no calculus required.",
    path: "/lessons/5",
  },
  "lessons/6": {
    title: "What Is Deep Learning?",
    description:
      "Deep learning explained: why neural networks are deep, what layers learn, and what becomes possible when representations stack.",
    path: "/lessons/6",
  },
  "lessons/7": {
    title: "What Are Learned Representations in AI?",
    description:
      "Representation learning explained: how neural networks learn features, and how that differs from hand-built feature engineering.",
    path: "/lessons/7",
  },
  "lessons/8": {
    title: "What Is a Transformer? How Attention Works",
    description:
      "What is a Transformer, and how does attention work? Self-attention, why Transformers were invented, and how models predict what comes next.",
    path: "/lessons/8",
  },
  "lessons/working-with-llms": {
    title: "How Do Large Language Models Actually Work?",
    description:
      "How do LLMs work — tokens, next-word prediction, and how a language model generates text? Practical interactive lesson. Free, no signup.",
    path: "/lessons/working-with-llms",
  },
  "lessons/delegate-real-work": {
    title: "What Changes When AI Does the Work?",
    description:
      "Explore what changes the first time AI does the work instead of just answering questions — handoff, judgment, and staying in the loop.",
    path: "/lessons/delegate-real-work",
  },
  "lessons/just-because-it-can": {
    title: "What Should AI Be Allowed to Touch?",
    description:
      "Explore connectors, permissions, and who decides what an assistant may touch when it’s linked to real data and accounts.",
    path: "/lessons/just-because-it-can",
  },
  "lessons/when-it-goes-looking": {
    title: "When the Assistant Goes Looking",
    description:
      "Coming soon: what happens when an assistant fetches information you never chose to give it.",
    path: "/lessons/when-it-goes-looking",
    index: false,
  },
} as const satisfies Record<string, PageSeo>;

export type SeoPageKey = keyof typeof PAGE_SEO;

/**
 * Absolute canonical URL for a path.
 * Boring rules: https origin, no trailing slash (except `/`), no query/hash.
 * Paths match real routes today (`/lessons/8`) — not `/en/lessons/8`, because
 * locales are client-side only. Do not invent locale prefixes in canonicals.
 */
export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    const parsed = new URL(path);
    const cleanPath =
      parsed.pathname.replace(/\/+$/, "") || "/";
    return cleanPath === "/"
      ? SITE_URL
      : `${SITE_URL}${cleanPath}`;
  }

  const withoutQuery = path.split(/[?#]/)[0] ?? "/";
  const withSlash = withoutQuery.startsWith("/")
    ? withoutQuery
    : `/${withoutQuery}`;
  const normalized = withSlash.replace(/\/+$/, "") || "/";
  return normalized === "/" ? SITE_URL : `${SITE_URL}${normalized}`;
}

/** Build Next.js Metadata for a public (or noindex) page. */
export function pageMetadata(key: SeoPageKey): Metadata {
  const page = PAGE_SEO[key];
  const canonical = absoluteUrl(page.path);
  const index = !("index" in page && page.index === false);
  const isHome = key === "home";

  const fullTitle = isHome ? HOME_TITLE : `${page.title} | ${SITE_NAME}`;

  return {
    title: isHome ? { absolute: HOME_TITLE } : page.title,
    description: page.description,
    // One absolute canonical per page — must match the real public URL.
    alternates: { canonical },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: isHome ? "website" : "article",
      url: canonical,
      siteName: SITE_NAME,
      title: fullTitle,
      description: page.description,
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: page.description,
      images: [OG_IMAGE.url],
    },
  };
}

export function rootMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: HOME_TITLE,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      title: HOME_TITLE,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: HOME_TITLE,
      description: SITE_DESCRIPTION,
      images: [OG_IMAGE.url],
    },
  };
}
