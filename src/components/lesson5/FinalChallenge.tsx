"use client";

import { useState } from "react";
import {
  NetworkContinue,
  NetworkFrame,
  NetworkLine,
  NetworkTitle,
} from "@/components/lesson5/NetworkFrame";
import {
  FINAL_CHALLENGE_CORRECT,
  type FinalChallengeId,
} from "@/lib/lesson5-data";
import { useT } from "@/i18n/LocaleProvider";

type Props = { onContinue: () => void };

const OPTIONS: FinalChallengeId[] = ["a", "b", "c", "d"];

export function FinalChallenge({ onContinue }: Props) {
  const t = useT();
  const [picked, setPicked] = useState<FinalChallengeId | null>(null);
  const correct = picked === FINAL_CHALLENGE_CORRECT;

  return (
    <NetworkFrame>
      <NetworkTitle plaque={t("lesson5.finalChallenge.plaque")}>
        {t("lesson5.finalChallenge.title")}
      </NetworkTitle>

      <div
        className="mt-3 grid max-w-2xl gap-3"
        role="radiogroup"
        aria-label={t("lesson5.finalChallenge.aria")}
      >
        {OPTIONS.map((id) => {
          const selected = picked === id;
          const mark = id.toUpperCase();
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setPicked(id)}
              className={`network-choice${selected ? " is-selected" : ""}`}
            >
              <span className="network-choice-mark" aria-hidden>
                {mark}
              </span>
              <span>{t(`lesson5.finalChallenge.choices.${id}`)}</span>
            </button>
          );
        })}
      </div>

      {picked && correct ? (
        <>
          <NetworkLine>{t("lesson5.finalChallenge.explain")}</NetworkLine>
          <NetworkContinue
            label={t("lesson5.finalChallenge.cta")}
            onClick={onContinue}
          />
        </>
      ) : null}
      {picked && !correct ? (
        <p className="mt-6 text-sm text-[var(--network-miss)]">
          {t("lesson5.finalChallenge.tryAgain")}
        </p>
      ) : null}
    </NetworkFrame>
  );
}
