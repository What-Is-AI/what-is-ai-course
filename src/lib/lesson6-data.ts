/** Source of truth for Lesson 6 – Deep Learning. Copy mirrors docs/lesson6-script.md */

export const DEFAULT_CTA = "Continue →";

export const LESSON6_META = {
  world: "The Depth",
  title: "Deep Learning",
  shortTitle: "Deep Learning",
  mystery:
    "What becomes possible when a neural network can build on its own earlier representations?",
} as const;

/* ─── Beat 2 Compress (S3a / S3b) — data contract ─── */

/** Bottleneck sizes with a shipped decoder + precomputed network latent each. */
export const BOTTLENECK_SIZES = [100, 20, 5] as const;
export type BottleneckSize = (typeof BOTTLENECK_SIZES)[number];

/** S3a human attempt always uses N=20. */
export const HUMAN_ATTEMPT_N = 20 as const satisfies BottleneckSize;

/** S3b — “you broke it” when representation size ≤ this (tune in data, not code). */
export const BREAK_POINT = 5 as const satisfies BottleneckSize;

/** S3a slider / field controls. */
export const LATENT_CONTROL = {
  count: HUMAN_ATTEMPT_N,
  min: -3,
  max: 3,
  step: 0.1,
  /** Prefer 0; set `"random"` if design wants a scrambled start. */
  init: 0 as 0 | "random",
} as const;

/**
 * Screen-reader / text verdicts per N (pair with image; never colour alone).
 * Tune copy in the script pass; keys must cover every BOTTLENECK_SIZES entry.
 */
export const RECONSTRUCTION_VERDICTS: Record<
  BottleneckSize,
  { network: string; humanGarbage: string }
> = {
  100: {
    network: "Drawn from the network's numbers: fairly detailed; still looks like the 7.",
    humanGarbage: "Drawn from your numbers: not a recognizable 7.",
  },
  20: {
    network: "Drawn from the network's numbers: still looks like the 7; some detail lost.",
    humanGarbage: "Drawn from your numbers: not a recognizable 7.",
  },
  5: {
    network: "Drawn from the network's numbers: broken apart — not enough room to keep the 7.",
    humanGarbage: "Drawn from your numbers: not a recognizable 7.",
  },
};

/**
 * Asset paths. Live path = TF.js decoder basis + latents for the shared digit “7”.
 * Continuity with Arrive/Compose. S3b break-at-5 is tuned separately (digits compress easily).
 *
 * Engine: TensorFlow.js. Target = synthetic handwritten 7 (not Fashion-MNIST).
 */
export const COMPRESS_TRAINING = {
  corpus: "handwritten-7" as
    | "handwritten-7"
    | "fashion-mnist"
    | "cc0-photos"
    | "own-photos",
  licenseNote: "Synthetic handwritten 7 matching Arrive/Compose glyph",
  engine: "tfjs",
  /** Directory per N containing model.json + weight shards from tensorflowjs_converter. */
} as const;

export const COMPRESS_ASSETS = {
  targetImage: "/lessons/6/compress/target.json",
  basis: "/lessons/6/compress/basis.json",
  networkLatents: {
    100: "/lessons/6/compress/latent-100.json",
    20: "/lessons/6/compress/latent-20.json",
    5: "/lessons/6/compress/latent-5.json",
  },
} as const;

/**
 * Compress runtime mode. Primary = real shared decoder in-browser.
 * Switch to `"fallback"` only if decoder-in-browser is ruled out.
 */
export const COMPRESS_MODE = "live-decoder" as "live-decoder" | "fallback";

/* ─── Beat 3 Deepen (S4b / S4c) — 2-D toy net ─── */

/** Primary path: live client-side MLP. Text = last resort only. */
export const DEEPEN_MODE = "live-toy" as "live-toy" | "text-fallback";

export const TOY_DATASETS = [
  "concentric-rings",
  "spiral",
  "interleaved-dots",
] as const;
export type ToyDatasetId = (typeof TOY_DATASETS)[number];

/** Default dataset for S4b/S4c (tune so shallow fails and deeper wraps). */
export const TOY_DATASET_DEFAULT: ToyDatasetId = "concentric-rings";

/**
 * Depth ladder for the toy MLP (hidden-layer counts or equivalent).
 * Shallow end must fail the set; mid must wrap; deep end must be able to plateau/overfit.
 */
