"use client";

import { motion } from "framer-motion";
import { CourseFrame } from "@/components/lesson/CourseFrame";
import { StepChrome } from "@/components/lesson/StepChrome";
import { useT } from "@/i18n/LocaleProvider";

type ConnectedOfficeShellProps = {
  step: number;
  totalSteps: number;
  onPrev?: () => void;
  onNext?: () => void;
  canNext?: boolean;
  mood?: "open" | "sting" | "sober" | "morning";
  children: React.ReactNode;
};

export function ConnectedOfficeShell({
  step,
  totalSteps,
  onPrev,
  onNext,
  canNext,
  mood = "open",
  children,
}: ConnectedOfficeShellProps) {
  const t = useT();
  const progress = ((step + 1) / totalSteps) * 100;
  const showChrome = Boolean(onPrev && onNext);
  const allowNext = canNext ?? step < totalSteps - 1;
  const moodClass =
    mood === "sting"
      ? " connected-mood-sting"
      : mood === "sober"
        ? " connected-mood-sober"
        : mood === "morning"
          ? " connected-mood-morning"
          : "";

  return (
    <CourseFrame currentLesson="just-because-it-can">
      <div className={`connected-office relative min-h-screen overflow-hidden${moodClass}`}>
        <div aria-hidden className="connected-office-wash" />
        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="lesson-shell-header relative z-20 mx-auto flex w-full max-w-5xl items-end justify-between gap-6 px-5 pb-5 pt-16 sm:px-8 lg:pt-8">
            <div className="lesson-shell-brand min-w-0">
              <p className="connected-eyebrow">
                {t("practical1.shell.eyebrow")}
              </p>
              <h1 className="connected-wordmark mt-2">
                {t("practical1.shell.wordmark")}
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
                  className="connected-progress"
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
                    className="connected-progress-fill"
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
