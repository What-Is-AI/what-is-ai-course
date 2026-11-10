"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  StudioContinue,
  StudioFrame,
  StudioLine,
  StudioTitle,
} from "@/components/working-with-llms/StudioFrame";
import { type AltitudeChoiceId } from "@/lib/working-with-llms-data";
import { useWorkingWithLlmsCopy } from "@/lib/useWorkingWithLlmsCopy";

type Props = {
  onContinue: (choice: AltitudeChoiceId) => void;
};

type Phase = "task" | "pick" | "reveal";

export function RightAltitude({ onContinue }: Props) {
  const { t, altitudeChoices } = useWorkingWithLlmsCopy();
  const [phase, setPhase] = useState<Phase>("task");
  const [picked, setPicked] = useState<AltitudeChoiceId | null>(null);

  return (
    <AnimatePresence mode="wait">
      {phase === "task" ? (
        <StudioFrame key="task">
          <StudioTitle plaque={t("workingWithLlms.altitude.task.plaque")}>
            {t("workingWithLlms.altitude.task.title")}
          </StudioTitle>
          <StudioLine>{t("workingWithLlms.altitude.task.subhead")}</StudioLine>
          <StudioContinue
            label={t("workingWithLlms.altitude.task.cta")}
            onClick={() => setPhase("pick")}
          />
        </StudioFrame>
      ) : null}

      {phase === "pick" ? (
        <StudioFrame key="pick">
          <StudioTitle plaque={t("workingWithLlms.altitude.pick.plaque")}>
            {t("workingWithLlms.altitude.pick.title")}
          </StudioTitle>

          <div className="mt-8 grid max-w-2xl gap-3">
            {altitudeChoices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                aria-pressed={picked === choice.id}
                onClick={() => setPicked(choice.id)}
                className="studio-choice"
              >
                <span className="block">{choice.label}</span>
                <span className="mt-1.5 block text-sm font-medium leading-relaxed text-[var(--stu-ink-soft)]">
                  {choice.detail}
                </span>
              </button>
            ))}
          </div>

          <StudioContinue
            label={t("workingWithLlms.altitude.pick.cta")}
            disabled={!picked}
            onClick={() => setPhase("reveal")}
          />
        </StudioFrame>
      ) : null}

      {phase === "reveal" && picked ? (
        <StudioFrame key="reveal">
          <StudioTitle plaque={t("workingWithLlms.altitude.reveal.plaque")}>
            {t("workingWithLlms.altitude.reveal.title")}
          </StudioTitle>
          <StudioLine>{t("workingWithLlms.altitude.reveal.body1")}</StudioLine>
          <p className="studio-line mt-4">
            {t("workingWithLlms.altitude.reveal.body2")}
          </p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-8 max-w-2xl text-lg font-semibold tracking-tight text-[var(--stu-ink)]"
          >
            {t("workingWithLlms.altitude.reveal.punchline")}
          </motion.p>

          <StudioContinue
            label={t("workingWithLlms.altitude.reveal.cta")}
            onClick={() => onContinue(picked)}
          />
        </StudioFrame>
      ) : null}
    </AnimatePresence>
  );
}
