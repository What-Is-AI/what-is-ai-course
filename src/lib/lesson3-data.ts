export const DOCTORS = [
  { id: "a", patients: 12 },
  { id: "b", patients: 800 },
  { id: "c", patients: 250_000 },
] as const;

export type DoctorId = (typeof DOCTORS)[number]["id"];

export type HardImageMeta = {
  id: string;
  betterModel: "a" | "b" | "both" | "neither";
  image?: string;
};

export const HARD_IMAGES: HardImageMeta[] = [
  {
    id: "cartoon",
    betterModel: "b",
    image: "/lesson3/cartoon-cat.png",
  },
  {
    id: "sleeping",
    betterModel: "b",
    image: "/lesson3/sleeping-cat.png",
  },
  {
    id: "black",
    betterModel: "b",
    image: "/lesson3/black-cat.png",
  },
  {
    id: "blurry",
    betterModel: "b",
    image: "/lesson3/blurry-cat.png",
  },
  {
    id: "statue",
    betterModel: "b",
    image: "/lesson3/statue-cat.png",
  },
  {
    id: "robot",
    betterModel: "neither",
    image: "/lesson3/robot-cat.png",
  },
];

export type DataAnswer = "yes" | "no" | "maybe";

export type DataCardMeta = {
  id: string;
  answer: DataAnswer;
};

export const DATA_CARDS: DataCardMeta[] = [
  { id: "wikipedia", answer: "yes" },
  { id: "github", answer: "yes" },
  { id: "reddit", answer: "yes" },
  { id: "dictionary", answer: "maybe" },
  { id: "scripts", answer: "yes" },
  { id: "excel", answer: "maybe" },
  { id: "dna", answer: "no" },
  { id: "contacts", answer: "no" },
  { id: "gps", answer: "no" },
];

export type DatasetAnswer = "best" | "weak" | "ok";

export type DatasetOptionMeta = {
  id: string;
  answer: DatasetAnswer;
};

export const DATASET_OPTIONS: DatasetOptionMeta[] = [
  { id: "tweets", answer: "weak" },
  { id: "books", answer: "ok" },
  { id: "wiki", answer: "ok" },
  { id: "mix", answer: "best" },
];

export const INTERNET_ERA = [
  { year: 1985 },
  { year: 1995 },
  { year: 2001 },
  { year: 2015 },
  { year: 2024 },
] as const;

export type DetectiveBucket =
  | "broad"
  | "everyday"
  | "expert"
  | "code"
  | "narrative"
  | "weak";

export type DetectiveDatasetMeta = {
  id: string;
  bucket: DetectiveBucket;
};

export type DetectiveFeedback =
  | { key: "weak" | "noEveryday" | "balanced" | "workable" }
  | { key: "heavy"; bucket: DetectiveBucket };

export function detectiveFeedback(
  buckets: DetectiveBucket[],
): DetectiveFeedback {
  if (buckets.filter((b) => b === "weak").length >= 2) {
    return { key: "weak" };
  }

  if (buckets.filter((b) => b === "everyday").length === 0) {
    return { key: "noEveryday" };
  }

  const bucketCounts = new Map<DetectiveBucket, number>();
  for (const bucket of buckets) {
    bucketCounts.set(bucket, (bucketCounts.get(bucket) ?? 0) + 1);
  }
  for (const [bucket, count] of bucketCounts) {
    if (count >= 4) {
      return { key: "heavy", bucket };
    }
  }

  if (new Set(buckets).size >= 4) {
    return { key: "balanced" };
  }

  return { key: "workable" };
}

export const DETECTIVE_DATASETS: DetectiveDatasetMeta[] = [
  { id: "wikipedia", bucket: "broad" },
  { id: "tiktok", bucket: "everyday" },
  { id: "medical", bucket: "expert" },
  { id: "stackoverflow", bucket: "code" },
  { id: "harry", bucket: "narrative" },
  { id: "weather", bucket: "weak" },
  { id: "court", bucket: "expert" },
  { id: "menus", bucket: "weak" },
  { id: "github", bucket: "code" },
  { id: "reddit", bucket: "everyday" },
  { id: "finance", bucket: "expert" },
  { id: "satellite", bucket: "weak" },
];

export const DETECTIVE_LIMIT = 6;

export const CORPUS_OPTION_IDS = [
  "britannica",
  "wikipedia",
  "internet",
  "llm",
] as const;

export const CORPUS_BARS = [
  {
    id: "britannica",
    widthPct: 8,
    fill: "#c4bdb4",
    hasNote: true,
    hasInside: false,
  },
  {
    id: "wikipedia",
    widthPct: 25,
    fill: "#93c5fd",
    hasNote: true,
    hasInside: false,
  },
  {
    id: "llm",
    widthPct: 54,
    fill: "#3b82f6",
    hasNote: true,
    hasInside: false,
  },
  {
    id: "internet",
    widthPct: 100,
    fill: "#1e40af",
    hasNote: false,
    hasInside: true,
  },
] as const;

export const DOCTOR_REASON_IDS = [
  "practice",
  "experience",
  "cases",
  "judgment",
] as const;

export const TRAINER_CASE_IDS = [
  "front",
  "black",
  "blurry",
  "cartoon",
  "statue",
  "sleeping",
] as const;

export type TrainerCaseId = (typeof TRAINER_CASE_IDS)[number];

function trainerSrc(filename: string) {
  return `/lesson3/trainer/${filename}`;
}

export const TRAINER_CASES: { id: TrainerCaseId; images: string[] }[] = [
  {
    id: "front",
    images: [
      trainerSrc("front-1.jpg"),
      trainerSrc("front-2.jpg"),
      trainerSrc("front-3.jpg"),
    ],
  },
  {
    id: "black",
    images: [
      trainerSrc("black-1.jpg"),
      trainerSrc("black-2.jpg"),
      trainerSrc("black-3.jpg"),
    ],
  },
  {
    id: "blurry",
    images: [
      trainerSrc("blur-1.jpg"),
      trainerSrc("blur-2.jpg"),
      trainerSrc("blur-3.jpg"),
    ],
  },
  {
    id: "cartoon",
    images: [
      trainerSrc("cartoon-1.jpg"),
      trainerSrc("cartoon-2.jpg"),
      trainerSrc("cartoon-3.jpg"),
    ],
  },
  {
    id: "statue",
    images: [
      trainerSrc("statue-1.jpg"),
      trainerSrc("statue-2.jpg"),
      trainerSrc("statue-3.jpg"),
    ],
  },
  {
    id: "sleeping",
    images: [
      trainerSrc("sleep-1.jpg"),
      trainerSrc("sleep-2.jpg"),
      trainerSrc("sleep-3.jpg"),
    ],
  },
];

/** Serve clearest→hardest; after the 3rd add, stay on -3. */
export function imageIndexForCount(count: number) {
  if (count <= 0) return 0;
  return Math.min(count - 1, 2);
}

/** Per-case coverage: 1 − 0.45ⁿ – first photo jumps, duplicates plateau. */
export function caseCoverage(n: number) {
  if (n <= 0) return 0;
  return 1 - Math.pow(0.45, n);
}

/** Hard ceiling ≈ Bayes error: even infinite diverse data tops out near 97%. */
export const ACCURACY_CEILING = 0.97;

export function accuracyFromCounts(counts: Record<string, number>) {
  const mean =
    TRAINER_CASES.reduce((acc, c) => acc + caseCoverage(counts[c.id] ?? 0), 0) /
    TRAINER_CASES.length;
  return Math.round(ACCURACY_CEILING * mean * 100);
}
