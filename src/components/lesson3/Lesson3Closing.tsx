"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  LibraryContinue,
  LibraryFrame,
  LibraryLine,
  LibraryTitle,
} from "@/components/lesson3/LibraryFrame";
import { useLesson3Copy } from "@/lib/useLesson3Copy";
import { useT } from "@/i18n/LocaleProvider";

/** Log-scale corpus sizes – each step ≈100× more text. */
function CorpusScaleChart() {
  const { t, corpusBars } = useLesson3Copy();
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="img"
      aria-labelledby="corpus-scale-title"
      aria-describedby="corpus-scale-desc"
      className="w-full"
    >
      <p id="corpus-scale-title" className="sr-only">
        {t("lesson3.closing.corpus.chart.ariaTitle")}
      </p>
      <p id="corpus-scale-desc" className="sr-only">
        {t("lesson3.closing.corpus.chart.ariaDesc")}
      </p>

      <div className="flex items-end justify-between gap-4">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[#9aa3ad] sm:text-xs">
          {t("lesson3.closing.corpus.chart.axis")}
        </p>
        <p
          className="hidden shrink-0 font-[family-name:var(--font-figtree)] text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[#6b7580] sm:block"
          aria-hidden
        >
          {t("lesson3.closing.corpus.chart.logScale")}
        </p>
      </div>

      <ul className="mt-6 space-y-6" aria-hidden>
        {corpusBars.map((bar, i) => (
          <motion.li
            key={bar.id}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.08 + i * 0.12,
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-[family-name:var(--font-library)] text-sm font-semibold tracking-tight text-[#f3f1ea] sm:text-base">
                {bar.label}
              </p>
            </div>
            <div className="relative mt-2.5 h-3.5 w-full overflow-hidden rounded-sm bg-white/[0.07] sm:h-4">
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent 0, transparent calc(25% - 1px), rgba(255,255,255,0.08) calc(25% - 1px), rgba(255,255,255,0.08) 25%)",
                }}
              />
              <motion.div
                className="relative flex h-full items-center justify-end overflow-hidden rounded-sm px-2.5"
                style={{ background: bar.fill }}
                initial={reduceMotion ? false : { width: 0 }}
                animate={{ width: `${bar.widthPct}%` }}
                transition={{
                  delay: reduceMotion ? 0 : 0.18 + i * 0.14,
                  duration: reduceMotion ? 0 : 0.85,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {bar.inside ? (
                  <motion.span
                    className="truncate text-[0.65rem] font-semibold tracking-wide text-white/95 sm:text-[0.7rem]"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: reduceMotion ? 0 : 0.95,
                      duration: 0.35,
                    }}
                  >
                    {bar.inside}
                  </motion.span>
                ) : null}
              </motion.div>
            </div>
            {bar.note ? (
              <p className="mt-1.5 text-xs leading-snug text-[#8b949e] sm:text-sm">
                {bar.note}
              </p>
            ) : null}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/** Training Facility preview – books settle, a status wall lights up. */
function FacilityPreview() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 80% 0%, rgba(47, 158, 143, 0.14), transparent 55%), linear-gradient(165deg, #1a1f27 0%, #14181e 45%, #0c0e12 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(230, 234, 238, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(230, 234, 238, 0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
        }}
      />
    </motion.div>
  );
}

