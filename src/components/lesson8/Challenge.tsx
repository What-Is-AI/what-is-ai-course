"use client";

import { useEffect, useState } from "react";
import { ChooseHelper } from "@/components/lesson8/ChooseHelper";
import {
  ReadingRoomContinue,
  ReadingRoomFrame,
  ReadingRoomLine,
  ReadingRoomTitle,
} from "@/components/lesson8/ReadingRoomFrame";
import {
  useLesson8Chrome,
  useLesson8LocaleData,
  useLesson8StepCopy,
} from "@/lib/useLesson8Copy";
import type { ChallengeOption } from "@/lib/lesson8-data";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion?: boolean;
};

type Answers = Record<string, ChallengeOption["id"]>;

/** S12 – Final challenge: 5 MC, keyboard + screen reader. */
export function Challenge({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson8StepCopy();
  const copy = steps.challenge;
  const chrome = useLesson8Chrome();
  const ui: Record<string, string> = chrome.challenge ?? {};
  const localeData = useLesson8LocaleData();
  const questions = localeData.challengeQuestions;
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);

  const answeredCount = Object.keys(answers).length;
  const allDone = answeredCount >= questions.length;
  const score = questions.reduce(
    (n, q) => n + (answers[q.id] === q.correctId ? 1 : 0),
    0,
  );

  useEffect(() => {
    if (allDone && !gateOpen) onGate();
  }, [allDone, gateOpen, onGate]);

  const q = questions[index]!;
  const chosen = answers[q.id];
  const revealed = chosen != null;

  function choose(id: ChallengeOption["id"]) {
    if (answers[q.id]) return;
    setAnswers((prev) => ({ ...prev, [q.id]: id }));
  }

  function goNext() {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
    }
  }

  return (
    <ReadingRoomFrame>
      <div className="rr-stage">
        <div className="rr-stage-copy">
          <ReadingRoomTitle plaque={copy.plaque} compact>
            {copy.title}
          </ReadingRoomTitle>
          <ReadingRoomLine compact>{copy.body}</ReadingRoomLine>
          <p className="rr-gate-hint" aria-live="polite">
            {(
              ui.progress ??
              "{scoreLabel}: {score} / {total} · Question {n} of {total}"
            )
              .replaceAll("{scoreLabel}", copy.scoreLabel)
              .replaceAll("{score}", String(score))
              .replaceAll("{total}", String(questions.length))
              .replaceAll("{n}", String(index + 1))}
          </p>

          {allDone ? (
            <>
              <p className="rr-surprise" aria-live="polite">
                {copy.scoreLabel}: {score} / {questions.length}
              </p>
              <ReadingRoomContinue
                label={copy.cta}
                onClick={onContinue}
                disabled={!gateOpen}
              />
            </>
          ) : null}
        </div>

        <div className="rr-stage-action">
          {!revealed ? <ChooseHelper /> : null}
          <fieldset className="rr-challenge-q">
            <legend className="rr-instruct">
              {index + 1}. {q.prompt}
            </legend>
            <div
              className="rr-challenge-options"
              role="radiogroup"
              aria-label={q.prompt}
            >
              {q.options.map((opt) => {
                const selected = chosen === opt.id;
                const isCorrect = opt.id === q.correctId;
                const showMark = revealed && (selected || isCorrect);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={revealed}
                    className={[
                      "rr-challenge-option",
                      selected ? "is-selected" : "",
                      revealed && isCorrect ? "is-correct" : "",
                      revealed && selected && !isCorrect ? "is-wrong" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => choose(opt.id)}
                  >
                    <span className="rr-challenge-letter">{opt.id}</span>
                    <span>{opt.text}</span>
                    {showMark && isCorrect ? (
                      <span className="sr-only"> {ui.correctMark}</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {revealed ? (
            <div className="rr-challenge-feedback" role="status">
              {chosen === q.correctId ? (
                <>
                  <p className="rr-surprise">{copy.correctLabel}</p>
                  <ReadingRoomLine compact>{q.correctFeedback}</ReadingRoomLine>
                </>
              ) : (
                <>
                  <p className="rr-instruct">{copy.wrongLabel}</p>
                  <ReadingRoomLine compact>{q.wrongFeedback}</ReadingRoomLine>
                </>
              )}
              {index < questions.length - 1 ? (
                <div className="rr-action-bar">
                  <ChooseHelper>{ui.pressForNext}</ChooseHelper>
                  <button
                    type="button"
                    className="rr-btn rr-btn-operate"
                    onClick={goNext}
                  >
                    {ui.nextQuestion}
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </ReadingRoomFrame>
  );
}
