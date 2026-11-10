"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  LibraryContinue,
  LibraryFrame,
  LibraryLine,
  LibraryTitle,
} from "@/components/lesson3/LibraryFrame";
import { useLesson3Copy } from "@/lib/useLesson3Copy";
import { useTrackChoice } from "@/lib/analytics/useTrackChoice";
import { QStep, qid } from "@/lib/analytics/questionIds";

type Props = {
  onContinue: (picked: string[]) => void;
};

export function DetectivePick({ onContinue }: Props) {
  const {
    t,
    detectiveSets,
    detectiveLimit,
    detectiveFeedbackFor,
    formatKeptList,
  } = useLesson3Copy();
  const trackChoice = useTrackChoice();
  const [picked, setPicked] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);

  const selected = useMemo(
    () => detectiveSets.filter((d) => picked.includes(d.id)),
    [detectiveSets, picked],
  );
  const feedback = useMemo(
    () => detectiveFeedbackFor(selected.map((d) => d.bucket)),
    [detectiveFeedbackFor, selected],
  );

  function toggle(id: string) {
    if (revealed) return;
    setPicked((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= detectiveLimit) return prev;
      return [...prev, id];
    });
  }

  return (
    <LibraryFrame>
      <LibraryTitle plaque={t("lesson3.detective.plaque")}>
        {t("lesson3.detective.title")}
      </LibraryTitle>
      <LibraryLine>{t("lesson3.detective.subhead")}</LibraryLine>

      <p className="mt-4 text-sm font-semibold text-mute">
        {t("lesson3.detective.selected", {
          count: picked.length,
          limit: detectiveLimit,
        })}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {detectiveSets.map((dataset, i) => {
          const on = picked.includes(dataset.id);
          const full = picked.length >= detectiveLimit && !on;
          return (
            <button
              key={dataset.id}
              type="button"
              disabled={revealed || full}
              onClick={() => toggle(dataset.id)}
              className={`library-doc text-left transition disabled:cursor-not-allowed ${
                on ? "ring-2 ring-[var(--lib-bookmark)]/35" : ""
              } ${full ? "opacity-40" : ""} ${
                i % 3 === 1
                  ? "library-drift"
                  : i % 3 === 2
                    ? "library-drift-delayed"
                    : ""
              }`}
              style={on ? { background: "var(--lib-bookmark-soft)" } : undefined}
            >
              <p className="font-semibold text-ink">{dataset.label}</p>
              <p className="mt-1 text-sm text-ink-soft">{dataset.note}</p>
            </button>
          );
        })}
      </div>

      {!revealed ? (
        <LibraryContinue
          label={t("lesson3.detective.lock")}
          disabled={picked.length !== detectiveLimit}
          onClick={() => setRevealed(true)}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 max-w-2xl"
        >
          <p className="library-title text-[1.65rem] sm:text-[2rem]">
            {t("lesson3.detective.revealTitle")}
          </p>
          <p className="library-line mt-3">
            {t("lesson3.detective.youKept", {
              list: formatKeptList(selected.map((d) => d.label)),
            })}
          </p>
          <p className="mt-4 text-base text-ink-soft">{feedback}</p>
          <ul className="mt-4 space-y-1 text-sm text-ink-soft">
            <li>{t("lesson3.detective.questions.q1")}</li>
            <li>{t("lesson3.detective.questions.q2")}</li>
            <li>{t("lesson3.detective.questions.q3")}</li>
            <li>{t("lesson3.detective.questions.q4")}</li>
          </ul>
          <LibraryContinue
            label={t("lesson3.detective.cta")}
            onClick={() => {
              for (const id of picked) {
                trackChoice({
                  questionId: qid(QStep.detective, id),
                  selectedOptionId: "kept",
                });
              }
              onContinue(picked);
            }}
          />
        </motion.div>
      )}
    </LibraryFrame>
  );
}
