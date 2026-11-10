import { ANALYTICS_HEARTBEAT_MS } from "@/lib/analytics/config";
import { touchLessonAttempt } from "@/lib/analytics/attempts";
import { touchOpenAttempt } from "@/lib/analytics/openAttempt";
import { touchSession } from "@/lib/analytics/session";

type HeartbeatTarget = {
  sessionId: string;
  attemptId: string | null;
};

export function startLessonHeartbeat(
  getTarget: () => HeartbeatTarget | null,
): () => void {
  if (typeof window === "undefined") return () => {};

  let intervalId: number | null = null;

  const tick = () => {
    if (document.visibilityState !== "visible") return;
    const target = getTarget();
    if (!target) return;

    void touchSession(target.sessionId);
    touchOpenAttempt();
    if (target.attemptId) {
      void touchLessonAttempt(target.attemptId);
    }
  };

  tick();
  intervalId = window.setInterval(tick, ANALYTICS_HEARTBEAT_MS);

  return () => {
    if (intervalId != null) window.clearInterval(intervalId);
  };
}

/** Keeps learning_sessions.last_seen_at fresh outside lesson routes. */
export function startSessionHeartbeat(getSessionId: () => string | null): () => void {
  if (typeof window === "undefined") return () => {};

  let intervalId: number | null = null;

  const tick = () => {
    if (document.visibilityState !== "visible") return;
    const sessionId = getSessionId();
    if (!sessionId) return;
    void touchSession(sessionId);
  };

  tick();
  intervalId = window.setInterval(tick, ANALYTICS_HEARTBEAT_MS);

  return () => {
    if (intervalId != null) window.clearInterval(intervalId);
  };
}

export function flushLessonActivity(
  sessionId: string,
  attemptId: string | null,
): void {
  if (typeof document === "undefined") return;

  void touchSession(sessionId);
  if (attemptId) void touchLessonAttempt(attemptId);
}
