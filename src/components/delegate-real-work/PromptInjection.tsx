"use client";

import { useState } from "react";
import {
  CoworkerContinue,
  CoworkerFrame,
  CoworkerLine,
  CoworkerTitle,
} from "@/components/delegate-real-work/CoworkerFrame";
import { type InjectionChoiceId } from "@/lib/delegate-real-work-data";
import { useDelegateRealWorkCopy } from "@/lib/useDelegateRealWorkCopy";

type Props = {
  onContinue: () => void;
};

export function PromptInjection({ onContinue }: Props) {
  const { t, injectionChoices } = useDelegateRealWorkCopy();
  const [choiceId, setChoiceId] = useState<InjectionChoiceId | null>(null);
  const choice = injectionChoices.find((c) => c.id === choiceId);
  const revealed = choice != null;

  return (
    <CoworkerFrame>
      <CoworkerTitle plaque={t("delegateRealWork.injection.plaque")}>
        {t("delegateRealWork.injection.title")}
      </CoworkerTitle>
      <CoworkerLine>{t("delegateRealWork.injection.subhead")}</CoworkerLine>

      <blockquote className="coworker-hidden-quote mt-6 max-w-2xl">
        {t("delegateRealWork.injection.hiddenText")}
      </blockquote>

      <p className="coworker-line mt-8">{t("delegateRealWork.injection.prompt")}</p>

      <p className="coworker-choice-cue mt-8">
        {t("delegateRealWork.shared.chooseOne")}
      </p>
      <div
        className="grid max-w-2xl gap-3"
        role="radiogroup"
        aria-label={t("delegateRealWork.injection.prompt")}
      >
        {injectionChoices.map((option, i) => {
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
              disabled={revealed}
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

      {revealed && choice ? (
        <div className="mt-8 max-w-2xl space-y-4">
          <p
            className={`rounded px-4 py-3 text-sm font-semibold ${
              choice.correct ? "coworker-verify-ok" : "coworker-verify-off"
            }`}
          >
            <span aria-hidden>{choice.correct ? "✓ " : "✗ "}</span>
            {choice.verdict}
          </p>
          <p className="coworker-line">{t("delegateRealWork.injection.reveal")}</p>
          <p className="coworker-line">
            {t("delegateRealWork.injection.reassurance")}
          </p>
          <CoworkerContinue
            label={t("delegateRealWork.injection.cta")}
            onClick={onContinue}
          />
        </div>
      ) : null}
    </CoworkerFrame>
  );
}
