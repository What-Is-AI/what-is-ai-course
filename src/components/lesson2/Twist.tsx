"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  LabContinue,
  LabFrame,
  LabLine,
  LabTitle,
} from "@/components/lesson2/LabFrame";
import { useLesson2Copy } from "@/lib/useLesson2Copy";

type Props = {
  onContinue: () => void;
};

const MARKS = ["A", "B", "C", "D"] as const;

export function Twist({ onContinue }: Props) {
  const { t, twistGuesses } = useLesson2Copy();
  const [picked, setPicked] = useState<string | null>(null);
  const revealed = picked !== null;
  const isBest = picked === "ready";
  const isPartly = picked === "math";
  const feedbackLabel = isBest
    ? t("lesson2.shared.feedback.correct")
    : isPartly
      ? t("lesson2.shared.feedback.partly")
      : t("lesson2.shared.feedback.notQuite");
  const feedbackColor = isBest
    ? "var(--lab-phosphor)"
    : "var(--lab-warn)";

  return (
    <LabFrame>
      <LabTitle plaque={t("lesson2.twist.plaque")}>
        {t("lesson2.twist.title")}
      </LabTitle>
      <LabLine>{t("lesson2.twist.subhead")}</LabLine>

      <div className="lab-choose mt-8">
        <p className="lab-choose-cue" id="lab-twist-prompt">
          {t("lesson2.shared.chooseOne")}
        </p>
        <div
          className="lab-choose-options lab-choose-options-twist"
          role="radiogroup"
          aria-labelledby="lab-twist-prompt"
        >
          {twistGuesses.map((guess, optionIndex) => {
            const best = guess.id === "ready";
            const partly = guess.id === "math";
            const isPicked = picked === guess.id;
            let stateClass = revealed ? "" : " lab-choose-opt-invite";
            if (revealed && best) {
              stateClass = " is-correct";
            } else if (revealed && isPicked && partly) {
              stateClass = " is-partly";
            } else if (revealed && isPicked) {
              stateClass = " is-miss";
            } else if (revealed) {
              stateClass = " is-dimmed";
            }

            return (
              <button
                key={guess.id}
                type="button"
                role="radio"
                aria-checked={isPicked}
                disabled={revealed}
                onClick={() => setPicked(guess.id)}
                className={`lab-choose-opt${stateClass}`}
              >
                <span className="lab-choose-mark" aria-hidden>
                  {MARKS[optionIndex]}
                </span>
                <span className="lab-choose-label">{guess.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {revealed ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 max-w-2xl"
          >
            <p
              className="text-[0.68rem] font-bold uppercase tracking-[0.14em]"
              style={{ color: feedbackColor }}
            >
              {feedbackLabel}
            </p>
            <div className="lab-crt mt-4 px-5 py-6">
              <p className="relative z-10 text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
                {t("lesson2.twist.headline")}
              </p>
              <ul className="relative z-10 mt-5 space-y-2 text-sm text-[var(--lab-phosphor-dim)]">
                <li>{t("lesson2.twist.bullet1")}</li>
                <li>{t("lesson2.twist.bullet2")}</li>
                <li>{t("lesson2.twist.bullet3")}</li>
              </ul>
              <p className="relative z-10 mt-5 text-sm text-[var(--lab-phosphor-dim)]">
                {t("lesson2.twist.close")}
              </p>
            </div>
            <LabContinue onClick={onContinue} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </LabFrame>
  );
}
