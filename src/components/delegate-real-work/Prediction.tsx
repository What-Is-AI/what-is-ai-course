"use client";

import { useState } from "react";
import {
  CoworkerContinue,
  CoworkerFrame,
  CoworkerLine,
  CoworkerTitle,
} from "@/components/delegate-real-work/CoworkerFrame";
import { type PredictionChoiceId } from "@/lib/delegate-real-work-data";
import { useDelegateRealWorkCopy } from "@/lib/useDelegateRealWorkCopy";
import { useTrackChoice } from "@/lib/analytics/useTrackChoice";
import { QStep } from "@/lib/analytics/questionIds";

type Props = {
  onContinue: (choiceId: PredictionChoiceId) => void;
};

export function Prediction({ onContinue }: Props) {
  const { t, predictionChoices } = useDelegateRealWorkCopy();
  const trackChoice = useTrackChoice();
  const [choiceId, setChoiceId] = useState<PredictionChoiceId | null>(null);

  const choice = predictionChoices.find((c) => c.id === choiceId);
  const revealed = choice != null;
  const branch =
    choice?.bucket === "real"
      ? t("delegateRealWork.prediction.afterDoIt")
      : t("delegateRealWork.prediction.afterUnderShoots");

  return (
    <CoworkerFrame>
      <CoworkerTitle plaque={t("delegateRealWork.prediction.plaque")}>
        {t("delegateRealWork.prediction.title")}
      </CoworkerTitle>
      <CoworkerLine>{t("delegateRealWork.prediction.subhead")}</CoworkerLine>

      <p className="coworker-choice-cue mt-8">
        {t("delegateRealWork.shared.chooseOne")}
      </p>
      <div
        className="grid max-w-2xl gap-3"
        role="radiogroup"
        aria-label={t("delegateRealWork.prediction.title")}
      >
        {predictionChoices.map((option, i) => {
          const selected = choiceId === option.id;
          const dimmed = revealed && !selected;
          const mark = String.fromCharCode(65 + i);
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              className={`coworker-choice coworker-choice-marked${
                !revealed ? " coworker-choice-invite" : ""
              }${selected ? " is-selected" : ""}${dimmed ? " is-dimmed" : ""}`}
              aria-checked={selected}
              onClick={() => setChoiceId(option.id)}
            >
              <span className="coworker-choice-mark" aria-hidden>
                {mark}
              </span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      {revealed ? (
        <div className="mt-8 max-w-2xl space-y-4">
          <p className="coworker-line">{branch}</p>
          <p className="text-base font-semibold leading-relaxed text-[color:var(--cw-accent)]">
            {t("delegateRealWork.prediction.hookLine")}
          </p>
          <CoworkerContinue
            label={t("delegateRealWork.prediction.cta")}
            onClick={() => {
              trackChoice({
                questionId: QStep.prediction,
                selectedOptionId: choiceId!,
              });
              onContinue(choiceId!);
            }}
          />
        </div>
      ) : null}
    </CoworkerFrame>
  );
}
