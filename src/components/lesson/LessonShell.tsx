"use client";

import { motion } from "framer-motion";
import { CourseFrame } from "@/components/lesson/CourseFrame";

type LessonShellProps = {
  lessonNumber: number;
  title: string;
  step: number;
  totalSteps: number;
  children: React.ReactNode;
};

export function LessonShell({
  lessonNumber,
  title,
  step,
  totalSteps,
  children,
}: LessonShellProps) {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <CourseFrame currentLesson={lessonNumber}>
      <div className="flex min-h-screen flex-col">
        <header className="lesson-shell-header mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 pb-5 pt-16 sm:px-8 lg:pt-5">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-mute">
              Lesson {lessonNumber} · {title}
            </p>
          </div>
          <div className="w-28 sm:w-40">
            <div className="h-1 w-full overflow-hidden rounded-sm bg-ink/10">
              <motion.div
                className="h-full origin-left bg-accent"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </header>

        <main className="lesson-shell-main mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 pb-10 pt-2 sm:px-8">
          {children}
        </main>
      </div>
    </CourseFrame>
  );
}
