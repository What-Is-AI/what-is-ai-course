export type Bucket = "definitely" | "could" | "probably-not";

export const BUCKET_IDS: Bucket[] = ["definitely", "could", "probably-not"];

/** What problem the system is solving. */
export type Domain =
  | "language"
  | "vision"
  | "audio"
  | "planning"
  | "ranking"
  | "multiple"
  | "none";

export const DOMAIN_IDS: Domain[] = [
  "language",
  "vision",
  "audio",
  "planning",
  "ranking",
  "multiple",
  "none",
];

/** Where the behaviour came from. */
export type Origin = "learned" | "specified" | "both" | "depends";

export const ORIGIN_IDS: Origin[] = [
  "learned",
  "specified",
  "both",
  "depends",
];

export type SortItemMeta = {
  id: string;
  answer: Bucket;
  domain: Domain;
  origin: Origin;
  refs?: { id: string; href: string }[];
  hidden?: boolean;
};

/**
 * Round 1 – sort by instinct.
 * Order is pedagogical: 1–5 build "AI = learned", 6 breaks it,
 * 10–11 break fixed product answers, 12 synthesizes.
 */
export const SORT_ROUND1: SortItemMeta[] = [
  { id: "chatgpt", answer: "definitely", domain: "language", origin: "learned" },
  { id: "calculator", answer: "probably-not", domain: "none", origin: "specified" },
  {
    id: "gen-fill",
    answer: "definitely",
    domain: "vision",
    origin: "learned",
    hidden: true,
  },
  {
    id: "crop",
    answer: "probably-not",
    domain: "none",
    origin: "specified",
    hidden: true,
  },
  { id: "spam", answer: "definitely", domain: "language", origin: "learned" },
  { id: "gps", answer: "definitely", domain: "planning", origin: "specified" },
  {
    id: "chess",
    answer: "could",
    domain: "planning",
    origin: "both",
    refs: [
      { id: "alphazero", href: "https://en.wikipedia.org/wiki/AlphaZero" },
      {
        id: "deepBlue",
        href: "https://en.wikipedia.org/wiki/Deep_Blue_(chess_computer)",
      },
    ],
  },
  { id: "faceid", answer: "definitely", domain: "vision", origin: "learned" },
  { id: "spotify", answer: "definitely", domain: "ranking", origin: "learned" },
  { id: "autocomplete", answer: "could", domain: "language", origin: "depends" },
  {
    id: "translate",
    answer: "could",
    domain: "language",
    origin: "learned",
    hidden: true,
  },
  { id: "selfdrive", answer: "definitely", domain: "multiple", origin: "both" },
];

export const SORT_ROUND1_ACTIVE = SORT_ROUND1.filter((item) => !item.hidden);

export const SORT_ROUND2: SortItemMeta[] = [
  {
    id: "qr",
    answer: "probably-not",
    domain: "none",
    origin: "specified",
    hidden: true,
  },
  { id: "captcha", answer: "could", domain: "vision", origin: "specified" },
  { id: "search", answer: "could", domain: "ranking", origin: "depends" },
  { id: "ocr", answer: "could", domain: "vision", origin: "depends" },
  { id: "grammar", answer: "could", domain: "language", origin: "depends" },
  { id: "siri", answer: "could", domain: "multiple", origin: "both" },
  {
    id: "fingerprint",
    answer: "could",
    domain: "vision",
    origin: "depends",
    hidden: true,
  },
  {
    id: "excel-formula",
    answer: "probably-not",
    domain: "none",
    origin: "specified",
    hidden: true,
  },
  {
    id: "excel-copilot",
    answer: "definitely",
    domain: "language",
    origin: "learned",
  },
  {
    id: "lens",
    answer: "definitely",
    domain: "vision",
    origin: "learned",
    hidden: true,
  },
  {
    id: "compression",
    answer: "probably-not",
    domain: "none",
    origin: "specified",
  },
  { id: "noise", answer: "could", domain: "audio", origin: "depends" },
  { id: "deepfake", answer: "definitely", domain: "vision", origin: "learned" },
];

export const SORT_ROUND2_ACTIVE = SORT_ROUND2.filter((item) => !item.hidden);

export type DependsToggleEraMeta = {
  origin: Extract<Origin, "specified" | "learned">;
};

export type DependsToggleItemMeta = {
  id: string;
  domain: Domain;
  eraThen: DependsToggleEraMeta;
  eraNow: DependsToggleEraMeta;
};

export const DEPENDS_TOGGLE: DependsToggleItemMeta[] = [
  {
    id: "autocomplete",
    domain: "language",
    eraThen: { origin: "specified" },
    eraNow: { origin: "learned" },
  },
  {
    id: "ocr",
    domain: "vision",
    eraThen: { origin: "specified" },
    eraNow: { origin: "learned" },
  },
  {
    id: "search-ranking",
    domain: "ranking",
    eraThen: { origin: "specified" },
    eraNow: { origin: "learned" },
  },
];

export type TwoAxisPlacement = {
  domain: Domain;
  origin: Origin;
};

export type TimelineGuessMeta = {
  id: string;
  year: number;
  order: number;
  tieGroup?: string;
};

/** Planning + Machine Learning, both 1959 – either order is correct. */
export const TIMELINE_SOURCES_META: {
  id: string;
  href?: string;
}[] = [
  {
    id: "dartmouth",
    href: "https://www-formal.stanford.edu/jmc/history/dartmouth/dartmouth.html",
  },
  {
    id: "samuel",
    href: "https://doi.org/10.1147/rd.33.0210",
  },
  {
    id: "astar",
    href: "https://doi.org/10.1109/TSSC.1968.300136",
  },
  {
    id: "qlearn",
    href: "https://doi.org/10.1007/BF00992698",
  },
  {
    id: "alexnet",
    href: "https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks",
  },
  {
    id: "attention",
    href: "https://arxiv.org/abs/1706.03762",
  },
];

export const TIMELINE: TimelineGuessMeta[] = [
  { id: "ai-coined", year: 1956, order: 0 },
  {
    id: "planning",
    year: 1959,
    order: 1,
    tieGroup: "1959-reason-learn",
  },
  {
    id: "ml",
    year: 1959,
    order: 2,
    tieGroup: "1959-reason-learn",
  },
  { id: "search", year: 1968, order: 3 },
  { id: "robotics", year: 1972, order: 4 },
  { id: "rl", year: 1989, order: 5 },
  { id: "dl", year: 2012, order: 6 },
  { id: "transformers", year: 2017, order: 7 },
  { id: "llms", year: 2022, order: 8 },
];

export type ScenarioKind = "learned" | "specified" | "hybrid";

export type ScenarioMeta = {
  id: string;
  optionIds: string[];
  correct: string;
  kind: ScenarioKind;
};

export const SCENARIOS: ScenarioMeta[] = [
  {
    id: "faceid",
    optionIds: ["pixels", "learn"],
    correct: "learn",
    kind: "learned",
  },
  {
    id: "spam",
    optionIds: ["phrases", "learn"],
    correct: "learn",
    kind: "learned",
  },
  {
    id: "spotify",
    optionIds: ["genre", "learn"],
    correct: "learn",
    kind: "learned",
  },
  {
    id: "chess",
    optionIds: ["search", "learn"],
    correct: "search",
    kind: "specified",
  },
  {
    id: "gps",
    optionIds: ["learn", "search"],
    correct: "search",
    kind: "specified",
  },
  {
    id: "siri",
    optionIds: ["all-learned", "hybrid"],
    correct: "hybrid",
    kind: "hybrid",
  },
];
