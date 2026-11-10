"use client";

import { motion } from "framer-motion";
import { CourseFrame } from "@/components/lesson/CourseFrame";
import { StepChrome } from "@/components/lesson/StepChrome";
import { useT } from "@/i18n/LocaleProvider";

type StudioShellProps = {
  step: number;
  totalSteps: number;
  onPrev?: () => void;
  onNext?: () => void;
  children: React.ReactNode;
};

export function StudioShell({
  step,
  totalSteps,
  onPrev,
  onNext,
  children,
}: StudioShellProps) {
  const t = useT();
  const progress = ((step + 1) / totalSteps) * 100;
  const showChrome = Boolean(onPrev && onNext);

  return (
    <CourseFrame currentLesson="working-with-llms">
      <div className="studio relative min-h-screen overflow-hidden">
        <div aria-hidden className="studio-glow" />
        <div aria-hidden className="studio-grain" />

        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="lesson-shell-header relative z-20 mx-auto flex w-full max-w-5xl items-end justify-between gap-6 px-5 pb-5 pt-16 sm:px-8 lg:pt-8">
            <div className="lesson-shell-brand min-w-0">
              <p className="studio-eyebrow">{t("workingWithLlms.shell.eyebrow")}</p>
              <h1 className="studio-wordmark mt-2">
                {t("workingWithLlms.shell.wordmark")}
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
                  canNext={step < totalSteps - 1}
                />
              ) : null}
              <div className="w-28 sm:w-40">
                <div className="studio-progress">
                  <motion.div
                    className="studio-progress-fill"
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
