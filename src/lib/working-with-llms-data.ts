export const PREDICTION_SLIDER_IDS = [
  "identical",
  "slightly",
  "dramatically",
] as const;

export type PredictionSliderValue =
  (typeof PREDICTION_SLIDER_IDS)[number];

export const CAUSE_CHOICES = [
  { id: "model-smarter", helped: false },
  { id: "brand-document", helped: true },
  { id: "longer-prompt", helped: false },
  { id: "style-sample", helped: true },
  { id: "luck", helped: false },
  { id: "pinned-instructions", helped: true },
] as const;

export type CauseChoiceId = (typeof CAUSE_CHOICES)[number]["id"];

export const CONTEXT_CHIP_IDS = [
  "audience",
  "brand-voice",
  "past-decision",
  "worked-example",
] as const;

export type ContextChipId = (typeof CONTEXT_CHIP_IDS)[number];

export const CONTEXT_CARD_IDS = [
  "business",
  "audience",
  "tone-sample",
  "past-decision",
  "do-dont",
] as const;

export type ContextCardId = (typeof CONTEXT_CARD_IDS)[number];

export const APPROACH_CHOICE_IDS = ["accept", "critique"] as const;

export type ApproachChoiceId = (typeof APPROACH_CHOICE_IDS)[number];

export const TRANSFER_CHOICE_IDS = ["reusable", "quick"] as const;

export type TransferChoiceId = (typeof TRANSFER_CHOICE_IDS)[number];

export const TRANSFER_SCENARIOS = [
  { id: "street-sign", answer: "quick" as TransferChoiceId },
  { id: "company-style", answer: "reusable" as TransferChoiceId },
  { id: "movie-year", answer: "quick" as TransferChoiceId },
  { id: "weekly-reports", answer: "reusable" as TransferChoiceId },
  { id: "word-meaning", answer: "quick" as TransferChoiceId },
  { id: "personal-voice", answer: "reusable" as TransferChoiceId },
  { id: "random-article", answer: "quick" as TransferChoiceId },
] as const;

export type TransferScenarioId = (typeof TRANSFER_SCENARIOS)[number]["id"];

export const ALTITUDE_CHOICES = [
  { id: "vague", winner: false },
  { id: "sweet-spot", winner: true },
  { id: "micromanaged", winner: false },
] as const;

export type AltitudeChoiceId = (typeof ALTITUDE_CHOICES)[number]["id"];
