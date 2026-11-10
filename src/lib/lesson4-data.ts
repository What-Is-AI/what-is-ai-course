export type AssumptionId = "rules" | "memorize" | "adjust" | "unsure";

export type AssumptionMeta = {
  id: AssumptionId;
  borneOut: boolean;
  hasGetsSmarterBy: boolean;
};

export const ASSUMPTION_CHOICES: AssumptionMeta[] = [
  { id: "rules", borneOut: false, hasGetsSmarterBy: true },
  { id: "memorize", borneOut: false, hasGetsSmarterBy: true },
  { id: "adjust", borneOut: true, hasGetsSmarterBy: true },
  { id: "unsure", borneOut: false, hasGetsSmarterBy: false },
];

export function assumptionById(id: string | null | undefined) {
  if (!id) return null;
  return ASSUMPTION_CHOICES.find((c) => c.id === id) ?? null;
}

export type InstinctId = "rule" | "memorize" | "adjust";

export type FirstInstinctMeta = {
  id: InstinctId;
  survives: boolean;
  failureEmoji?: string;
};

export const FIRST_INSTINCTS: FirstInstinctMeta[] = [
  { id: "rule", survives: false, failureEmoji: "🦊" },
  { id: "memorize", survives: false, failureEmoji: "🐱" },
  { id: "adjust", survives: true },
];

export type DialDirection = "toward-cat" | "toward-dog";
export type Animal = "cat" | "dog";

export type DialExample = {
  id: string;
  emoji: string;
  truth: Animal;
  startLabel: Animal;
  startConfidence: number;
  correctDirection: DialDirection;
  afterCorrectLabel: Animal;
  afterCorrectConfidence: number;
  afterWrongLabel: Animal;
  afterWrongConfidence: number;
};

export const DIAL_EXAMPLES: DialExample[] = [
  {
    id: "cat-90",
    emoji: "🐱",
    truth: "cat",
    startLabel: "dog",
    startConfidence: 90,
    correctDirection: "toward-cat",
    afterCorrectLabel: "dog",
    afterCorrectConfidence: 74,
    afterWrongLabel: "dog",
    afterWrongConfidence: 96,
  },
  {
    id: "dog-82",
    emoji: "🐶",
    truth: "dog",
    startLabel: "cat",
    startConfidence: 82,
    correctDirection: "toward-dog",
    afterCorrectLabel: "cat",
    afterCorrectConfidence: 61,
    afterWrongLabel: "cat",
    afterWrongConfidence: 91,
  },
  {
    id: "cat-55",
    emoji: "🐱",
    truth: "cat",
    startLabel: "cat",
    startConfidence: 55,
    correctDirection: "toward-cat",
    afterCorrectLabel: "cat",
    afterCorrectConfidence: 68,
    afterWrongLabel: "cat",
    afterWrongConfidence: 51,
  },
  {
    id: "dog-71",
    emoji: "🐶",
    truth: "dog",
    startLabel: "cat",
    startConfidence: 71,
    correctDirection: "toward-dog",
    afterCorrectLabel: "cat",
    afterCorrectConfidence: 54,
    afterWrongLabel: "cat",
    afterWrongConfidence: 84,
  },
];

export function dialDelta(example: DialExample, direction: DialDirection) {
  const afterConf =
    direction === example.correctDirection
      ? example.afterCorrectConfidence
      : example.afterWrongConfidence;
  const delta = afterConf - example.startConfidence;
  const abs = Math.abs(delta);
  const signed = delta > 0 ? `+${abs}` : delta < 0 ? `−${abs}` : "0";
  return {
    signed,
    towardTruth: direction === example.correctDirection,
  };
}

export type TrainFlash = {
  id: string;
  examples: number;
  accuracy: number;
  dip?: boolean;
  plateau?: boolean;
};

export const TRAIN_STAGES: TrainFlash[] = [
  { id: "0", examples: 0, accuracy: 50 },
  { id: "1", examples: 1, accuracy: 51 },
  { id: "2", examples: 2, accuracy: 53 },
  { id: "7", examples: 7, accuracy: 63 },
  { id: "14", examples: 14, accuracy: 59, dip: true },
  { id: "100", examples: 100, accuracy: 68 },
  { id: "1000", examples: 1_000, accuracy: 85 },
  { id: "10000", examples: 10_000, accuracy: 94 },
  { id: "100000", examples: 100_000, accuracy: 97 },
  { id: "1000000", examples: 1_000_000, accuracy: 98, plateau: true },
];

export type CurveBetId = "hundred" | "levels" | "bounces";

export type CurveBetMeta = {
  id: CurveBetId;
  borneOut: boolean;
};

export const CURVE_BETS: CurveBetMeta[] = [
  { id: "hundred", borneOut: false },
  { id: "levels", borneOut: true },
  { id: "bounces", borneOut: false },
];

export type LoopCardMeta = {
  id: string;
  order: number | null;
  decoy?: boolean;
};

export const LOOP_CARDS: LoopCardMeta[] = [
  { id: "image", order: 1 },
  { id: "prediction", order: 2 },
  { id: "error", order: 3 },
  { id: "adjust", order: 4 },
  { id: "repeat", order: 5 },
  { id: "add-rule", order: null, decoy: true },
  { id: "memorize", order: null, decoy: true },
];

export const LOOP_REAL_CARDS = LOOP_CARDS.filter((c) => !c.decoy);

export const LOOP_CARDS_SHUFFLED_IDS = [
  "add-rule",
  "adjust",
  "image",
  "memorize",
  "repeat",
  "error",
  "prediction",
] as const;

export const LOOP_SPEED_COUNTS = [10, 1_000, 1_000_000] as const;

export function loopAccuracyForCount(count: number) {
  if (count <= 1) return 52;
  if (count <= 10) return 58;
  if (count <= 1_000) return 85;
  return 98;
}

export const LOOP_CYCLE_FLASH_IDS = ["0", "1", "2", "3", "4"] as const;

export const LABEL_ASK_CHOICES = [
  { id: "humans", correct: false },
  { id: "text", correct: true },
  { id: "none", correct: false },
] as const;

export type NextWordRoundMeta = {
  id: string;
  optionIds: string[];
  answer: string;
  ambiguous?: boolean;
};

export const NEXT_WORD_ROUNDS: NextWordRoundMeta[] = [
  {
    id: "mat",
    optionIds: ["mat", "moon", "idea", "carpet"],
    answer: "mat",
  },
  {
    id: "cup",
    optionIds: ["coffee", "tea", "rain", "code"],
    answer: "coffee",
    ambiguous: true,
  },
  {
    id: "door",
    optionIds: ["door", "cloud", "algorithm", "purple"],
    answer: "door",
  },
];

export const HISTORY_ERA_IDS = ["perceptron", "backprop", "scale"] as const;

export const WEATHER_CHOICES = [
  { id: "rule", correct: false },
  { id: "nudge", correct: true },
  { id: "delete", correct: false },
] as const;

export const CLOSING_TAKEAWAY_IDS = ["t1", "t2", "t3"] as const;
