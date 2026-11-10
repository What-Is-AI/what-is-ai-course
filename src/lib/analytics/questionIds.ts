/**
 * Stable question_id for question_answers.
 *
 * Format: `{step}:{objectId}` when the step repeats per content item;
 * `{step}` alone for one-off steps.
 *
 * Never reuse a bare content id (e.g. "autocomplete") across different step types.
 */
export function qid(step: string, objectId?: string): string {
  return objectId ? `${step}:${objectId}` : step;
}

/** Step slug constants — use with qid(step, objectId). */
export const QStep = {
  sortR1: "sort-r1",
  sortR2: "sort-r2",
  era: "era",
  scenario: "scenario",
  approach: "approach",
  detective: "detective",
  instinct: "instinct",
  trust: "trust",
  curveBet: "curve-bet",
  predictedMechanism: "predicted-mechanism",
  prediction: "prediction",
  predictionGuess: "prediction-guess",
  causePick: "cause-pick",
  contextChip: "context-chip",
  contextCard: "context-card",
  approachChoice: "approach-choice",
  transferScore: "transfer-score",
  altitudeChoice: "altitude-choice",
} as const;

const STEP_LABELS: Record<string, string> = {
  "sort-r1": "Sort · round 1",
  "sort-r2": "Sort · round 2",
  era: "Then / Now",
  scenario: "Case study",
  approach: "Which approach",
  detective: "Detective pick",
  instinct: "First instinct",
  trust: "Who to trust",
  "curve-bet": "Curve bet",
  "predicted-mechanism": "Predicted mechanism",
  prediction: "Opening prediction",
  "prediction-guess": "Prediction guess",
  "cause-pick": "Cause pick",
  "context-chip": "Context chip",
  "context-card": "Context card",
  "approach-choice": "Approach choice",
  "transfer-score": "Transfer score",
  "altitude-choice": "Altitude choice",
};

/** Human-readable label for admin dashboards. */
export function formatQuestionLabel(questionId: string): string {
  const colon = questionId.indexOf(":");
  if (colon === -1) {
    return STEP_LABELS[questionId] ?? questionId;
  }
  const step = questionId.slice(0, colon);
  const object = questionId.slice(colon + 1);
  const stepLabel = STEP_LABELS[step] ?? step;
  return `${stepLabel} · ${object}`;
}
