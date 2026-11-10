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
import type { DialDirection } from "@/lib/lesson4-data";

type Phase = "dial" | "reveal";

type Props = {
  onContinue: () => void;
};

export function WhichWay({ onContinue }: Props) {
  const { t, formatPrediction, scoreLine, animalLabel, dialExamples } =
    useLesson4Copy();
  const [phase, setPhase] = useState<Phase>("dial");
  const [index, setIndex] = useState(0);
  const [push, setPush] = useState<DialDirection | null>(null);
  const [correctPush, setCorrectPush] = useState(false);

  const example = dialExamples[index];
  const total = dialExamples.length;

  function handlePush(direction: DialDirection) {
    setPush(direction);
    setCorrectPush(direction === example.correctDirection);
  }

  function nextExample() {
    if (index >= total - 1) {
      setPhase("reveal");
      return;
    }
    setIndex((i) => i + 1);
    setPush(null);
    setCorrectPush(false);
  }

  if (phase === "reveal") {
    return (
      <FacilityFrame>
        <p className="facility-title max-w-3xl">
          {t("lesson4.whichWay.revealTitle")}
        </p>
        <p className="facility-line mt-8 max-w-2xl">
          {t("lesson4.whichWay.revealBody")}
        </p>
        <FacilityContinue
          label={t("lesson4.whichWay.cta")}
          onClick={onContinue}
        />
      </FacilityFrame>
    );
  }

  const isCorrect = push !== null && push === example.correctDirection;
  const isWrong = push !== null && push !== example.correctDirection;

  const prediction =
    push === null
      ? formatPrediction(example.startLabel, example.startConfidence)
      : isCorrect
        ? formatPrediction(
            example.afterCorrectLabel,
            example.afterCorrectConfidence,
          )
        : formatPrediction(example.afterWrongLabel, example.afterWrongConfidence);

  const score = push ? scoreLine(example, push) : null;

  const isFirst = index === 0;
  const isLast = index >= total - 1;
  const ctaLabel = isLast
    ? t("lesson4.whichWay.whatHappened")
    : isFirst
      ? t("lesson4.whichWay.again")
      : t("lesson4.whichWay.next");

  return (
    <FacilityFrame>
      <FacilityTitle
        plaque={
          isFirst
            ? t("lesson4.whichWay.plaqueFirst")
            : t("lesson4.whichWay.plaqueN", { index: index + 1, total })
        }
      >
        {t("lesson4.whichWay.title")}
      </FacilityTitle>
      <FacilityLine>{t("lesson4.whichWay.subhead")}</FacilityLine>

      <div className="facility-monitor mt-8 max-w-lg px-5 py-6 sm:px-7">
        <p className="text-center text-5xl" aria-hidden>
          {example.emoji}
        </p>
        <dl className="mt-5 grid gap-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-[var(--fac-line)] pb-2">
            <dt className="text-[var(--fac-mute)]">
              {t("lesson4.whichWay.modelSaid")}
            </dt>
            <dd
              className={`font-semibold tabular-nums ${
                isWrong ? "text-[var(--fac-warn)]" : ""
              }`}
            >
              {prediction}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--fac-mute)]">{t("lesson4.whichWay.truth")}</dt>
            <dd className="font-semibold">{animalLabel(example.truth)}</dd>
          </div>
        </dl>

        <div className="mt-8">
          <div className="mb-3 flex justify-between text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--fac-mute)]">
            <span>{t("lesson4.whichWay.towardCat")}</span>
            <span>{t("lesson4.whichWay.towardDog")}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={correctPush}
              onClick={() => handlePush("toward-cat")}
              className="facility-choice text-center"
              aria-pressed={push === "toward-cat"}
            >
              {t("lesson4.whichWay.pushCat")}
            </button>
            <button
              type="button"
              disabled={correctPush}
              onClick={() => handlePush("toward-dog")}
              className="facility-choice text-center"
              aria-pressed={push === "toward-dog"}
            >
              {t("lesson4.whichWay.pushDog")}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {score ? (
            <motion.div
              key={`${index}-${push}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5"
              aria-live="polite"
            >
              {isWrong ? (
                <p className="text-sm font-semibold text-[var(--fac-warn)]">
                  {t("lesson4.whichWay.oops", { prediction })}
                </p>
              ) : null}
              <p
                className={`mt-1 text-sm font-semibold tabular-nums ${
                  isCorrect
                    ? "text-[var(--fac-accent)]"
                    : "text-[var(--fac-warn)]"
                }`}
              >
                {score}
              </p>
              {isWrong ? (
                <p className="mt-2 text-sm text-[var(--fac-ink-soft)]">
                  {t("lesson4.whichWay.pushOther")}
                </p>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {correctPush ? (
        <FacilityContinue label={ctaLabel} onClick={nextExample} />
      ) : null}
    </FacilityFrame>
  );
}
