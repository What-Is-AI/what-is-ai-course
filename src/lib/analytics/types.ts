export type CompletionStatus = "started" | "completed" | "abandoned";

export type AnalyticsContextValue = {
  userId: string | null;
  sessionId: string | null;
};

export type TrackAnswerInput = {
  userId: string;
  lessonId: string;
  attemptId: string;
  questionId: string;
  selectedOptionId: string;
  isCorrect?: boolean;
};
