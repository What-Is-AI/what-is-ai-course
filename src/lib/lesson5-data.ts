/** Lesson 5 structure — copy mirrors docs/lesson5-script.md (design script, pre-build). */

export const LESSON5_STEPS = [
  "arrive",
  "opening",
  "prediction",
  "impossible-split",
  "one-unit",
  "tune-weights",
  "first-reveal",
  "overfit",
  "layers",
  "vocabulary",
  "watch-learning",
  "scale",
  "history",
  "reflection",
  "final-challenge",
  "closing",
] as const;

export type Lesson5StepId = (typeof LESSON5_STEPS)[number];

export type PredictionChoiceId =
  | "rules"
  | "memorize"
  | "detectors"
  | "giant-rule";

export const PREDICTION_CHOICES: { id: PredictionChoiceId }[] = [
  { id: "rules" },
  { id: "memorize" },
  { id: "detectors" },
  { id: "giant-rule" },
];

export type FinalChallengeId = "a" | "b" | "c" | "d";

export const FINAL_CHALLENGE_CORRECT: FinalChallengeId = "b";

export const NETWORK_PLAQUES = {
  oneUnit: "One unit",
  connectionStrength: "Connection strength",
  layers: "Layers",
  theLoop: "The loop",
  scale: "Scale",
} as const;
