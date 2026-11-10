/** Source of truth for Lesson 7 – From Features to Representations. Copy mirrors docs/lesson7-script.md */

export const DEFAULT_CTA = "Continue →";

export const LESSON7_META = {
  world: "The Listening Room",
  title: "From Features to Representations",
  shortTitle: "Where features come from",
  mystery: "What information actually matters?",
} as const;

/** Feature options named in Predict (Step 2) — also drive Step 3 sliders. */
export const FEATURE_OPTIONS = [
  "tempo",
  "beat",
  "loud",
  "bass",
  "rhythm",
  "vocals",
  "unnamed",
] as const;

export type FeatureOptionId = (typeof FEATURE_OPTIONS)[number];

/** Measurable features that become Step 3 threshold sliders. */
export const SLIDER_FEATURES = [
  "tempo",
  "beat",
  "loud",
  "bass",
  "rhythm",
  "vocals",
] as const;

export type SliderFeatureId = (typeof SLIDER_FEATURES)[number];

export const SLIDER_LABELS: Record<SliderFeatureId, string> = {
  tempo: "Tempo",
  beat: "Beat strength",
  loud: "Loudness",
  bass: "Bass",
  rhythm: "Rhythm",
  vocals: "Vocals",
};

export const DEFAULT_THRESHOLD = 0.5;

/**
 * Experience step ids — must match docs/lesson7-impl.md step map
 * and docs/lesson7-script.md step order.
 */
export const LESSON7_STEP_IDS = [
  "arrive",
  "predict-pick",
  "predict-name",
  "hand-rules",
  "hand-test",
  "hand-wall",
  "two-paths",
  "label-train",
  "rep-reveal",
  "head-to-head",
  "hidden",
  "task-dep",
  "who-decides",
  "challenge",
  "reflection",
  "closing",
] as const;

export type Lesson7StepId = (typeof LESSON7_STEP_IDS)[number];

/** Offline audio / embedding bundle (filled in Phase Audio). */
export const AUDIO_ASSETS = {
  bundle: "/lessons/7/bundle.json",
  audioDir: "/lessons/7/audio",
} as const;
