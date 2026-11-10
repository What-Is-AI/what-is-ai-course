"use client";

import { motion } from "framer-motion";

type StepFrameProps = {
  children: React.ReactNode;
  className?: string;
};

export function StepFrame({ children, className = "" }: StepFrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-1 flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function LessonTitle({
  eyebrow,
  children,
}: {
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="lesson-heading mb-8 max-w-3xl">
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-display text-2xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl">
        {children}
      </h1>
    </div>
  );
}

export function LessonLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">
      {children}
    </p>
  );
}
