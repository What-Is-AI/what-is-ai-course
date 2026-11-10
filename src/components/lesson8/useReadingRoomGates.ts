"use client";

import { useCallback, useEffect, useState } from "react";
import type { Lesson8StepId } from "@/lib/lesson8-data";

/**
 * Persist step completion across back-nav so gates don't re-lock.
 * Animation-style gates should call markComplete immediately when reduced-motion is on.
 */
export function useReadingRoomGates(_stepIds: readonly Lesson8StepId[]) {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const isComplete = useCallback(
    (id: Lesson8StepId) => completed.has(id),
    [completed],
  );

  const markComplete = useCallback((id: Lesson8StepId) => {
    setCompleted((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  return {
    isComplete,
    markComplete,
    prefersReducedMotion,
  };
}

export type ReadingRoomGates = ReturnType<typeof useReadingRoomGates>;
