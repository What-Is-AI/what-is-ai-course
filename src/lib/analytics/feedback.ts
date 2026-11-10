import { getAnalyticsClient } from "@/lib/analytics/client";
import { isAnalyticsConfigured } from "@/lib/analytics/config";
import { ensureAnonymousUser } from "@/lib/analytics/identity";

export type FeedbackKind = "feedback" | "request";

export type SubmitFeedbackInput = {
  userId: string;
  kind: FeedbackKind;
  message: string;
  pagePath?: string | null;
  lessonId?: string | null;
};

const MIN_MESSAGE = 3;
const MAX_MESSAGE = 2000;
const COOLDOWN_MS = 30_000;
const COOLDOWN_KEY = "analytics-feedback-last-sent";

export function normalizeFeedbackMessage(message: string): string {
  return message.trim().slice(0, MAX_MESSAGE);
}

export function validateFeedbackMessage(message: string): string | null {
  const trimmed = normalizeFeedbackMessage(message);
  if (trimmed.length < MIN_MESSAGE) return `Please write at least ${MIN_MESSAGE} characters.`;
  return null;
}

export function canSubmitFeedbackNow(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const last = window.localStorage.getItem("what-is-ai:" + COOLDOWN_KEY);
    if (!last) return true;
    return Date.now() - Number(last) > COOLDOWN_MS;
  } catch {
    return true;
  }
}

function markFeedbackSent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("what-is-ai:" + COOLDOWN_KEY, String(Date.now()));
  } catch {
    // ignore private mode
  }
}

export async function submitFeedback(input: SubmitFeedbackInput): Promise<void> {
  if (!isAnalyticsConfigured()) {
    throw new Error("Feedback is not available right now.");
  }

  const message = normalizeFeedbackMessage(input.message);
  const validationError = validateFeedbackMessage(message);
  if (validationError) throw new Error(validationError);

  if (!canSubmitFeedbackNow()) {
    throw new Error("Please wait a moment before sending another message.");
  }

  const supabase = getAnalyticsClient();
  if (!supabase) throw new Error("Feedback is not available right now.");

  await ensureAnonymousUser(input.userId);

  const { error } = await supabase.from("user_feedback").insert({
    user_id: input.userId,
    kind: input.kind,
    message,
    page_path: input.pagePath ?? null,
    lesson_id: input.lessonId ?? null,
  });

  if (error) throw error;
  markFeedbackSent();
}
