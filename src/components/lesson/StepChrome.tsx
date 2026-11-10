"use client";

import { useT } from "@/i18n/LocaleProvider";

type StepChromeProps = {
  step: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
};

export function StepChrome({
  step,
  totalSteps,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: StepChromeProps) {
  const t = useT();

  return (
    <div
      className="step-chrome"
      role="navigation"
      aria-label={t("common.stepsNavAria", {
        step: step + 1,
        total: totalSteps,
      })}
    >
      <button
        type="button"
        className="step-chrome-btn"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label={t("common.prevStep")}
      >
        <span aria-hidden>‹</span>
      </button>
      <button
        type="button"
        className="step-chrome-btn"
        onClick={onNext}
        disabled={!canNext}
        aria-label={t("common.nextStep")}
      >
        <span aria-hidden>›</span>
      </button>
    </div>
  );
}
