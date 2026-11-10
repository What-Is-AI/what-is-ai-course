/** Structure/ids for Just Because It Can – copy mirrors docs/connectors-script.md */

export const ACCESS_SCOPE_IDS = [
  "email",
  "files",
  "calendar",
  "invoices",
] as const;

export type AccessScopeId = (typeof ACCESS_SCOPE_IDS)[number];

export const PREDICTION_CHOICE_IDS = [
  "yes_access",
  "depends_sensitive",
  "not_sure",
] as const;

export type PredictionChoiceId = (typeof PREDICTION_CHOICE_IDS)[number];

export const GUT_BUCKET_IDS = ["yes", "no", "not_sure"] as const;
export type GutBucketId = (typeof GUT_BUCKET_IDS)[number];

export const GATE_VERDICT_IDS = ["cleared", "blocked", "depends"] as const;
export type GateVerdictId = (typeof GATE_VERDICT_IDS)[number];

export const SORT_CARD_IDS = [
  "press_release",
  "roadmap",
  "employee_records",
  "customer_emails",
  "invoices",
  "sick_leave",
  "own_notes",
] as const;

export type SortCardId = (typeof SORT_CARD_IDS)[number];

/** Anchor cards always re-opened in Round 2. */
export const ROUND2_ANCHOR_IDS: readonly SortCardId[] = [
  "press_release",
  "customer_emails",
  "invoices",
] as const;

/** Gate answers assuming an organization-approved assistant. */
export const GATE_ANSWERS: Record<
  SortCardId,
  { verdict: GateVerdictId; decidingKey: string }
> = {
  press_release: { verdict: "depends", decidingKey: "q3" },
  roadmap: { verdict: "depends", decidingKey: "q3q4" },
  employee_records: { verdict: "blocked", decidingKey: "q2q4" },
  customer_emails: { verdict: "cleared", decidingKey: "q3q4" },
  invoices: { verdict: "depends", decidingKey: "q4" },
  sick_leave: { verdict: "blocked", decidingKey: "q2q4" },
  own_notes: { verdict: "cleared", decidingKey: "all" },
};

/**
 * Gut → gate match table. Not sure never matches Depends (or anything).
 */
export function gutMatchesGate(
  gut: GutBucketId,
  verdict: GateVerdictId,
): boolean {
  if (gut === "not_sure") return false;
  if (gut === "yes") return verdict === "cleared";
  if (gut === "no") return verdict === "blocked";
  return false;
}

/** Cards to actively re-sort in Round 2 (anchor ∪ divergences). */
export function round2ReopenIds(
  gutPlacements: Partial<Record<SortCardId, GutBucketId>>,
): SortCardId[] {
  const reopen = new Set<SortCardId>(ROUND2_ANCHOR_IDS);
  for (const id of SORT_CARD_IDS) {
    const gut = gutPlacements[id];
    if (!gut) {
      reopen.add(id);
      continue;
    }
    if (!gutMatchesGate(gut, GATE_ANSWERS[id].verdict)) {
      reopen.add(id);
    }
  }
  return SORT_CARD_IDS.filter((id) => reopen.has(id));
}

export function round2AutoResolvedIds(
  gutPlacements: Partial<Record<SortCardId, GutBucketId>>,
): SortCardId[] {
  const reopen = new Set(round2ReopenIds(gutPlacements));
  return SORT_CARD_IDS.filter((id) => !reopen.has(id));
}

export const GATE_QUESTION_IDS = ["q1", "q2", "q3", "q4"] as const;
export type GateQuestionId = (typeof GATE_QUESTION_IDS)[number];

/** Which gate questions the Round 2 tip points at for each card. */
export const DECIDING_QUESTION_IDS: Record<
  string,
  readonly GateQuestionId[]
> = {
  q3: ["q3"],
  q3q4: ["q3", "q4"],
  q2q4: ["q2", "q4"],
  q4: ["q4"],
  all: ["q1", "q2", "q3", "q4"],
};

export const PRINCIPLE_BODY_IDS = ["b1", "b2", "b3"] as const;

export const GO_DEEPER_BODY_IDS = ["d1", "d2", "d3", "d4"] as const;

export const SANDBOX_SET_IDS = ["inbox", "drive", "calendar"] as const;

export const REFLECTION_PROMPT_IDS = ["task", "gate"] as const;

export const TRANSFER_CHOICE_IDS = ["yes_opened", "no_tells_nothing"] as const;
export type TransferChoiceId = (typeof TRANSFER_CHOICE_IDS)[number];

export const PRACTICAL1_CLOSING_PHASES = ["forward"] as const;
export type Practical1ClosingPhase = (typeof PRACTICAL1_CLOSING_PHASES)[number];
