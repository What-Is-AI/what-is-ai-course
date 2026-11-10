"use client";

import { motion } from "framer-motion";
import { CourseFrame } from "@/components/lesson/CourseFrame";
import { StepChrome } from "@/components/lesson/StepChrome";
import { useT } from "@/i18n/LocaleProvider";

type NetworkShellProps = {
  step: number;
  totalSteps: number;
  onPrev?: () => void;
  onNext?: () => void;
  canNext?: boolean;
  children: React.ReactNode;
};

export function NetworkShell({
  step,
  totalSteps,
  onPrev,
  onNext,
  canNext,
  children,
}: NetworkShellProps) {
  const t = useT();
  const progress = ((step + 1) / totalSteps) * 100;
  const showChrome = Boolean(onPrev && onNext);
  const allowNext = canNext ?? step < totalSteps - 1;

  return (
    <CourseFrame currentLesson={5}>
      <div className="network relative min-h-screen overflow-hidden">
        <div aria-hidden className="network-field" />
        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="lesson-shell-header relative z-20 mx-auto flex w-full max-w-5xl items-end justify-between gap-6 px-5 pb-5 pt-16 sm:px-8 lg:pt-8">
            <div className="lesson-shell-brand min-w-0">
              <p className="network-eyebrow">{t("lesson5.shell.eyebrow")}</p>
              <h1 className="network-wordmark mt-2">
                {t("lesson5.shell.wordmark")}
              </h1>
            </div>
            <div className="mb-1 flex shrink-0 items-center gap-3 sm:gap-4">
              {showChrome ? (
                <StepChrome
                  step={step}
                  totalSteps={totalSteps}
                  onPrev={onPrev!}
                  onNext={onNext!}
                  canPrev={step > 0}
                  canNext={allowNext}
                />
              ) : null}
              <div className="w-28 sm:w-40">
                <div
                  className="network-progress"
                  role="progressbar"
                  aria-valuemin={1}
                  aria-valuemax={totalSteps}
                  aria-valuenow={step + 1}
                  aria-label={t("common.progressAria", {
                    step: step + 1,
                    total: totalSteps,
                  })}
                >
                  <motion.div
                    className="network-progress-fill"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
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
