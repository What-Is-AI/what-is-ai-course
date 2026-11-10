import { trackAnswer } from "@/lib/analytics/answers";
import { fireAndForget } from "@/lib/analytics/safe";

export type TrackChoiceInput = {
  questionId: string;
  selectedOptionId: string;
  isCorrect?: boolean;
};

type ActiveAttempt = {
  userId: string;
  lessonId: string;
  attemptId: string;
};

let active: ActiveAttempt | null = null;
const pending: TrackChoiceInput[] = [];

export function registerAttempt(value: ActiveAttempt): void {
  active = value;
  flushPending();
}

export function clearAttempt(lessonId: string): void {
  if (active?.lessonId === lessonId) active = null;
  pending.length = 0;
}

function flushPending(): void {
  if (!active || pending.length === 0) return;
  const batch = pending.splice(0, pending.length);
  for (const input of batch) {
    sendChoice(input);
  }
}

function sendChoice(input: TrackChoiceInput): void {
  if (!active) return;
  fireAndForget(
    trackAnswer({
      userId: active.userId,
      lessonId: active.lessonId,
      attemptId: active.attemptId,
      questionId: input.questionId,
      selectedOptionId: input.selectedOptionId,
      isCorrect: input.isCorrect,
    }),
  );
}

/** Fire-and-forget; queues until attempt is registered. */
export function trackChoice(input: TrackChoiceInput): void {
  if (!active) {
    pending.push(input);
    return;
  }
  sendChoice(input);
}
