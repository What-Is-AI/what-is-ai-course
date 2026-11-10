import { ANALYTICS_ABANDON_MS } from "@/lib/analytics/config";
import { abandonLessonAttempt } from "@/lib/analytics/attempts";
import { loadLocal, saveLocal } from "@/lib/storage";

const OPEN_ATTEMPT_KEY = "analytics-open-attempt";

export type OpenAttemptRecord = {
  attemptId: string;
  lessonId: string;
  lastSeenAt: number;
};

export function getOpenAttempt(): OpenAttemptRecord | null {
  return loadLocal<OpenAttemptRecord | null>(OPEN_ATTEMPT_KEY, null);
}

export function setOpenAttempt(record: OpenAttemptRecord): void {
  saveLocal(OPEN_ATTEMPT_KEY, record);
}

export function touchOpenAttempt(): void {
  const open = getOpenAttempt();
  if (!open) return;
  saveLocal(OPEN_ATTEMPT_KEY, { ...open, lastSeenAt: Date.now() });
}

export function clearOpenAttempt(): void {
  saveLocal(OPEN_ATTEMPT_KEY, null);
}

export async function abandonStaleOpenAttempt(): Promise<void> {
  const open = getOpenAttempt();
  if (!open) return;
  if (Date.now() - open.lastSeenAt <= ANALYTICS_ABANDON_MS) return;

  await abandonLessonAttempt(open.attemptId);
  clearOpenAttempt();
}