/** Depth ladder for S4c plateau (1→2→4→8→16). Shape must rise, peak, fall. */
export const TOY_DEPTH_LEVELS = [1, 2, 4, 8, 16] as const;

export const TOY_TRAIN = {
  /** Target wall-clock on mid laptop / wasm — keep “seconds,” not minutes. */
  maxSecondsHint: 8,
  seed: 42,
} as const;

/** Epochs / LR per depth so the live curve rises then falls (S4c). */
export const TOY_PLATEAU_SCHEDULE: Record<
  (typeof TOY_DEPTH_LEVELS)[number],
  { epochs: number; lr: number; seed: number }
> = {
  1: { epochs: 28, lr: 0.1, seed: 11 },
  2: { epochs: 50, lr: 0.09, seed: 22 },
  4: { epochs: 80, lr: 0.07, seed: 44 },
  8: { epochs: 18, lr: 0.04, seed: 88 },
  16: { epochs: 8, lr: 0.025, seed: 160 },
};

export const DEEPEN_VERDICTS = {
  shallowFail: "Shallow net: not separated — boundary stays too simple.",
  deeperWraps: "Deeper net: boundary bends and wraps around the data.",
  plateaued: "Training curve plateaued — more depth did not keep helping.",
  overfit: "Training improved on the toy set, but the curve shows overfit / unstable training.",
} as const;

/**
 * S4b-ii wide vs deep — equal hidden-unit budget.
 * Live equal-budget training on concentric rings does not produce the
 * pedagogical contrast (width also separates), so the step uses an
 * illustrative boundary pair with the equal unit count stated on screen.
 */
export const WIDE_VS_DEEP = {
  mode: "illustrative" as const,
  totalUnits: 24,
  wide: [24] as const,
  deep: [8, 8, 8] as const,
  /** Fixed accuracy readouts paired with illustrative boundaries. */
  illustrativePct: { wide: 53, deep: 94 } as const,
} as const;

/**
 * Optional static richness only — published feature-viz images with “observed after
 * training” caption. Never a live interactive; never required for gates.
 */
export const FEATURE_VIZ_STATIC = {
  enabled: false,
  image: "/lessons/6/deepen/feature-viz-static.png",
  caption:
    "Researchers observe patterns like these after training — not a rule the network was given.",
} as const;

/* ─── Other beats (stubs) ─── */

/** Handwritten “7” grid shared by Arrive → Compose (14×14 keys `"y,x"`). */
export const PIXEL_SEVEN = new Set([
  "0,2","0,3","0,4","0,5","0,6","0,7","0,8","0,9","0,10",
  "1,10","2,9","3,8","4,7","5,6","6,5","7,5","8,5","9,5","10,5","11,5","12,5","13,5",
]);

/** S2 — Compose palette (script Beat 1). */
export const TRANSFORMATIONS = [
  "brighten",
  "blur",
  "sharpen",
  "contrast",
  "invert",
  "reduce detail",
] as const;

/** S6 — Budget choices (Judgment → then Chinchilla reveal). */
export const BUDGET_CHOICES = [
  "bigger",
  "data",
  "balanced",
] as const;

export type BudgetChoice = (typeof BUDGET_CHOICES)[number];

/** S7a — Final challenge (Scored: C). */
export const FINAL_CHALLENGE = {
  prompt: "Deep learning is useful because...",
  options: [
    { id: "A", label: "It makes computers think more deeply." },
    { id: "B", label: "It simply adds more neurons." },
    {
      id: "C",
      label:
        "It allows neural networks to compose many learned transformations and construct useful representations from data.",
    },
  ],
  correctId: "C",
} as const;

/** Experience step ids — must match docs/lesson6-script.md Interaction contract. */
export const LESSON6_STEP_IDS = [
  "arrive",
  "compose",
  "compress-human",
  "compress-bottleneck",
  "compress-reveal",
  "deepen-callback",
  "deepen-inspect",
  "deepen-width",
  "deepen-plateau",
  "deepen-reveal",
  "budget",
  "challenge",
  "reflection",
  "tracker",
  "closing",
] as const;

export type Lesson6StepId = (typeof LESSON6_STEP_IDS)[number];
