export { trackChoice } from "@/lib/analytics/attemptRegistry";
export type { TrackChoiceInput } from "@/lib/analytics/attemptRegistry";
export { trackAnswer } from "@/lib/analytics/answers";
export {
  abandonLessonAttempt,
  completeLessonAttempt,
  startLessonAttempt,
  touchLessonAttempt,
} from "@/lib/analytics/attempts";
export { isAnalyticsConfigured } from "@/lib/analytics/config";
export { getOrCreateUserId } from "@/lib/analytics/identity";
export { ensureSession, endSession, touchSession } from "@/lib/analytics/session";
export { submitFeedback, type FeedbackKind } from "@/lib/analytics/feedback";
