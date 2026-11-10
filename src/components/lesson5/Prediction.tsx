"use client";

import { useState } from "react";
import {
  NetworkContinue,
  NetworkFrame,
  NetworkTitle,
} from "@/components/lesson5/NetworkFrame";
import { PREDICTION_CHOICES } from "@/lib/lesson5-data";
import { useT } from "@/i18n/LocaleProvider";

type Props = { onContinue: () => void };

export function Prediction({ onContinue }: Props) {
  const t = useT();
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <NetworkFrame>
      <NetworkTitle plaque={t("lesson5.prediction.plaque")}>
        {t("lesson5.prediction.title")}
      </NetworkTitle>

      <p className="network-choice-cue mt-2">{t("lesson5.shared.chooseOne")}</p>
      <div
        className="mt-3 grid max-w-2xl gap-3"
        role="radiogroup"
        aria-label={t("lesson5.prediction.aria")}
      >
        {PREDICTION_CHOICES.map((option, i) => {
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
              className={`network-choice${selected ? " is-selected" : ""}${
                dimmed ? " is-dimmed" : ""
              }`}
            >
              <span className="network-choice-mark" aria-hidden>
                {mark}
              </span>
              <span>{t(`lesson5.prediction.choices.${option.id}`)}</span>
            </button>
          );
        })}
      </div>

      {picked ? (
        <NetworkContinue
          label={t("lesson5.prediction.cta")}
          onClick={onContinue}
        />
      ) : null}
    </NetworkFrame>
  );
}
