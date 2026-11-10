"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  LibraryContinue,
  LibraryFrame,
  LibraryLine,
  LibraryTitle,
} from "@/components/lesson3/LibraryFrame";
import { QualityTrainer } from "@/components/lesson3/QualityTrainer";
import { useLesson3Copy } from "@/lib/useLesson3Copy";

type Props = {
  onContinue: () => void;
};

export function BiggerIsntBetter({ onContinue }: Props) {
  const { t, datasets } = useLesson3Copy();
  const [phase, setPhase] = useState<"train" | "pick">("train");
  const [picked, setPicked] = useState<string | null>(null);
  const revealed = picked !== null;

  if (phase === "train") {
    return (
      <LibraryFrame>
        <LibraryTitle plaque={t("lesson3.quality.plaque")}>
          {t("lesson3.quality.title")}
        </LibraryTitle>
        <LibraryLine>{t("lesson3.quality.trainSub")}</LibraryLine>
        <QualityTrainer onContinue={() => setPhase("pick")} />
      </LibraryFrame>
    );
  }

  return (
    <LibraryFrame>
      <LibraryTitle plaque={t("lesson3.quality.plaque")}>
        {t("lesson3.quality.title")}
      </LibraryTitle>
      <LibraryLine>{t("lesson3.quality.pickSub")}</LibraryLine>

      <p className="library-choice-cue mt-6">{t("lesson3.shared.chooseOne")}</p>
      <div
        className="mt-3 grid gap-3 sm:grid-cols-2"
        role="radiogroup"
        aria-label={t("lesson3.quality.pickAria")}
      >
        {datasets.map((option, i) => {
          const mark = String.fromCharCode(65 + i);
          const isBest = option.answer === "best";
          const isPicked = picked === option.id;
          let stateClass = "";
          if (!revealed) {
            stateClass = " library-choice-invite";
          } else if (isBest) {
            stateClass = " is-correct";
          } else if (isPicked) {
            stateClass = " is-miss";
          } else {
            stateClass = " is-dimmed";
          }

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isPicked}
              disabled={revealed}
              onClick={() => setPicked(option.id)}
              className={`library-choice library-choice-marked text-left${stateClass}`}
            >
              <span className="library-choice-mark" aria-hidden>
                {mark}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-ink">{option.label}</span>
                {revealed ? (
                  <span className="mt-1.5 block text-sm font-normal text-ink-soft">
                    {option.note}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {revealed ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 max-w-2xl"
          >
            <p className="library-title text-[1.65rem] sm:text-[2rem]">
              {t("lesson3.quality.punchline")}
            </p>
            <p className="library-line mt-3">{t("lesson3.quality.followUp")}</p>
            <LibraryContinue onClick={onContinue} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </LibraryFrame>
  );
}
