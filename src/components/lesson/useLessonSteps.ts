"use client";

import { useCallback, useState } from "react";

export function useLessonSteps(totalSteps: number) {
  const [step, setStep] = useState(0);

  const next = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const prev = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setStep(Math.max(0, Math.min(index, totalSteps - 1)));
    },
    [totalSteps],
  );

  return {
    step,
    setStep,
    next,
    prev,
    goTo,
    canPrev: step > 0,
    canNext: step < totalSteps - 1,
    totalSteps,
  };
}
