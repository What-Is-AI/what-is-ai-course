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
import { QStep, qid } from "@/lib/analytics/questionIds";

type Phase = "try" | "reveal";

type Props = {
  onContinue: () => void;
};

export function FirstPrediction({ onContinue }: Props) {
  const { t, instincts, startGuess } = useLesson4Copy();
  const trackChoice = useTrackChoice();
  const [phase, setPhase] = useState<Phase>("try");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tried, setTried] = useState<Record<string, boolean>>({});
  const [prediction, setPrediction] = useState(startGuess);

  const active = instincts.find((instinct) => instinct.id === activeId) ?? null;
  const allTried = instincts.every((instinct) => tried[instinct.id]);

  function tryInstinct(id: string) {
    const instinct = instincts.find((item) => item.id === id);
    if (!instinct) return;
    setActiveId(instinct.id);
    setTried((prev) => ({ ...prev, [instinct.id]: true }));
    trackChoice({
      questionId: qid(QStep.instinct, instinct.id),
      selectedOptionId: instinct.survives ? "survives" : "fails",
    });
    if (instinct.survives && instinct.successTo) {
      setPrediction(instinct.successTo);
    } else {
      setPrediction(startGuess);
    }
  }

  return (
    <FacilityFrame>
      <AnimatePresence mode="wait">
        {phase === "try" ? (
          <motion.div
            key="try"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <FacilityTitle compact plaque={t("lesson4.firstPrediction.plaque")}>
              {t("lesson4.firstPrediction.title")}
            </FacilityTitle>
            <FacilityLine compact>
              {t("lesson4.firstPrediction.subhead")}
            </FacilityLine>

            <div className="mt-5 grid max-w-4xl gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(14rem,17rem)] sm:items-start">
              <div>
                <p className="facility-choice-cue">
                  {t("lesson4.firstPrediction.tryEach")}
                </p>
                <div className="mt-3 grid gap-3">
                  {instincts.map((instinct, i) => {
                    const done = tried[instinct.id];
                    const mark = String.fromCharCode(65 + i);
                    return (
                      <button
                        key={instinct.id}
                        type="button"
                        onClick={() => tryInstinct(instinct.id)}
                        aria-pressed={active?.id === instinct.id}
                        className={`facility-choice facility-choice-marked${
                          !done ? " facility-choice-invite" : ""
                        }${
                          done && instinct.survives
                            ? " border-[var(--fac-accent)] bg-[var(--fac-ok-soft)]"
                            : done
                              ? " border-[var(--fac-warn)]/50"
                              : ""
                        }`}
                      >
                        <span className="facility-choice-mark" aria-hidden>
                          {mark}
                        </span>
                        <span>
                          {instinct.label}
                          {done ? (
                            <span className="mt-1 block text-xs font-medium text-[var(--fac-mute)]">
                              {instinct.survives
                                ? t("lesson4.firstPrediction.survived")
                                : t("lesson4.firstPrediction.broke")}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex min-h-0 flex-col gap-3 md:min-h-[18rem]">
                <div className="facility-monitor flex flex-col items-center justify-center px-4 py-4">
                  <p className="text-4xl" aria-hidden>
                    🐱
                  </p>
                  <p className="mt-2 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--fac-mute)]">
                    {t("lesson4.firstPrediction.sameCat")}
                  </p>
                  <p className="mt-3 text-sm font-semibold tabular-nums text-[var(--fac-warn)]">
                    {t("lesson4.firstPrediction.was")}
                  </p>
                  <p className="mt-1 text-sm font-semibold tabular-nums">
                    {t("lesson4.firstPrediction.now", { prediction })}
                  </p>
                </div>

                <div
                  className="facility-panel flex min-h-[8.5rem] flex-1 flex-col justify-center px-4 py-4"
                  aria-live="polite"
                >
                  <AnimatePresence mode="wait">
                    {active ? (
                      <motion.div
                        key={active.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                      >
                        {active.survives ? (
                          <>
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--fac-accent)]">
                              {t("lesson4.firstPrediction.shifted")}
                            </p>
                            <p className="mt-2 text-base font-semibold tabular-nums">
                              {active.successFrom} → {active.successTo}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-[var(--fac-ink-soft)]">
                              {active.successLine}
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-3">
                              <p className="text-3xl" aria-hidden>
                                {active.failureEmoji}
                              </p>
                              <div>
                                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--fac-warn)]">
                                  {t("lesson4.firstPrediction.counterexample")}
                                </p>
                                <p className="mt-1 text-sm font-semibold">
                                  {active.failureCaption}
                                </p>
                              </div>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-[var(--fac-ink-soft)]">
                              {active.failureLine}
                            </p>
                          </>
                        )}
                      </motion.div>
                    ) : (
                      <motion.p
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-[var(--fac-mute)]">
                        {t("lesson4.firstPrediction.idle")}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="mt-5">
              {!allTried ? (
                <p className="mb-3 text-sm text-[var(--fac-mute)]">
                  {t("lesson4.firstPrediction.tryAll")}
                </p>
              ) : null}
              <FacilityContinue
                label={t("lesson4.firstPrediction.cta")}
                disabled={!allTried}
                onClick={() => setPhase("reveal")}
                className="mt-0"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FacilityLine>{t("lesson4.firstPrediction.revealBody")}</FacilityLine>
            <p className="facility-line mt-6">
              {t("lesson4.firstPrediction.raise")}
            </p>
            <p className="facility-title mt-4 max-w-3xl">
              {t("lesson4.firstPrediction.question")}
            </p>
            <FacilityContinue
              label={t("lesson4.firstPrediction.showMe")}
              onClick={onContinue}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </FacilityFrame>
  );
}
