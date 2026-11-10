"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  StudioContinue,
  StudioFrame,
  StudioLine,
  StudioTitle,
} from "@/components/working-with-llms/StudioFrame";
import {
  PREDICTION_SLIDER_IDS,
  type PredictionSliderValue,
} from "@/lib/working-with-llms-data";
import { useWorkingWithLlmsCopy } from "@/lib/useWorkingWithLlmsCopy";

type Props = {
  onContinue: (guess: PredictionSliderValue) => void;
};

type Phase = "arrive" | "predict" | "reveal";

export function StudioHook({ onContinue }: Props) {
  const { t, sliderOptions } = useWorkingWithLlmsCopy();
  const [phase, setPhase] = useState<Phase>("arrive");
  const [guessIndex, setGuessIndex] = useState(1);
  const [lockedGuess, setLockedGuess] =
    useState<PredictionSliderValue | null>(null);

  const guess = sliderOptions[guessIndex];

  return (
    <AnimatePresence mode="wait">
      {phase === "arrive" ? (
        <StudioFrame key="arrive">
          <StudioTitle plaque={t("workingWithLlms.hook.arrive.plaque")}>
            {t("workingWithLlms.hook.arrive.title")}
          </StudioTitle>
          <StudioLine>{t("workingWithLlms.hook.arrive.subhead")}</StudioLine>
          <StudioContinue
            label={t("workingWithLlms.hook.arrive.cta")}
            onClick={() => setPhase("predict")}
          />
        </StudioFrame>
      ) : null}

      {phase === "predict" ? (
        <StudioFrame key="predict">
          <StudioTitle plaque={t("workingWithLlms.hook.predict.plaque")}>
            {t("workingWithLlms.hook.predict.title")}
          </StudioTitle>
          <StudioLine>{t("workingWithLlms.hook.predict.subhead")}</StudioLine>

          <div className="studio-panel mt-8 max-w-2xl px-5 py-6 sm:px-6">
            <p className="text-sm font-semibold text-[var(--stu-ink)]">
              {t("workingWithLlms.hook.predict.predictionPrompt")}
            </p>
            <p
              className="mt-4 text-lg font-semibold tracking-tight text-[var(--stu-accent)]"
              aria-live="polite"
            >
              {guess.label}
            </p>
            <input
              type="range"
              min={0}
              max={PREDICTION_SLIDER_IDS.length - 1}
              step={1}
              value={guessIndex}
              onChange={(e) => setGuessIndex(Number(e.target.value))}
              aria-label={t("workingWithLlms.hook.predict.predictionPrompt")}
              className="studio-slider mt-5"
            />
            <div className="mt-3 flex justify-between gap-2 text-[0.7rem] font-medium uppercase tracking-[0.08em] text-[var(--stu-mute)]">
              {sliderOptions.map((option) => (
                <span
                  key={option.id}
                  className="max-w-[30%] text-center leading-snug"
                >
                  {option.label}
                </span>
              ))}
            </div>
          </div>

          <StudioContinue
            label={t("workingWithLlms.hook.predict.cta")}
            onClick={() => {
              setLockedGuess(guess.id);
              setPhase("reveal");
            }}
          />
        </StudioFrame>
      ) : null}

      {phase === "reveal" && lockedGuess ? (
        <StudioFrame key="reveal">
          <StudioTitle plaque={t("workingWithLlms.hook.reveal.plaque")}>
            {t("workingWithLlms.hook.reveal.title")}
          </StudioTitle>

          <div className="mt-2 grid max-w-3xl gap-4 sm:grid-cols-2">
            <motion.article
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="studio-panel px-5 py-5"
            >
              <p className="studio-eyebrow">
                {t("workingWithLlms.hook.reveal.designerA.eyebrow")}
              </p>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-[var(--stu-ink-soft)]">
                {t("workingWithLlms.hook.reveal.designerA.body")}
              </p>
            </motion.article>
            <motion.article
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="studio-panel studio-panel-accent px-5 py-5"
            >
              <p className="studio-eyebrow">
                {t("workingWithLlms.hook.reveal.designerB.eyebrow")}
              </p>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-[var(--stu-ink-soft)]">
                {t("workingWithLlms.hook.reveal.designerB.body")}
              </p>
            </motion.article>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mt-8 max-w-2xl text-lg font-semibold tracking-tight text-[var(--stu-ink)]"
          >
            {t("workingWithLlms.hook.reveal.surpriseLine")}
          </motion.p>

          <StudioContinue
            label={t("workingWithLlms.hook.reveal.cta")}
            onClick={() => onContinue(lockedGuess)}
          />
        </StudioFrame>
      ) : null}
    </AnimatePresence>
  );
}
