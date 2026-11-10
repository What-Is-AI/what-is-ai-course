import { getAnalyticsClient } from "@/lib/analytics/client";
import type { TrackAnswerInput } from "@/lib/analytics/types";

export async function trackAnswer(input: TrackAnswerInput): Promise<void> {
  const supabase = getAnalyticsClient();
  if (!supabase) return;

  const { error } = await supabase.from("question_answers").insert({
    attempt_id: input.attemptId,
    user_id: input.userId,
    lesson_id: input.lessonId,
    question_id: input.questionId,
    selected_option_id: input.selectedOptionId,
    is_correct: input.isCorrect ?? null,
    answered_at: new Date().toISOString(),
  });

  if (error) throw error;
}
