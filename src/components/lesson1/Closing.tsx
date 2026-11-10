"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  MuseumContinue,
  MuseumFrame,
  MuseumLine,
  MuseumTitle,
  Pedestal,
} from "@/components/lesson1/MuseumFrame";
import { useT } from "@/i18n/LocaleProvider";

export const LESSON1_CLOSING_PHASES = [
  "rule",
  "ask",
  "reveal",
  "mystery",
] as const;

export type Lesson1ClosingPhase = (typeof LESSON1_CLOSING_PHASES)[number];

type Props = {
  phase: Lesson1ClosingPhase;
  onContinue: () => void;
};

export function Closing({ phase, onContinue }: Props) {
  const t = useT();

  return (
    <MuseumFrame>
      <AnimatePresence mode="wait">
        {phase === "rule" ? (
          <motion.div
            key="rule"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-1 flex-col"
          >
            <MuseumTitle plaque={t("lesson1.closing.rule.plaque")}>
              {t("lesson1.closing.rule.title")}
            </MuseumTitle>
            <MuseumLine>{t("lesson1.closing.rule.body")}</MuseumLine>
            <div className="mt-6 max-w-xl">
              <Pedestal float>
                <div className="px-6 py-8 sm:px-8">
                  <p className="museum-eyebrow">
                    {t("lesson1.closing.rule.eyebrow")}
                  </p>
                  <p className="mt-4 font-[family-name:var(--font-museum)] text-2xl leading-snug tracking-tight sm:text-3xl">
                    {t("lesson1.closing.rule.ruleLine1")}
                    <br />
                    {t("lesson1.closing.rule.ruleLine2")}
                  </p>
                  <p className="museum-line mt-4 max-w-none text-[0.95rem]">
                    {t("lesson1.closing.rule.plain")}
                  </p>
                </div>
              </Pedestal>
            </div>
            <p className="museum-line mt-5 max-w-xl">
              {t("lesson1.closing.rule.hold")}
            </p>
            <MuseumContinue
              label={t("lesson1.closing.rule.cta")}
              onClick={onContinue}
            />
          </motion.div>
        ) : null}

        {phase === "ask" ? (
          <motion.div
            key="ask"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-1 flex-col"
          >
            <MuseumTitle>{t("lesson1.closing.ask.title")}</MuseumTitle>
            <MuseumLine>{t("lesson1.closing.ask.sub")}</MuseumLine>
            <div className="museum-case museum-case-closing">
              <div className="museum-case-head">
                <span className="museum-case-cue" aria-hidden>
                  {t("lesson1.shared.chooseOne")}
                </span>
              </div>
              <div
                className="museum-case-options museum-case-options-compact"
                role="radiogroup"
                aria-label={t("lesson1.closing.ask.groupAria")}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={false}
                  onClick={onContinue}
                  className="museum-case-opt museum-case-opt-invite museum-case-opt-short"
                >
                  <span className="museum-case-opt-mark" aria-hidden>
                    A
                  </span>
                  <span className="museum-case-opt-label">
                    {t("lesson1.closing.ask.sure")}
                  </span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={false}
                  onClick={onContinue}
                  className="museum-case-opt museum-case-opt-invite museum-case-opt-short"
                >
                  <span className="museum-case-opt-mark" aria-hidden>
                    B
                  </span>
                  <span className="museum-case-opt-label">
                    {t("lesson1.closing.ask.probablyNot")}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}

        {phase === "reveal" ? (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-1 flex-col"
          >
            <MuseumTitle>{t("lesson1.closing.reveal.title")}</MuseumTitle>
            <MuseumLine>{t("lesson1.closing.reveal.body")}</MuseumLine>
            <MuseumContinue
              label={t("lesson1.closing.reveal.cta")}
              onClick={onContinue}
            />
          </motion.div>
        ) : null}

        {phase === "mystery" ? (
          <motion.div
            key="mystery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex flex-1 flex-col"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none fixed inset-0 z-[5]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background:
                  "radial-gradient(ellipse at 50% 35%, rgba(10,12,10,0.15) 0%, rgba(8,10,8,0.72) 55%, rgba(4,5,4,0.88) 100%)",
              }}
            />

            <div className="relative z-10 flex flex-1 flex-col justify-center gap-10 lg:flex-row lg:items-center lg:gap-14">
              <div className="min-w-0 flex-1">
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.7 }}
                  className="max-w-3xl font-[family-name:var(--font-museum)] text-4xl leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl"
                >
                  {t("lesson1.closing.mystery.title")}
                  <br />
                  <span className="italic text-white/70">
                    {t("lesson1.closing.mystery.italic")}
                  </span>
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.05 }}
                  className="mt-8 flex flex-wrap gap-4"
                >
                  <Link
                    href="/lessons/2"
                    className="museum-btn border-white/20 bg-white text-ink hover:bg-white/90"
                  >
                    {t("lesson1.closing.mystery.toLesson2")}
                  </Link>
                  <Link
                    href="/"
                    className="museum-choice inline-flex items-center border-white/25 bg-white/10 px-6 text-white hover:bg-white/15"
                  >
                    {t("lesson1.closing.mystery.backHome")}
                  </Link>
                </motion.div>
              </div>

              <motion.div
                aria-hidden
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.55,
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mx-auto w-full max-w-[17rem] shrink-0 sm:max-w-[19rem]"
              >
                <div className="rounded-sm border border-[#3a4138] bg-[#2a3028] p-2.5 shadow-[0_24px_50px_rgba(0,0,0,0.55)]">
                  <div className="lab-crt aspect-[5/4] px-4 py-5 font-[family-name:var(--font-lab,ui-monospace)] text-sm leading-relaxed">
                    <p className="opacity-80">
                      {t("lesson1.closing.mystery.terminal")}
                    </p>
                    <p className="mt-3 opacity-60">
                      {t("lesson1.closing.mystery.ready")}
                    </p>
                    <p className="mt-6">
                      <span className="opacity-90">_</span>
                      <motion.span
                        animate={{ opacity: [1, 0.15, 1] }}
                        transition={{ duration: 1.05, repeat: Infinity }}
                        className="ml-0.5 inline-block h-4 w-2 align-middle bg-[var(--lab-phosphor,#7dff9a)]"
                      />
                    </p>
                  </div>
                  <div className="mt-2 h-2 rounded-sm bg-[#1c211c]" />
                  <div className="mx-auto mt-2 h-3 w-16 rounded-sm bg-[#3a4138]" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </MuseumFrame>
  );
}
