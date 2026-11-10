/** Source of truth for Lesson 8 – Transformers. Copy mirrors docs/lesson8-script.md */

export const DEFAULT_CTA = "Continue →";

export const LESSON8_META = {
  world: "The Reading Room",
  title: "Transformers",
  shortTitle: "Transformers",
  mystery: "What if each word could look directly at the words it needs?",
} as const;

/**
 * Experience step ids — must match docs/lesson8-impl.md step map
 * and docs/lesson8-script.md part order.
 */
export const LESSON8_STEP_IDS = [
  "opening",
  "telephone",
  "connections",
  "paper",
  "soft-lookup",
  "order",
  "stack",
  "hide-future",
  "multi-head",
  "why-mattered",
  "next-token",
  "challenge",
  "reflection",
  "closing",
] as const;

export type Lesson8StepId = (typeof LESSON8_STEP_IDS)[number];

/** Honesty line for canned attention / probability numbers (script lock). */
export const ILLUSTRATIVE_NUMBERS_NOTE =
  "These numbers are illustrative, chosen to show the idea clearly, not output from a running model.";

/** Canonical passage for the living-page spine. */
export const CANONICAL_SENTENCE =
  "The animal wouldn't cross the road because it was too busy.";

export type WordToken = {
  id: string;
  text: string;
};

export type AttentionLink = {
  /** Word drawing information (often the focus / query side). */
  fromId: string;
  /** Word being attended to. */
  toId: string;
  /** Illustrative strength in [0, 1]. */
  strength: number;
};

/** Split a passage into operable word tokens (punctuation stays on the word). */
export function tokenizePassage(text: string): WordToken[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => ({
      id: `w${index}`,
      text: word,
    }));
}

export const CANONICAL_WORDS = tokenizePassage(CANONICAL_SENTENCE);

