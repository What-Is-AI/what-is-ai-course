"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
  LabContinue,
  LabFrame,
  LabTitle,
} from "@/components/lesson2/LabFrame";
import { RichText } from "@/i18n/RichText";
import { useLesson2Copy } from "@/lib/useLesson2Copy";
import { useTrackChoice } from "@/lib/analytics/useTrackChoice";
import { QStep, qid } from "@/lib/analytics/questionIds";
import type { ApproachAnswer } from "@/lib/lesson2-data";

type Props = {
  onContinue: () => void;
};

const MARKS = ["A", "B", "C"] as const;
const SLIDE = { type: "spring" as const, stiffness: 420, damping: 34 };

export function WhichApproach({ onContinue }: Props) {
  const { t, problems, approachLabel } = useLesson2Copy();
  const trackChoice = useTrackChoice();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<ApproachAnswer | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const finished = index >= problems.length;
  const problem = problems[index];
  const total = problems.length;

  function choicesFor(answer: ApproachAnswer): ApproachAnswer[] {
    if (answer === "hybrid") return ["rules", "learning", "hybrid"];
    return ["rules", "learning"];
  }

  if (finished) {
    return (
      <LabFrame>
        <LabTitle plaque={t("lesson2.approach.summary.plaque")}>
          {t("lesson2.approach.summary.title", {
            score: correctCount,
            total,
          })}
        </LabTitle>
        <p className="lab-line">{t("lesson2.approach.summary.sub")}</p>
        <LabContinue onClick={onContinue} />
      </LabFrame>
    );
  }

  const revealed = picked !== null;
  const isCorrect = picked === problem.answer;
  const options = choicesFor(problem.answer);

  return (
    <LabFrame>
      <LabTitle plaque={t("lesson2.approach.plaque")}>
        {t("lesson2.approach.title")}
      </LabTitle>

      <div className="lab-subject mt-6">
        <p className="lab-eyebrow lab-subject-count" aria-hidden="true">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <div className="lab-subject-card">
          <div className="lab-subject-slot">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={problem.id}
                className="lab-subject-label"
                initial={reduceMotion ? false : { opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: 20, scale: 0.96 }
                }
                transition={SLIDE}
              >
                {problem.label}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="lab-choose mt-6">
        <p className="lab-choose-cue" id="lab-approach-prompt">
          {t("lesson2.shared.chooseOne")}
        </p>
        <div
          className={`lab-choose-options${
            options.length === 3 ? " lab-choose-options-three" : ""
          }`}
          role="radiogroup"
          aria-labelledby="lab-approach-prompt"
          aria-describedby="lab-approach-object"
        >
          {options.map((choice, optionIndex) => {
            const isAnswer = choice === problem.answer;
            const isPicked = picked === choice;
            let stateClass = revealed ? "" : " lab-choose-opt-invite";
            if (revealed && isAnswer) stateClass = " is-correct";
            else if (revealed && isPicked && !isCorrect) stateClass = " is-miss";
            else if (revealed) stateClass = " is-dimmed";

            return (
              <button
                key={choice}
                type="button"
                role="radio"
                aria-checked={isPicked}
                disabled={revealed}
                onClick={() => {
                  setPicked(choice);
                  trackChoice({
                    questionId: qid(QStep.approach, problem.id),
                    selectedOptionId: choice,
                    isCorrect: choice === problem.answer,
                  });
                }}
                className={`lab-choose-opt${stateClass}`}
              >
                <span className="lab-choose-mark" aria-hidden>
                  {MARKS[optionIndex]}
                </span>
                <span className="lab-choose-label">{approachLabel(choice)}</span>
              </button>
            );
          })}
        </div>
      </div>
      <span id="lab-approach-object" className="sr-only">
        {t("lesson2.approach.objectOf", {
          index: index + 1,
          total,
          label: problem.label,
        })}
      </span>

      <AnimatePresence>
        {revealed ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="lab-panel mt-6 max-w-2xl px-5 py-4"
          >
            <p
              className="text-[0.68rem] font-bold uppercase tracking-[0.14em]"
              style={{
                color: isCorrect ? "var(--lab-phosphor)" : "var(--lab-warn)",
              }}
            >
              {isCorrect
                ? t("lesson2.shared.feedback.correct")
                : t("lesson2.shared.feedback.notQuite")}
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              <RichText text={problem.note} />
            </p>
            <LabContinue
              label={
                index === total - 1
                  ? t("lesson2.approach.seeSummary")
                  : t("lesson2.approach.next")
              }
              onClick={() => {
                if (isCorrect) setCorrectCount((n) => n + 1);
                setPicked(null);
                setIndex((i) => i + 1);
              }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </LabFrame>
  );
}
