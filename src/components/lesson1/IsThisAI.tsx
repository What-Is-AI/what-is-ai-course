"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { LiveRegion } from "@/components/lesson1/a11y";
import {
  MuseumContinue,
  MuseumFrame,
  MuseumLine,
  MuseumTitle,
} from "@/components/lesson1/MuseumFrame";
import { useLesson1Copy } from "@/lib/useLesson1Copy";
import { useTrackChoice } from "@/lib/analytics/useTrackChoice";
import { QStep, qid } from "@/lib/analytics/questionIds";

type Props = {
  onContinue: () => void;
};

const SLIDE = { type: "spring" as const, stiffness: 420, damping: 34 };

function kindColor(kind: "learned" | "specified" | "hybrid") {
  if (kind === "learned") return "var(--museum-ok)";
  if (kind === "hybrid") return "var(--museum-ink)";
  return "var(--museum-warn)";
}

export function IsThisAI({ onContinue }: Props) {
  const { t, scenarios, scenarioKindLabel } = useLesson1Copy();
  const trackChoice = useTrackChoice();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");

  const scenario = scenarios[index];
  const finished = index >= scenarios.length;

  if (finished) {
    return (
      <MuseumFrame>
        <MuseumTitle
          plaque={t("lesson1.cases.finish.plaque")}
          focusKey="pattern"
        >
          {t("lesson1.cases.finish.title")}
        </MuseumTitle>
        <MuseumLine>{t("lesson1.cases.finish.sub")}</MuseumLine>

        <ul className="museum-case-pattern-grid">
          {scenarios.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              className="museum-case-pattern-row"
            >
              <span className="museum-case-pattern-label">{item.label}</span>
              <span
                className="museum-case-pattern-kind"
                style={{ color: kindColor(item.kind) }}
              >
                {scenarioKindLabel(item.kind)}
              </span>
            </motion.li>
          ))}
        </ul>

        <MuseumContinue onClick={onContinue} />
      </MuseumFrame>
    );
  }

  const revealed = picked !== null;
  const correctOption = scenario.options.find(
    (option) => option.id === scenario.correct,
  );
  const progressAnnounce = t("lesson1.cases.progressAnnounce", {
    index: index + 1,
    total: scenarios.length,
    prompt: scenario.prompt,
  });

  function choose(optionId: string) {
    if (picked) return;
    setPicked(optionId);
    trackChoice({
      questionId: qid(QStep.scenario, scenario.id),
      selectedOptionId: optionId,
      isCorrect: optionId === scenario.correct,
    });
    const option = scenario.options.find((entry) => entry.id === optionId);
    const isCorrect = optionId === scenario.correct;
    setAnnounce(
      [
        t("lesson1.cases.youChose", { choice: option?.label ?? optionId }),
        isCorrect
          ? t("lesson1.cases.correct")
          : t("lesson1.cases.incorrect", { correct: correctOption?.label ?? "" }),
        scenario.reveal,
      ].join(" "),
    );
  }

  function next() {
    setPicked(null);
    setAnnounce("");
    setIndex((prev) => prev + 1);
  }

  return (
    <MuseumFrame>
      <LiveRegion message={announce} />
      <LiveRegion message={progressAnnounce} />
      <MuseumTitle
        plaque={t("lesson1.cases.plaque", {
          index: index + 1,
          total: scenarios.length,
        })}
        focusKey={scenario.id}
      >
        {t("lesson1.cases.title")}
      </MuseumTitle>

      <div className="museum-case-stage">
        <p className="museum-case-prompt">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={scenario.id}
              className="museum-case-swap"
              initial={reduceMotion ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
              transition={SLIDE}
            >
              {scenario.prompt}
            </motion.span>
          </AnimatePresence>
        </p>

        <div className="museum-case">
          <div className="museum-case-head">
            <span className="museum-case-cue" aria-hidden>
              {t("lesson1.shared.chooseOne")}
            </span>
            <span className="museum-case-progress">
              {index + 1} / {scenarios.length}
            </span>
          </div>

          <div
            className="museum-case-options"
            role="radiogroup"
            aria-label={scenario.prompt}
          >
            {scenario.options.map((option, optionIndex) => {
              const isCorrect = option.id === scenario.correct;
              const isPicked = picked === option.id;
              const marker = optionIndex === 0 ? "A" : "B";
              const stateClass = revealed
                ? isCorrect
                  ? " is-correct"
                  : isPicked
                    ? " is-miss"
                    : " is-dimmed"
                : " museum-case-opt-invite";

              return (
                <button
                  key={`slot-${optionIndex}`}
                  type="button"
                  role="radio"
                  aria-checked={isPicked}
                  disabled={revealed}
                  onClick={() => choose(option.id)}
                  className={`museum-case-opt${stateClass}`}
                >
                  <span className="museum-case-opt-mark" aria-hidden>
                    {marker}
                  </span>
                  <span className="museum-case-opt-label">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={`${scenario.id}-${option.id}`}
                        className="museum-case-swap"
                        initial={reduceMotion ? false : { opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={
                          reduceMotion ? { opacity: 0 } : { opacity: 0, x: 12 }
                        }
                        transition={SLIDE}
                      >
                        {option.label}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {revealed ? (
            <motion.div
              key={`${scenario.id}-result`}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="museum-case-result"
            >
              <p className="museum-case-result-body">{scenario.reveal}</p>
              <MuseumContinue
                label={
                  index === scenarios.length - 1
                    ? t("lesson1.cases.seePattern")
                    : t("lesson1.cases.next")
                }
                onClick={next}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </MuseumFrame>
  );
}
