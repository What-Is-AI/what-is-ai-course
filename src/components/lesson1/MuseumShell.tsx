"use client";

import { motion } from "framer-motion";
import { CourseFrame } from "@/components/lesson/CourseFrame";
import { StepChrome } from "@/components/lesson/StepChrome";
import { useT } from "@/i18n/LocaleProvider";

type MuseumShellProps = {
  step: number;
  totalSteps: number;
  onPrev?: () => void;
  onNext?: () => void;
  children: React.ReactNode;
};

export function MuseumShell({
  step,
  totalSteps,
  onPrev,
  onNext,
  children,
}: MuseumShellProps) {
  const t = useT();
  const progress = ((step + 1) / totalSteps) * 100;
  const showChrome = Boolean(onPrev && onNext);

  return (
    <CourseFrame currentLesson={1}>
      <div className="museum relative min-h-screen overflow-x-hidden">
        <div aria-hidden className="museum-glow" />
        <div aria-hidden className="museum-floor" />

        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="lesson-shell-header relative z-20 mx-auto flex w-full max-w-5xl items-center justify-end gap-3 px-5 pb-6 pt-16 sm:gap-4 sm:px-8 lg:pt-8">
            <p className="sr-only">
              {t("common.stepOf", { step: step + 1, total: totalSteps })}
            </p>
            {showChrome ? (
              <StepChrome
                step={step}
                totalSteps={totalSteps}
                onPrev={onPrev!}
                onNext={onNext!}
                canPrev={step > 0}
                canNext={step < totalSteps - 1}
              />
            ) : null}
            <div className="w-28 shrink-0 sm:w-36">
              <div
                className="museum-progress"
                role="progressbar"
                aria-valuenow={step + 1}
                aria-valuemin={1}
                aria-valuemax={totalSteps}
                aria-label={t("common.progressAria", {
                  step: step + 1,
                  total: totalSteps,
                })}
              >
                <motion.div
                  className="museum-progress-fill"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          </header>

          <main className="lesson-shell-main mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 pb-14 pt-2 sm:px-8">
            {children}
          </main>
        </div>
      </div>
    </CourseFrame>
  );
}
