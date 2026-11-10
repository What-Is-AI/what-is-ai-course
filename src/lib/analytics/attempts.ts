import { getAnalyticsClient } from "@/lib/analytics/client";
import type { CompletionStatus } from "@/lib/analytics/types";

export async function startLessonAttempt(
  sessionId: string,
  userId: string,
  lessonId: string,
  attemptId: string,
): Promise<void> {
  const supabase = getAnalyticsClient();
  if (!supabase) return;

  const now = new Date().toISOString();

  const { error } = await supabase.from("lesson_attempts").insert({
    attempt_id: attemptId,
    session_id: sessionId,
    user_id: userId,
    lesson_id: lessonId,
    started_at: now,
    last_seen_at: now,
    completion_status: "started" satisfies CompletionStatus,
  });

  if (error) throw error;
}

export async function touchLessonAttempt(attemptId: string): Promise<void> {
  const supabase = getAnalyticsClient();
  if (!supabase) return;

  const { error } = await supabase.rpc("touch_lesson_attempt", {
    p_attempt_id: attemptId,
  });
  if (error) throw error;
}

export async function completeLessonAttempt(attemptId: string): Promise<void> {
  const supabase = getAnalyticsClient();
  if (!supabase) return;

  const { error } = await supabase.rpc("complete_lesson_attempt", {
    p_attempt_id: attemptId,
  });
  if (error) throw error;
}

export async function abandonLessonAttempt(attemptId: string): Promise<void> {
  const supabase = getAnalyticsClient();
  if (!supabase) return;

  // RPC no-ops if already completed — no SELECT needed (anon has no SELECT).
  const { error } = await supabase.rpc("abandon_lesson_attempt", {
    p_attempt_id: attemptId,
  });
  if (error) throw error;
}
