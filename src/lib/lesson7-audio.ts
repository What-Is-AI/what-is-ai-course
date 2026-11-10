/**
 * Lesson 7 audio asset contracts.
 * Offline pipeline: scripts/lesson7/build_audio_assets.py
 * Runtime loads static JSON + short clips from /public/lessons/7/
 */

export type ClipRole =
  | "predict"
  | "train"
  | "hand-test"
  | "head-to-head"
  | "hidden-pair"
  | "challenge"
  | "task-view";

export type ClipTag =
  | "driving electronic"
  | "slow acoustic"
  | "tense score"
  | "sparse beat"
  | "bright pop"
  | "soft ambient"
  | "heavy bass"
  | "live band"
  | "percussion"
  | "strings";

/** Hand-designed measurements used by Step 3 sliders (0–1 normalized). */
export type HandFeatures = {
  tempo: number;
  beat: number;
  loud: number;
  bass: number;
  rhythm: number;
  vocals: number;
};

export type ClipRecord = {
  id: string;
  title: string;
  artist: string;
  /** Public path under /lessons/7/audio/ */
  src: string;
  durationSec: number;
  license: string;
  licenseUrl: string;
  attribution: string;
  tag: ClipTag;
  /** Downsampled RMS / energy envelope for the visible trace (typically 48–64 pts). */
  energyTrace: number[];
  features: HandFeatures;
  roles: ClipRole[];
  /** Optional ground-truth for workout-style task (CLAP-derived or curated). */
  workoutBelongs?: boolean;
  /** Optional CLAP text-probe scores from the offline build. */
  clapScores?: { workout: number; sleep: number };
  /** Optional instrument / mood labels for Step 7. */
  labels?: {
    mood?: "sweat" | "sleep" | "neutral";
    instrument?: string;
  };
};

export type LayoutPoint = {
  id: string;
  x: number;
  y: number;
};

export type HiddenPair = {
  id: string;
  clipA: string;
  clipB: string;
  /** Learner prompt framing. */
  kind: "same-measures-different-feel" | "different-measures-related-feel";
  /** Real embedding distance (cosine or Euclidean in embed space). */
  embedDistance: number;
  /** Expected placement after 2-D draw: far | close */
  expected: "far" | "close";
};

export type Lesson7AudioBundle = {
  version: 1;
  embedder: string;
  embedDim: number;
  generatedAt: string;
  notes: string;
  clips: ClipRecord[];
  /** Full embedding vectors aligned with clip ids (or path to separate file). */
  embeddings: Record<string, number[]>;
  /** Default 2-D PCA/UMAP draw of frozen embeddings (our drawing). */
  layoutDefault: LayoutPoint[];
  /** Task-conditioned 2-D layouts (Step 7). */
  layoutsByTask: {
    sweat: LayoutPoint[];
    sleep: LayoutPoint[];
    instrument: LayoutPoint[];
  };
  hiddenPairs: HiddenPair[];
  /** Clip ids for Step 3 / Step 5 held-out set. */
  heldOutIds: string[];
  /**
   * Max match rate any threshold config achieved in offline sweep (0–1).
   * Honesty gate: must stay clearly below a useful score (e.g. < 0.55).
   */
  handDetectorCeiling: number;
};

export const LESSON7_AUDIO_PATHS = {
  bundle: "/lessons/7/bundle.json",
  audioDir: "/lessons/7/audio",
} as const;