function TrainingWallDisplay() {
  const t = useT();
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-sm shrink-0 overflow-hidden rounded-sm border border-[rgba(47,158,143,0.28)] bg-[#0a0d11] shadow-[0_24px_56px_rgba(0,0,0,0.45)]"
    >
      <div className="px-5 py-5 sm:px-6">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full bg-[#2f9e8f]"
            style={{ boxShadow: "0 0 8px rgba(47, 158, 143, 0.45)" }}
          />
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#2f9e8f]">
            {t("lesson3.closing.mystery.wallEyebrow")}
          </p>
        </div>
        <dl className="mt-5 grid gap-3 text-sm text-[#e6eaee]">
          <div className="flex items-baseline justify-between gap-4 border-b border-[rgba(230,234,238,0.12)] pb-2">
            <dt className="text-[#6b7683]">{t("lesson3.closing.mystery.status")}</dt>
            <dd className="font-semibold">
              {t("lesson3.closing.mystery.statusValue")}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-b border-[rgba(230,234,238,0.12)] pb-2">
            <dt className="text-[#6b7683]">
              {t("lesson3.closing.mystery.experience")}
            </dt>
            <dd className="font-semibold">
              {t("lesson3.closing.mystery.experienceValue")}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-[#6b7683]">
              {t("lesson3.closing.mystery.accuracy")}
            </dt>
            <dd className="font-semibold text-[#9aa5b1]">
              {t("lesson3.closing.mystery.accuracyValue")}
            </dd>
          </div>
        </dl>
      </div>
    </motion.div>
  );
}

export const LESSON3_CLOSING_PHASES = ["library", "corpus", "mystery"] as const;

export type Lesson3ClosingPhase = (typeof LESSON3_CLOSING_PHASES)[number];

type Props = {
  phase: Lesson3ClosingPhase;
  onContinue: () => void;
};

export function Lesson3Closing({ phase, onContinue }: Props) {
  const { t, corpusOptions } = useLesson3Copy();
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <LibraryFrame>
      <AnimatePresence mode="wait">
        {phase === "library" ? (
          <motion.div
            key="library"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-1 flex-col"
          >
            <LibraryTitle plaque={t("lesson3.closing.library.plaque")}>
              {t("lesson3.closing.library.title")}
            </LibraryTitle>
            <LibraryLine>{t("lesson3.closing.library.notByDefault")}</LibraryLine>
            <div className="library-paper mt-8 max-w-2xl px-5 py-6">
              <p className="text-lg font-semibold text-ink">
                {t("lesson3.closing.library.metaphor")}
              </p>
              <p className="mt-3 text-base text-ink-soft">
                {t("lesson3.closing.library.exam")}
              </p>
              <p className="mt-4 text-base text-ink-soft">
                {t("lesson3.closing.library.searchTool")}
              </p>
            </div>
            <LibraryContinue
              label={t("lesson3.closing.library.cta")}
              onClick={onContinue}
            />
          </motion.div>
        ) : null}

        {phase === "corpus" ? (
          <motion.div
            key="corpus"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-1 flex-col"
          >
            <LibraryTitle plaque={t("lesson3.closing.corpus.plaque")}>
              {t("lesson3.closing.corpus.title")}
            </LibraryTitle>
            <p className="library-choice-cue mt-6">
              {t("lesson3.shared.chooseOne")}
            </p>
            <div
              className="mt-3 grid max-w-4xl gap-3 sm:grid-cols-2"
              role="radiogroup"
              aria-label={t("lesson3.closing.corpus.chooseAria")}
            >
              {corpusOptions.map((option, i) => {
                const mark = String.fromCharCode(65 + i);
                const revealed = picked !== null;
                const isAnswer = option.id === "internet";
                const isPicked = picked === option.id;
                let stateClass = "";
                if (!revealed) {
                  stateClass = " library-choice-invite";
                } else if (isAnswer) {
                  stateClass = " is-correct";
                } else if (isPicked) {
                  stateClass = " is-miss";
                } else {
                  stateClass = " is-dimmed";
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isPicked}
                    disabled={revealed}
                    onClick={() => setPicked(option.id)}
                    className={`library-choice library-choice-marked text-left${stateClass}`}
                  >
                    <span className="library-choice-mark" aria-hidden>
                      {mark}
                    </span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>

            {picked ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 max-w-4xl"
              >
                <div className="overflow-hidden rounded-sm border border-[rgba(26,35,48,0.14)] bg-[#0a0c10] px-5 py-6 sm:px-8 sm:py-8">
                  <CorpusScaleChart />
                </div>
                <p className="library-line mt-5">
                  {t("lesson3.closing.corpus.body")}
                </p>
                <LibraryContinue
                  label={t("lesson3.closing.corpus.cta")}
                  onClick={onContinue}
                />
              </motion.div>
            ) : null}
          </motion.div>
        ) : null}

        {phase === "mystery" ? (
          <motion.div
            key="mystery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex min-h-[28rem] flex-1 flex-col overflow-hidden"
          >
            <FacilityPreview />

            <div className="relative z-10 flex flex-1 flex-col justify-center gap-10 lg:flex-row lg:items-center lg:gap-12">
              <div className="min-w-0 flex-1">
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.55 }}
                  className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-[#e6eaee] sm:text-5xl md:text-6xl"
                >
                  {t("lesson3.closing.mystery.line1")}
                  <br />
                  <span className="italic text-[#2f9e8f]">
                    {t("lesson3.closing.mystery.line2")}
                  </span>
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.85 }}
                  className="mt-8 flex flex-wrap items-center gap-4"
                >
                  <Link
                    href="/lessons/4"
                    className="inline-flex items-center rounded-sm border border-[#2f9e8f] bg-[#2f9e8f] px-6 py-3 text-sm font-bold tracking-tight text-[#061512] shadow-[0_8px_20px_rgba(0,0,0,0.28)] transition hover:brightness-110"
                  >
                    {t("lesson3.closing.mystery.toLesson4")}
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-[#9aa5b1] transition hover:text-[#e6eaee]"
                  >
                    {t("lesson3.closing.mystery.backHome")}
                  </Link>
                </motion.div>
              </div>

              <TrainingWallDisplay />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </LibraryFrame>
  );
}
