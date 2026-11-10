"use client";

import { useState } from "react";
import {
  ConnectedContinue,
  ConnectedFrame,
  ConnectedLine,
  ConnectedTitle,
} from "@/components/practical1/ConnectedOfficeFrame";
import { type PredictionChoiceId } from "@/lib/practical1-data";
import { usePractical1Copy } from "@/lib/usePractical1Copy";

type Props = {
  onContinue: (choiceId: PredictionChoiceId) => void;
};

export function Prediction({ onContinue }: Props) {
  const { t, predictionChoices } = usePractical1Copy();
  const [choiceId, setChoiceId] = useState<PredictionChoiceId | null>(null);
  const revealed = choiceId != null;

  return (
    <ConnectedFrame>
      <ConnectedTitle plaque={t("practical1.prediction.plaque")}>
        {t("practical1.prediction.title")}
      </ConnectedTitle>
      <ConnectedLine>{t("practical1.prediction.subhead")}</ConnectedLine>

      <p className="connected-choice-cue mt-8">
        {t("practical1.shared.chooseOne")}
      </p>
      <div
        className="mt-3 grid max-w-2xl gap-3"
        role="radiogroup"
        aria-label={t("practical1.prediction.title")}
        aria-required="true"
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
              aria-checked={selected}
              className={`connected-door connected-choice-btn p-4 text-left${
                !revealed ? " connected-choice-invite" : ""
              }${selected ? " is-selected" : ""}${dimmed ? " is-dimmed" : ""}`}
              onClick={() => setChoiceId(option.id)}
            >
              <span className="connected-choice-mark" aria-hidden>
                {mark}
              </span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      {choiceId ? (
        <div className="mt-8 max-w-2xl">
          <p className="connected-body font-semibold">
            {t("practical1.prediction.noted")}
          </p>
          <ConnectedContinue
            label={t("practical1.prediction.cta")}
            onClick={() => onContinue(choiceId)}
          />
        </div>
      ) : null}
    </ConnectedFrame>
  );
}
