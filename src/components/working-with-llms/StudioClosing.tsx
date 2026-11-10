"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  StudioContinue,
  StudioFrame,
  StudioLine,
  StudioTitle,
} from "@/components/working-with-llms/StudioFrame";
import { useWorkingWithLlmsCopy } from "@/lib/useWorkingWithLlmsCopy";

export const STUDIO_CLOSING_PHASES = ["line", "principle", "mystery"] as const;

export type StudioClosingPhase = (typeof STUDIO_CLOSING_PHASES)[number];

type Props = {
  phase: StudioClosingPhase;
  onContinue: () => void;
};

export function StudioClosing({ phase, onContinue }: Props) {
  const { t } = useWorkingWithLlmsCopy();

  return (
    <AnimatePresence mode="wait">
      {phase === "line" ? (
        <StudioFrame key="line">
          <StudioTitle plaque={t("workingWithLlms.closing.line.plaque")}>
            {t("workingWithLlms.closing.line.title")}
          </StudioTitle>
          <StudioLine>{t("workingWithLlms.closing.line.subhead")}</StudioLine>

          <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
            <article className="studio-panel px-5 py-5">
              <p className="studio-eyebrow">
                {t("workingWithLlms.closing.line.oldHabit.eyebrow")}
              </p>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-[var(--stu-ink-soft)]">
                {t("workingWithLlms.closing.line.oldHabit.body")}
              </p>
            </article>
            <article className="studio-panel studio-panel-accent px-5 py-5">
              <p className="studio-eyebrow">
                {t("workingWithLlms.closing.line.newHabit.eyebrow")}
              </p>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-[var(--stu-ink-soft)]">
                {t("workingWithLlms.closing.line.newHabit.body")}
              </p>
            </article>
          </div>

          <StudioContinue
            label={t("workingWithLlms.closing.line.cta")}
            onClick={onContinue}
          />
        </StudioFrame>
      ) : null}

      {phase === "principle" ? (
        <StudioFrame key="principle">
          <StudioTitle plaque={t("workingWithLlms.closing.principle.plaque")}>
            {t("workingWithLlms.closing.principle.title")}
          </StudioTitle>
          <StudioLine>{t("workingWithLlms.closing.principle.body")}</StudioLine>
          <StudioContinue
            label={t("workingWithLlms.closing.principle.cta")}
            onClick={onContinue}
          />
        </StudioFrame>
      ) : null}

      {phase === "mystery" ? (
        <StudioFrame key="mystery">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl text-3xl font-semibold leading-[1.12] tracking-tight text-[var(--stu-ink)] sm:text-4xl md:text-5xl"
          >
            {t("workingWithLlms.closing.mystery.headline")}
            <br />
            <span className="mt-4 block italic text-[var(--stu-accent)]">
              {t("workingWithLlms.closing.mystery.followUp")}
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link href="/lessons/delegate-real-work" className="studio-btn">
              {t("workingWithLlms.closing.mystery.toCoworker")}
            </Link>
            <span
              className="studio-btn cursor-default opacity-45"
              aria-disabled="true"
            >
              {t("workingWithLlms.closing.mystery.comingSoon")}
            </span>
            <Link href="/" className="studio-btn-secondary">
              {t("workingWithLlms.closing.mystery.backHome")}
            </Link>
          </motion.div>
        </StudioFrame>
      ) : null}
    </AnimatePresence>
  );
}
