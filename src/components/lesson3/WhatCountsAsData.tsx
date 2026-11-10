"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  LibraryContinue,
  LibraryFrame,
  LibraryLine,
  LibraryTitle,
} from "@/components/lesson3/LibraryFrame";
import { useLesson3Copy } from "@/lib/useLesson3Copy";
import type { DataAnswer } from "@/lib/lesson3-data";

type Props = {
  onContinue: () => void;
};

const OPTION_IDS: { id: DataAnswer; mark: string }[] = [
  { id: "yes", mark: "A" },
  { id: "no", mark: "B" },
  { id: "maybe", mark: "C" },
];

export function WhatCountsAsData({ onContinue }: Props) {
  const { t, dataCards, answerLabel } = useLesson3Copy();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<DataAnswer | null>(null);
  const [results, setResults] = useState<
    { id: string; label: string; picked: DataAnswer; answer: DataAnswer; matched: boolean }[]
  >([]);

  const finished = index >= dataCards.length;
  const card = dataCards[index];
  const matchedCount = results.filter((result) => result.matched).length;

  if (finished) {
    return (
      <LibraryFrame>
        <LibraryTitle plaque={t("lesson3.data.insight.plaque")}>
          {t("lesson3.data.insight.title")}
        </LibraryTitle>
        <LibraryLine>{t("lesson3.data.insight.subhead")}</LibraryLine>
        <p className="mt-3 text-sm text-ink-soft">
          {t("lesson3.data.insight.aside")}
        </p>
        <p className="mt-4 text-sm font-medium text-ink-soft">
          {t("lesson3.data.insight.score", {
            matched: matchedCount,
            total: dataCards.length,
          })}
        </p>

        <ul className="mt-6 max-w-2xl divide-y divide-[rgba(26,35,48,0.08)] border-y border-[rgba(26,35,48,0.08)]">
          {results.map(({ id, label, picked: choice, answer, matched }, i) => (
            <motion.li
              key={id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.35) }}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
            >
              <span className="font-[family-name:var(--font-library)] text-lg tracking-tight text-ink">
                {label}
              </span>
              <span className="flex flex-wrap items-baseline gap-x-3 text-sm">
                <span
                  className="font-[family-name:var(--font-figtree)] text-[0.65rem] font-bold uppercase tracking-[0.12em]"
                  style={{
                    color: matched ? "var(--lib-ok)" : "var(--lib-warn)",
                  }}
                >
                  {matched
                    ? t("lesson3.shared.matched")
                    : t("lesson3.shared.missed")}
                </span>
                <span className="text-ink-soft">
                  {matched
                    ? t("lesson3.data.insight.you", {
                        choice: answerLabel(choice),
                      })
                    : t("lesson3.data.insight.youAndAnswer", {
                        choice: answerLabel(choice),
                        answer: answerLabel(answer),
                      })}
                </span>
              </span>
            </motion.li>
          ))}
        </ul>

        <LibraryContinue onClick={onContinue} />
      </LibraryFrame>
    );
  }

  const revealed = picked !== null;
  const isCorrect = picked === card.answer;

  return (
    <LibraryFrame>
      <LibraryTitle
        compact
        plaque={t("lesson3.data.plaque", {
          index: index + 1,
          total: dataCards.length,
        })}
      >
        {t("lesson3.data.title")}
      </LibraryTitle>
      <LibraryLine compact>{t("lesson3.data.subhead")}</LibraryLine>

      <div className="mt-4 grid w-full gap-5 lg:grid-cols-[minmax(14rem,22rem)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className="library-exhibit px-4 py-4 md:px-6 md:py-7" aria-hidden={false}>
          <p className="library-eyebrow">{t("lesson3.data.document")}</p>
          <p className="mt-3 font-[family-name:var(--font-library)] text-xl font-semibold tracking-tight text-ink md:text-3xl">
            {card.label}
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-2.5">
          <p className="library-choice-cue">{t("lesson3.shared.chooseOne")}</p>
          <div
            className="grid grid-cols-3 gap-2.5"
            role="radiogroup"
            aria-label={t("lesson3.data.chooseAria")}
          >
            {OPTION_IDS.map((option) => {
              const isAnswer = option.id === card.answer;
              const isPicked = picked === option.id;
              let stateClass = "";
              if (!revealed) {
                stateClass = " library-choice-invite";
              } else if (isAnswer) {
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
                  className={`library-choice library-choice-marked library-choice-compact text-left${stateClass}`}
                >
                  <span className="library-choice-mark" aria-hidden>
                    {option.mark}
                  </span>
                  <span>{answerLabel(option.id)}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {revealed ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 border-t border-[var(--lib-paper-edge)] pt-3"
              >
                <p
                  className="font-[family-name:var(--font-figtree)] text-xs font-bold uppercase tracking-[0.14em]"
                  style={{
                    color: isCorrect ? "var(--lib-ok)" : "var(--lib-warn)",
                  }}
                >
                  {isCorrect
                    ? t("lesson3.shared.feedback.correct")
                    : t("lesson3.shared.feedback.notQuite")}
                </p>
                <p className="mt-2 text-sm leading-snug text-ink-soft sm:text-[0.95rem] sm:leading-relaxed">
                  {card.note}
                </p>
                <LibraryContinue
                  className="mt-4"
                  label={
                    index === dataCards.length - 1
                      ? t("lesson3.data.seePattern")
                      : t("lesson3.data.next")
                  }
                  onClick={() => {
                    if (!picked) return;
                    setResults((prev) => [
                      ...prev,
                      {
                        id: card.id,
                        label: card.label,
                        picked,
                        answer: card.answer,
                        matched: picked === card.answer,
                      },
                    ]);
                    setPicked(null);
                    setIndex((i) => i + 1);
                  }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </LibraryFrame>
  );
}
