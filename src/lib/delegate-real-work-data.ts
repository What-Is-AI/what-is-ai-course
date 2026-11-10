export const PREDICTION_CHOICES = [
  { id: "explain", bucket: "under-shoots" as const },
  { id: "summarize", bucket: "under-shoots" as const },
  { id: "draft", bucket: "under-shoots" as const },
  { id: "do_it", bucket: "real" as const },
] as const;

export type PredictionChoiceId = (typeof PREDICTION_CHOICES)[number]["id"];

export const PILE_SET_DRESSING_IDS = [
  "desk",
  "downloads",
  "spreadsheet",
  "sticky",
] as const;

export const USUAL_TOOL_IDS = ["sheets", "bookkeeping", "chat"] as const;

export type UsualToolId = (typeof USUAL_TOOL_IDS)[number];

export const MEET_BODY_IDS = ["point", "describe", "act"] as const;

export const WATCH_FRAME_IDS = ["1", "2", "3", "4", "5", "6"] as const;

export const REVIEW_ROWS = [
  { id: "A", vendor: "Nordic", amount: "$980", dueDate: "2026-04-09", wrong: false },
  { id: "B", vendor: "Acme", amount: "$1,240", dueDate: "2026-04-13", wrong: false },
  { id: "C", vendor: "Meridian", amount: "$2,100", dueDate: "2026-04-31", wrong: true },
] as const;

export type ReviewRowId = (typeof REVIEW_ROWS)[number]["id"];

export const INJECTION_CHOICES = [
  { id: "ignores", correct: false },
  { id: "approval", correct: true },
  { id: "unsafe", correct: false },
] as const;

export type InjectionChoiceId = (typeof INJECTION_CHOICES)[number]["id"];

export const HANDOFF_SETUP_IDS = ["s1", "s2", "s3", "s4", "s5"] as const;

export const COWORK_HREF = "https://claude.ai/download";

export const NEXT_STEP_IDS = ["inbox", "sleep", "weird"] as const;

export const HAND_OFF_BUCKET_IDS = ["handOff", "doYourself"] as const;

export type HandOffBucketId = (typeof HAND_OFF_BUCKET_IDS)[number];

export const JUDGMENT_ITEMS = [
  { id: "invoices", answer: "handOff" as HandOffBucketId },
  { id: "fire", answer: "doYourself" as HandOffBucketId },
  { id: "rename", answer: "handOff" as HandOffBucketId },
  { id: "apology", answer: "doYourself" as HandOffBucketId },
  { id: "report", answer: "handOff" as HandOffBucketId },
] as const;

export type JudgmentItemId = (typeof JUDGMENT_ITEMS)[number]["id"];

export const REFLECTION_PROMPT_IDS = ["before", "handoff", "check"] as const;

export const TAKEAWAY_IDS = ["t1", "t2", "t3", "t4", "t5", "t6"] as const;