function normalizeToken(text: string): string {
  return text.replace(/[^\w']/g, "").toLowerCase();
}

/** Id of “it” in the canonical sentence (for focus defaults). */
export const CANONICAL_IT_ID =
  CANONICAL_WORDS.find((w) => normalizeToken(w.text) === "it")?.id ?? "w7";

export function wordIdByNormalized(
  words: readonly WordToken[],
  label: string,
): string {
  return (
    words.find((w) => normalizeToken(w.text) === label)?.id ?? label
  );
}

/** Demo illustrative links for chrome / later steps (scripted, not a model). */
export const DEMO_ATTENTION_LINKS: AttentionLink[] = [
  {
    fromId: CANONICAL_IT_ID,
    toId: wordIdByNormalized(CANONICAL_WORDS, "animal"),
    strength: 0.82,
  },
  {
    fromId: CANONICAL_IT_ID,
    toId: wordIdByNormalized(CANONICAL_WORDS, "road"),
    strength: 0.41,
  },
  {
    fromId: CANONICAL_IT_ID,
    toId: wordIdByNormalized(CANONICAL_WORDS, "busy"),
    strength: 0.09,
  },
];

/* ── Telephone Game (scripted hops — learner advances only) ── */

export type HandoffKind = "kept" | "lost" | "changed";

export type TelephoneHop = {
  word: string;
  /** Message payload after this handoff. */
  message: string;
  kind: HandoffKind;
  note: string;
};

export type TelephoneChain = {
  id: "short" | "long";
  label: string;
  hops: readonly TelephoneHop[];
};

/** Short chain: reference mostly survives. */
export const TELEPHONE_SHORT: TelephoneChain = {
  id: "short",
  label: "Short sentence",
  hops: [
    {
      word: "animal",
      message: "referent: animal",
      kind: "kept",
      note: "Message starts at the early noun.",
    },
    {
      word: "wouldn't",
      message: "referent: animal",
      kind: "kept",
      note: "Handoff keeps the important part.",
    },
    {
      word: "cross",
      message: "referent: animal",
      kind: "kept",
      note: "Still intact after a few steps.",
    },
    {
      word: "the",
      message: "referent: anim…",
      kind: "lost",
      note: "A little detail frays.",
    },
    {
      word: "road",
      message: "referent: animal?",
      kind: "changed",
      note: "Slight uncertainty creeps in.",
    },
    {
      word: "because",
      message: "referent: animal?",
      kind: "kept",
      note: "Carried forward as-is.",
    },
    {
      word: "it",
      message: "referent: animal?",
      kind: "kept",
      note: "Arrives — usable, with a little doubt.",
    },
  ],
};

/** Long chain: same idea, forced garble after many hops. */
export const TELEPHONE_LONG: TelephoneChain = {
  id: "long",
  label: "Longer sentence",
  hops: [
    {
      word: "animal",
      message: "referent: animal",
      kind: "kept",
      note: "Same starting reference.",
    },
    {
      word: "wouldn't",
      message: "referent: animal",
      kind: "kept",
      note: "Early hops still clean.",
    },
    {
      word: "cross",
      message: "referent: animal",
      kind: "kept",
      note: "Still clear.",
    },
    {
      word: "the",
      message: "referent: anim…",
      kind: "lost",
      note: "Detail starts to thin.",
    },
    {
      word: "busy",
      message: "referent: road??",
      kind: "changed",
      note: "A nearby word contaminates the payload.",
    },
    {
      word: "traffic",
      message: "ref: tr… / an…",
      kind: "lost",
      note: "More steps, more loss.",
    },
    {
      word: "evening",
      message: "ref: ???",
      kind: "lost",
      note: "The referent is nearly gone.",
    },
    {
      word: "commute",
      message: "something was… busy?",
      kind: "changed",
      note: "Message drifts further.",
    },
    {
      word: "because",
      message: "busy? road? animal?",
      kind: "changed",
      note: "Confusion compounds.",
    },
    {
      word: "it",
      message: "??? (garbled)",
      kind: "lost",
      note: "Arrives — but garbled after every step in between.",
    },
  ],
};

export const TELEPHONE_CHAINS = [TELEPHONE_SHORT, TELEPHONE_LONG] as const;

/* ── Soft lookup (illustrative drawers) ── */

export type LookupDrawer = {
  id: string;
  keyLabel: string;
  valueLabel: string;
  /** Default illustrative match score 0–1. */
  match: number;
};

export const LOOKUP_DRAWERS: readonly LookupDrawer[] = [
  {
    id: "animal",
    keyLabel: "animal",
    valueLabel: "early noun · possible referent",
    match: 0.82,
  },
  {
    id: "road",
    keyLabel: "road",
    valueLabel: "place being crossed",
    match: 0.41,
  },
  {
    id: "busy",
    keyLabel: "busy",
    valueLabel: "property stated later",
    match: 0.09,
  },
];

export const LOOKUP_QUERY = "What helps explain what “it” refers to?";

/** Softmax-style weights from raw match scores (illustrative). */
export function normalizeWeights(scores: number[]): number[] {
  const clipped = scores.map((s) => Math.max(0.01, Math.min(1, s)));
  const exps = clipped.map((s) => Math.exp(s * 3));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

/* ── Order (physical reorder) ── */

export const ORDER_ORIGINAL = "The dog bit the man.";
export const ORDER_SHUFFLED = "The man bit the dog.";

export const ORDER_ORIGINAL_WORDS = tokenizePassage(ORDER_ORIGINAL);
export const ORDER_SHUFFLED_WORDS = tokenizePassage(ORDER_SHUFFLED);

/* ── Hide the future (causal mask) ── */

export const HIDE_CONTEXT_SENTENCE =
  "The animal wouldn't cross the road because";

export const HIDE_CONTEXT_WORDS = tokenizePassage(HIDE_CONTEXT_SENTENCE);

/** Predict position = last available word (“because”). */
export const HIDE_FOCUS_ID =
  HIDE_CONTEXT_WORDS[HIDE_CONTEXT_WORDS.length - 1]?.id ?? "w6";

/** Illustrative attention from “because” to earlier context only. */
export const HIDE_ATTENTION_LINKS: AttentionLink[] = [
  {
    fromId: HIDE_FOCUS_ID,
    toId: wordIdByNormalized(HIDE_CONTEXT_WORDS, "animal"),
    strength: 0.55,
  },
  {
    fromId: HIDE_FOCUS_ID,
    toId: wordIdByNormalized(HIDE_CONTEXT_WORDS, "road"),
    strength: 0.72,
  },
  {
    fromId: HIDE_FOCUS_ID,
    toId: wordIdByNormalized(HIDE_CONTEXT_WORDS, "wouldn't"),
    strength: 0.28,
  },
  {
    fromId: HIDE_FOCUS_ID,
    toId: HIDE_FOCUS_ID,
    strength: 0.35,
  },
];

export const HIDE_FUTURE_WORD = "it";

/** Allowed attend-to range for each position (causal). */
export function causalAllowedLabel(
  words: readonly WordToken[],
  index: number,
  noneLabel = "(none)",
): string {
  const allowed = words
    .slice(0, index + 1)
    .map((w) => w.text)
    .join(" · ");
  return allowed || noneLabel;
}

/* ── Multi-head (illustrative alternate patterns) ── */

export const HEAD_A_LINKS: AttentionLink[] = [
  {
    fromId: CANONICAL_IT_ID,
    toId: wordIdByNormalized(CANONICAL_WORDS, "animal"),
    strength: 0.88,
  },
  {
    fromId: CANONICAL_IT_ID,
    toId: wordIdByNormalized(CANONICAL_WORDS, "road"),
    strength: 0.22,
  },
];

export const HEAD_B_LINKS: AttentionLink[] = [
  {
    fromId: CANONICAL_IT_ID,
    toId: wordIdByNormalized(CANONICAL_WORDS, "road"),
    strength: 0.75,
  },
  {
    fromId: CANONICAL_IT_ID,
    toId: wordIdByNormalized(CANONICAL_WORDS, "busy"),
    strength: 0.48,
  },
  {
    fromId: CANONICAL_IT_ID,
    toId: wordIdByNormalized(CANONICAL_WORDS, "animal"),
    strength: 0.18,
  },
];

/* ── Next-token experiment (scripted candidates) ── */

export type NextTokenCandidate = {
  token: string;
  /** Illustrative probability 0–1. */
  p: number;
};

export type NextTokenRound = {
  id: string;
  /** Context words available when predicting. */
  context: string;
  attention: AttentionLink[];
  candidates: readonly NextTokenCandidate[];
};

function linksForContext(
  words: readonly WordToken[],
  focusId: string,
  pairs: { to: string; strength: number }[],
): AttentionLink[] {
  return pairs.map(({ to, strength }) => ({
    fromId: focusId,
    toId: to === "__self__" ? focusId : wordIdByNormalized(words, to),
    strength,
  }));
}

const ROUND1_WORDS = tokenizePassage(
  "The animal wouldn't cross the road because",
);
const ROUND1_FOCUS = ROUND1_WORDS[ROUND1_WORDS.length - 1]!.id;

const ROUND2_WORDS = tokenizePassage(
  "The animal wouldn't cross the road because it",
);
const ROUND2_FOCUS = ROUND2_WORDS[ROUND2_WORDS.length - 1]!.id;

export const NEXT_TOKEN_ROUNDS: readonly NextTokenRound[] = [
  {
    id: "r1",
    context: "The animal wouldn't cross the road because",
    attention: linksForContext(ROUND1_WORDS, ROUND1_FOCUS, [
      { to: "road", strength: 0.72 },
      { to: "animal", strength: 0.48 },
      { to: "wouldn't", strength: 0.22 },
      { to: "__self__", strength: 0.3 },
    ]),
    candidates: [
      { token: "it", p: 0.34 },
      { token: "the", p: 0.18 },
      { token: "traffic", p: 0.11 },
      { token: "he", p: 0.09 },
      { token: "they", p: 0.07 },
    ],
  },
  {
    id: "r2",
    context: "The animal wouldn't cross the road because it",
    attention: linksForContext(ROUND2_WORDS, ROUND2_FOCUS, [
      { to: "animal", strength: 0.8 },
      { to: "road", strength: 0.35 },
      { to: "because", strength: 0.25 },
      { to: "__self__", strength: 0.28 },
    ]),
    candidates: [
      { token: "was", p: 0.41 },
      { token: "is", p: 0.12 },
      { token: "had", p: 0.1 },
      { token: "felt", p: 0.08 },
      { token: "saw", p: 0.06 },
    ],
  },
];

export function wordsForContext(context: string): WordToken[] {
  return tokenizePassage(context);
}

export function focusIdForContext(context: string): string {
  const words = tokenizePassage(context);
  return words[words.length - 1]?.id ?? "w0";
}

/* ── Final challenge ── */

export type ChallengeOption = {
  id: "A" | "B" | "C" | "D";
  text: string;
};

export type ChallengeQuestion = {
  id: string;
  prompt: string;
  options: readonly ChallengeOption[];
  correctId: ChallengeOption["id"];
  correctFeedback: string;
  wrongFeedback: string;
};

export const CHALLENGE_QUESTIONS: readonly ChallengeQuestion[] = [
  {
    id: "q1",
    prompt:
      "A Transformer differs from a step-by-step recurrent model mainly because:",
    options: [
      { id: "A", text: "It stores every sentence it has ever seen." },
      {
        id: "B",
        text: "It lets positions exchange information directly through attention.",
      },
      { id: "C", text: "It uses no learned parameters." },
      { id: "D", text: "It reads only one word in a sentence." },
    ],
    correctId: "B",
    correctFeedback:
      "A Transformer lets positions exchange information directly through attention, instead of carrying it step by step through every word in between.",
    wrongFeedback:
      "Not quite. A Transformer’s advantage is connecting positions directly — it doesn’t store every sentence, it does use learned parameters, and it works with the whole sequence, not one word.",
  },
  {
    id: "q2",
    prompt: "What does attention do?",
    options: [
      { id: "A", text: "Gives every word the same amount of information." },
      { id: "B", text: "Chooses one word and ignores the rest." },
      {
        id: "C",
        text: "Weighs information from other positions and combines it.",
      },
      { id: "D", text: "Converts words directly into facts." },
    ],
    correctId: "C",
    correctFeedback:
      "Attention gives different amounts of weight to information from other positions and combines those contributions.",
    wrongFeedback:
      "Not quite. Attention does not simply pick one word. It assigns weights to information from multiple positions and combines them.",
  },
  {
    id: "q3",
    prompt: "Why does a Transformer need positional information?",
    options: [
      {
        id: "A",
        text: "Attention by itself does not tell the model where a position occurs in the sequence.",
      },
      { id: "B", text: "It prevents the model from learning weights." },
      { id: "C", text: "It replaces the need for training data." },
      { id: "D", text: "It makes every token mean the same thing." },
    ],
    correctId: "A",
    correctFeedback:
      "Attention captures relationships between positions but not where each one sits in the sequence — positional information supplies that order.",
    wrongFeedback:
      "Not quite. Positional information exists because attention on its own is order-blind; it doesn’t block learning weights or replace training data.",
  },
  {
    id: "q4",
    prompt: "During next-token prediction, what can a position attend to?",
    options: [
      { id: "A", text: "Only future tokens." },
      {
        id: "B",
        text: "Earlier available tokens, not tokens that have not appeared yet.",
      },
      { id: "C", text: "Every token in the completed answer." },
      { id: "D", text: "Only the immediately previous token." },
    ],
    correctId: "B",
    correctFeedback:
      "For next-token prediction, a position can use earlier available tokens, not tokens that have not appeared yet. The future is masked out so the model cannot use the answer it is supposed to predict.",
    wrongFeedback:
      "Not quite. A next-token model cannot use tokens that have not appeared yet. Its attention is causally masked.",
  },
  {
    id: "q5",
    prompt: "What is the main idea behind multi-head attention?",
    options: [
      {
        id: "A",
        text: "Several learned attention patterns can operate on the same sequence.",
      },
      {
        id: "B",
        text: "The model uses several unrelated models with no shared input.",
      },
      {
        id: "C",
        text: "Every head is manually assigned a grammar rule.",
      },
      {
        id: "D",
        text: "More heads remove the need for positional information.",
      },
    ],
    correctId: "A",
    correctFeedback:
      "Multiple attention heads let the model learn several attention patterns over the same sequence. The heads are learned rather than manually assigned specific jobs.",
    wrongFeedback:
      "Not quite. The heads are not manually assigned jobs. They can learn different relationships from the data.",
  },
];
