"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  LabContinue,
  LabFrame,
  LabLine,
  LabTitle,
} from "@/components/lesson2/LabFrame";
import { RichText } from "@/i18n/RichText";
import { useLesson2Copy } from "@/lib/useLesson2Copy";
import { useT } from "@/i18n/LocaleProvider";

export const LESSON2_CLOSING_PHASES = ["wow", "internet", "mystery"] as const;

export type Lesson2ClosingPhase = (typeof LESSON2_CLOSING_PHASES)[number];

type Props = {
  phase: Lesson2ClosingPhase;
  onContinue: () => void;
};

function MysteryPhase() {
  const t = useT();
  const reduceMotion = useReducedMotion();

  return (
    <div
      key="mystery"
      className="relative flex flex-1 flex-col overflow-hidden"
    >
      <div className="relative z-10 flex flex-1 flex-col justify-center gap-10 lg:flex-row lg:items-center lg:gap-12">
        <div className="min-w-0 flex-1">
          <h2 className="max-w-3xl font-[family-name:var(--font-library,Georgia,serif)] text-3xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-4xl md:text-5xl">
            <span className="block">{t("lesson2.closing.mystery.line1")}</span>
            <span className="lab-mystery-line2 mt-1 block text-[var(--lab-phosphor)]">
              {t("lesson2.closing.mystery.line2")}
            </span>
          </h2>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/lessons/3" className="lab-btn lab-mystery-cta">
              {t("lesson2.closing.mystery.toLesson3")}
            </Link>
            <Link href="/" className="lab-choice inline-flex items-center px-6">
              {t("lesson2.closing.mystery.backHome")}
            </Link>
          </div>
        </div>

        <div className="lab-mystery-library relative mx-auto w-full max-w-md shrink-0 sm:max-w-lg lg:max-w-xl">
          <div className="lab-mystery-library-fade">
            <motion.div
              className="lab-mystery-kenburns"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.07],
                      x: ["0%", "-2.4%"],
                      y: ["0%", "1.1%"],
                    }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 14,
                      ease: "linear",
                      repeat: Infinity,
                      repeatType: "mirror",
                    }
              }
            >
              <Image
                src="/lesson2/transition/infinite-library.png"
                alt={t("lesson2.closing.mystery.alt")}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 640px"
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Lesson2Closing({ phase, onContinue }: Props) {
  const { t, internetStickies } = useLesson2Copy();

  return (
    <LabFrame>
      <AnimatePresence mode="wait">
        {phase === "wow" ? (
          <motion.div
            key="wow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-1 flex-col"
          >
            <LabTitle plaque={t("lesson2.closing.wow.plaque")}>
              {t("lesson2.closing.wow.title")}
            </LabTitle>
            <p className="lab-line">
              <RichText text={t("lesson2.closing.wow.sub")} />
            </p>
            <div className="lab-panel mt-8 max-w-3xl px-5 py-5">
              <p className="lab-eyebrow">
                {t("lesson2.closing.wow.unchangedEyebrow")}
              </p>
              <p className="mt-3 text-sm text-ink-soft">
                {t("lesson2.closing.wow.unchangedBody")}
              </p>
            </div>
            <div className="mt-8 grid max-w-3xl gap-4 md:grid-cols-2">
              <div className="lab-panel px-5 py-5">
                <p className="lab-eyebrow">{t("lesson2.closing.wow.oldEyebrow")}</p>
                <p className="mt-3 text-base font-semibold text-ink">
                  {t("lesson2.closing.wow.oldQuestion")}
                </p>
              </div>
              <div className="lab-crt px-5 py-5">
                <p className="relative z-10 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--lab-phosphor-dim)]">
                  {t("lesson2.closing.wow.newEyebrow")}
                </p>
                <p className="relative z-10 mt-3 text-base font-semibold">
                  {t("lesson2.closing.wow.newQuestion")}
                </p>
              </div>
            </div>
            <LabContinue
              label={t("lesson2.closing.wow.cta")}
              onClick={onContinue}
            />
          </motion.div>
        ) : null}

        {phase === "internet" ? (
          <motion.div
            key="internet"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-1 flex-col"
          >
            <LabTitle plaque={t("lesson2.closing.internet.plaque")}>
              {t("lesson2.closing.internet.title")}
            </LabTitle>
            <LabLine>{t("lesson2.closing.internet.sub")}</LabLine>
            <div className="mt-6 flex flex-wrap gap-3">
              {internetStickies.map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, y: 8, rotate: -4 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotate: ((i % 5) - 2) * 2,
                  }}
                  transition={{ delay: i * 0.06 }}
                  className={`lab-sticky ${i % 2 === 1 ? "lab-sticky-alt" : ""}`}
                >
                  {item}
                </motion.span>
              ))}
            </div>
            <LabContinue
              label={t("lesson2.closing.internet.cta")}
              onClick={onContinue}
            />
          </motion.div>
        ) : null}

        {phase === "mystery" ? <MysteryPhase /> : null}
      </AnimatePresence>
    </LabFrame>
  );
}
