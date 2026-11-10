"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  LabContinue,
  LabFrame,
  LabLine,
  LabTitle,
} from "@/components/lesson2/LabFrame";
import { RichText } from "@/i18n/RichText";
import { useLesson2Copy } from "@/lib/useLesson2Copy";

type Props = {
  onContinue: () => void;
};

export function ChairAnalogy({ onContinue }: Props) {
  const { t, chairExamples } = useLesson2Copy();
  const [step, setStep] = useState(0);

  return (
    <LabFrame>
      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="ask"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-1 flex-col"
          >
            <LabTitle plaque={t("lesson2.chair.plaque")}>
              {t("lesson2.chair.title")}
            </LabTitle>
            <LabLine>{t("lesson2.chair.subhead")}</LabLine>
            <div className="lab-choose mt-8">
              <p className="lab-choose-cue" id="lab-chair-prompt">
                {t("lesson2.shared.chooseOne")}
              </p>
              <div
                className="lab-choose-options"
                role="radiogroup"
                aria-labelledby="lab-chair-prompt"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={false}
                  onClick={() => setStep(1)}
                  className="lab-choose-opt lab-choose-opt-invite"
                >
                  <span className="lab-choose-mark" aria-hidden>
                    A
                  </span>
                  <span className="lab-choose-label">
                    {t("lesson2.chair.no")}
                  </span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={false}
                  onClick={() => setStep(1)}
                  className="lab-choose-opt lab-choose-opt-invite"
                >
                  <span className="lab-choose-mark" aria-hidden>
                    B
                  </span>
                  <span className="lab-choose-label">
                    {t("lesson2.chair.notReally")}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}

        {step === 1 ? (
          <motion.div
            key="rules"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-1 flex-col"
          >
            <LabTitle>{t("lesson2.chair.rulesTitle")}</LabTitle>
            <LabLine>{t("lesson2.chair.probablyNot")}</LabLine>
            <LabContinue
              label={t("lesson2.chair.thenHow")}
              onClick={() => setStep(2)}
            />
          </motion.div>
        ) : null}

        {step === 2 ? (
          <motion.div
            key="examples"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-1 flex-col"
          >
            <LabTitle>{t("lesson2.chair.thousands")}</LabTitle>
            <div className="mt-6 flex flex-wrap gap-3">
              {chairExamples.map((example, i) => (
                <motion.span
                  key={example}
                  initial={{ opacity: 0, y: 8, rotate: -6 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotate: ((i % 5) - 2) * 2,
                  }}
                  transition={{ delay: i * 0.08 }}
                  className={`lab-sticky ${i % 2 === 1 ? "lab-sticky-alt" : ""}`}
                >
                  {example}
                </motion.span>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 max-w-xl text-lg font-medium text-ink"
            >
              {t("lesson2.chair.punchline")}
            </motion.p>
            <p className="lab-line mt-3">
              <RichText text={t("lesson2.chair.followUp")} />
            </p>
            <LabContinue onClick={onContinue} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </LabFrame>
  );
}
