"use client";

import { useEffect, useRef } from "react";

import { useAnalyticsContext } from "@/lib/analytics/context";
import {
  abandonLessonAttempt,
  completeLessonAttempt,
  startLessonAttempt,
} from "@/lib/analytics/attempts";
import { registerAttempt, clearAttempt } from "@/lib/analytics/attemptRegistry";
import { flushLessonActivity, startLessonHeartbeat } from "@/lib/analytics/heartbeat";
import { isAnalyticsConfigured } from "@/lib/analytics/config";
import {
  clearOpenAttempt,
  setOpenAttempt,
  touchOpenAttempt,
} from "@/lib/analytics/openAttempt";
import { fireAndForget } from "@/lib/analytics/safe";

type Options = {
  lessonId: string;
  step: number;
  totalSteps: number;
};

function lessonDoneKey(lessonId: string): string {
  return `what-is-ai:analytics-lesson-done:${lessonId}`;
}

function isLessonDoneInTab(lessonId: string): boolean {
  if (typeof sessionStorage === "undefined") return false;
  try {
    return sessionStorage.getItem(lessonDoneKey(lessonId)) === "1";
  } catch {
    return false;
  }
}

function markLessonDoneInTab(lessonId: string): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(lessonDoneKey(lessonId), "1");
  } catch {
    // ignore private mode
  }
}

function clearLessonDoneInTab(lessonId: string): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.removeItem(lessonDoneKey(lessonId));
  } catch {
    // ignore private mode
  }
}

/**
 * Observes lesson lifecycle for analytics only.
 * Does not modify step state, gates, or lesson behavior.
 */
export function useLessonAnalytics({ lessonId, step, totalSteps }: Options) {
  const { userId, sessionId } = useAnalyticsContext();
  const attemptIdRef = useRef<string | null>(null);
  const completedRef = useRef(false);
  const stepRef = useRef(step);
  const terminalStep = totalSteps - 1;

  stepRef.current = step;

  const maybeComplete = () => {
    if (completedRef.current || !attemptIdRef.current) return;
    if (stepRef.current !== terminalStep) return;
    completedRef.current = true;
    markLessonDoneInTab(lessonId);
    clearOpenAttempt();
    fireAndForget(completeLessonAttempt(attemptIdRef.current));
  };

  useEffect(() => {
    if (!isAnalyticsConfigured() || !userId || !sessionId) return;

    if (stepRef.current === 0) {
      clearLessonDoneInTab(lessonId);
    }

    if (stepRef.current === terminalStep && isLessonDoneInTab(lessonId)) {
      return;
    }

    let cancelled = false;
    completedRef.current = false;
    attemptIdRef.current = null;

    const attemptId = crypto.randomUUID();

    fireAndForget(
      startLessonAttempt(sessionId, userId, lessonId, attemptId).then(() => {
        // Unmounted before insert finished → still abandon so rows don't stick as in-progress.
        if (cancelled) {
          fireAndForget(abandonLessonAttempt(attemptId));
          return;
        }
        attemptIdRef.current = attemptId;
        setOpenAttempt({ attemptId, lessonId, lastSeenAt: Date.now() });
        registerAttempt({ userId, lessonId, attemptId });
        maybeComplete();
      }),
    );

    const stopHeartbeat = startLessonHeartbeat(() => {
      if (!sessionId || !attemptIdRef.current) return null;
      return { sessionId, attemptId: attemptIdRef.current };
    });

    const onPageHide = () => {
      touchOpenAttempt();
      flushLessonActivity(sessionId, attemptIdRef.current);
    };

    window.addEventListener("pagehide", onPageHide);

    return () => {
      cancelled = true;
      stopHeartbeat();
      window.removeEventListener("pagehide", onPageHide);
      clearAttempt(lessonId);

      if (!completedRef.current && attemptIdRef.current) {
        clearOpenAttempt();
        fireAndForget(abandonLessonAttempt(attemptIdRef.current));
      }
    };
  }, [lessonId, sessionId, userId, terminalStep]);

  useEffect(() => {
    if (!isAnalyticsConfigured()) return;
    maybeComplete();
  }, [step, terminalStep]);
}
