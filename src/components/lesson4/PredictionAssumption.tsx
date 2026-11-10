"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  FacilityContinue,
  FacilityFrame,
  FacilityLine,
  FacilityTitle,
} from "@/components/lesson4/FacilityFrame";
import { useLesson4Copy } from "@/lib/useLesson4Copy";
import { useTrackChoice } from "@/lib/analytics/useTrackChoice";
import { QStep } from "@/lib/analytics/questionIds";

type Props = {
  onContinue: (predictedMechanism: string) => void;
};

export function PredictionAssumption({ onContinue }: Props) {
  const { t, assumptions } = useLesson4Copy();
  const trackChoice = useTrackChoice();
  const [picked, setPicked] = useState<string | null>(null);
  const choice = assumptions.find((c) => c.id === picked);

  return (
    <FacilityFrame>
      <FacilityTitle plaque={t("lesson4.assumption.plaque")}>
        {t("lesson4.assumption.title")}
      </FacilityTitle>
      <FacilityLine>{t("lesson4.assumption.subhead")}</FacilityLine>

      <p className="facility-choice-cue mt-6">{t("lesson4.shared.chooseOne")}</p>
      <div
        className="mt-3 grid max-w-2xl gap-3"
        role="radiogroup"
        aria-label={t("lesson4.assumption.aria")}
      >
        {assumptions.map((option, i) => {
          const selected = picked === option.id;
          const dimmed = picked !== null && !selected;
          const mark = String.fromCharCode(65 + i);
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setPicked(option.id)}
              className={`facility-choice facility-choice-marked${
                !picked ? " facility-choice-invite" : ""
              }${selected ? " is-selected" : ""}${dimmed ? " is-dimmed" : ""}`}
            >
              <span className="facility-choice-mark" aria-hidden>
                {mark}
              </span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {choice ? (
          <motion.div
            key={choice.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="facility-panel mt-6 max-w-2xl px-5 py-4"
          >
            <p className="text-sm leading-relaxed text-[var(--fac-ink-soft)]">
              {t("lesson4.assumption.note")}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {choice ? (
        <FacilityContinue
          label={t("lesson4.assumption.cta")}
          onClick={() => {
            trackChoice({
              questionId: QStep.predictedMechanism,
              selectedOptionId: choice.id,
            });
            onContinue(choice.id);
          }}
        />
      ) : null}
    </FacilityFrame>
  );
}
