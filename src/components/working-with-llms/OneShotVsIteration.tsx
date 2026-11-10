"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  StudioContinue,
  StudioFrame,
  StudioLine,
  StudioTitle,
} from "@/components/working-with-llms/StudioFrame";
import { type ApproachChoiceId } from "@/lib/working-with-llms-data";
import { useWorkingWithLlmsCopy } from "@/lib/useWorkingWithLlmsCopy";

type Props = {
  onContinue: (choice: ApproachChoiceId) => void;
};

type Phase = "habit" | "choose" | "reveal";

export function OneShotVsIteration({ onContinue }: Props) {
  const { t, approachChoices } = useWorkingWithLlmsCopy();
  const [phase, setPhase] = useState<Phase>("habit");
  const [picked, setPicked] = useState<ApproachChoiceId | null>(null);

  return (
    <AnimatePresence mode="wait">
      {phase === "habit" ? (
        <StudioFrame key="habit">
          <StudioTitle plaque={t("workingWithLlms.oneShot.habit.plaque")}>
            {t("workingWithLlms.oneShot.habit.title")}
          </StudioTitle>
          <StudioLine>{t("workingWithLlms.oneShot.habit.subhead")}</StudioLine>
          <StudioContinue
            label={t("workingWithLlms.oneShot.habit.cta")}
            onClick={() => setPhase("choose")}
          />
        </StudioFrame>
      ) : null}

      {phase === "choose" ? (
        <StudioFrame key="choose">
          <StudioTitle plaque={t("workingWithLlms.oneShot.choose.plaque")}>
            {t("workingWithLlms.oneShot.choose.title")}
          </StudioTitle>

          <div className="mt-8 grid max-w-2xl gap-3">
            {approachChoices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                aria-pressed={picked === choice.id}
                onClick={() => setPicked(choice.id)}
                className="studio-choice"
              >
                {choice.label}
              </button>
            ))}
          </div>

          <StudioContinue
            label={t("workingWithLlms.oneShot.choose.cta")}
            disabled={!picked}
            onClick={() => setPhase("reveal")}
          />
        </StudioFrame>
      ) : null}

      {phase === "reveal" && picked ? (
        <StudioFrame key="reveal">
          <StudioTitle plaque={t("workingWithLlms.oneShot.reveal.plaque")}>
            {t("workingWithLlms.oneShot.reveal.title")}
          </StudioTitle>
          <StudioLine>{t("workingWithLlms.oneShot.reveal.body1")}</StudioLine>
          <p className="studio-line mt-4">
            {t("workingWithLlms.oneShot.reveal.body2")}
          </p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-8 max-w-2xl text-lg font-semibold tracking-tight text-[var(--stu-ink)]"
          >
            {t("workingWithLlms.oneShot.reveal.punchline")}
          </motion.p>

          <StudioContinue
            label={t("workingWithLlms.oneShot.reveal.cta")}
            onClick={() => onContinue(picked)}
          />
        </StudioFrame>
      ) : null}
    </AnimatePresence>
  );
}
