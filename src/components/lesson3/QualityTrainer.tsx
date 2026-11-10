"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { LibraryContinue } from "@/components/lesson3/LibraryFrame";
import { useLesson3Copy } from "@/lib/useLesson3Copy";
import {
  TRAINER_CASES,
  accuracyFromCounts,
  imageIndexForCount,
} from "@/lib/lesson3-data";

type AddedPhoto = {
  caseId: string;
  src: string;
};

type Feedback =
  | { kind: "empty" }
  | { kind: "new"; kindName: string }
  | { kind: "duplicate" }
  | { kind: "mono"; total: number; accuracy: number }
  | { kind: "ceiling" };

type Props = {
  onContinue: () => void;
};

export function QualityTrainer({ onContinue }: Props) {
  const { t, trainerCases } = useLesson3Copy();
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(TRAINER_CASES.map((c) => [c.id, 0])),
  );
  const [added, setAdded] = useState<AddedPhoto[]>([]);
  const [feedback, setFeedback] = useState<Feedback>({ kind: "empty" });
  const [lastDelta, setLastDelta] = useState(0);

  const accuracy = useMemo(() => accuracyFromCounts(counts), [counts]);
  const totalPhotos = added.length;
  const kindsUsed = useMemo(
    () => TRAINER_CASES.filter((c) => (counts[c.id] ?? 0) > 0).length,
    [counts],
  );

  const feedbackMessage =
    feedback.kind === "empty"
      ? t("lesson3.quality.trainer.empty")
      : feedback.kind === "new"
        ? t("lesson3.quality.trainer.newKind", { kind: feedback.kindName })
        : feedback.kind === "mono"
          ? t("lesson3.quality.trainer.mono", {
              total: feedback.total,
              accuracy: feedback.accuracy,
            })
          : feedback.kind === "ceiling"
            ? t("lesson3.quality.trainer.ceiling")
            : t("lesson3.quality.trainer.duplicate");

  function addPhoto(caseId: string) {
    const caseMeta = trainerCases.find((c) => c.id === caseId)!;
    const prevCount = counts[caseId] ?? 0;
    const nextCount = prevCount + 1;
    const src = caseMeta.images[imageIndexForCount(nextCount)];

    const prev = accuracyFromCounts(counts);
    const next = { ...counts, [caseId]: nextCount };
    const nextAcc = accuracyFromCounts(next);
    const delta = nextAcc - prev;
    const nextKinds = TRAINER_CASES.filter((c) => (next[c.id] ?? 0) > 0).length;
    const nextTotal = Object.values(next).reduce((a, b) => a + b, 0);

    setCounts(next);
    setAdded((list) => [...list, { caseId, src }]);
    setLastDelta(delta);

    if (nextAcc >= 97) {
      setFeedback({ kind: "ceiling" });
    } else if (prevCount === 0) {
      setFeedback({ kind: "new", kindName: caseMeta.short });
    } else if (nextKinds === 1 && nextTotal >= 4) {
      setFeedback({ kind: "mono", total: nextTotal, accuracy: nextAcc });
    } else {
      setFeedback({ kind: "duplicate" });
    }
  }

  function reset() {
    setCounts(Object.fromEntries(TRAINER_CASES.map((c) => [c.id, 0])));
    setAdded([]);
    setFeedback({ kind: "empty" });
    setLastDelta(0);
  }

  const canContinue = kindsUsed >= 2 || totalPhotos >= 3;

  const srSummary = t("lesson3.quality.trainer.srSummary", {
    accuracy,
    kinds: kindsUsed,
    photos: totalPhotos,
    feedback: feedbackMessage,
  });

  return (
    <div className="mt-2 flex flex-1 flex-col">
      <div className="overflow-hidden rounded-sm border border-[rgba(26,35,48,0.14)] bg-[#0a0c10] px-5 py-6 sm:px-7 sm:py-8">
        <p className="sr-only" aria-live="polite">
          {srSummary}
        </p>

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <motion.span
            key={accuracy}
            initial={{ opacity: 0.5, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-[family-name:var(--font-library)] text-5xl font-semibold tracking-tight text-white sm:text-6xl"
          >
            {accuracy}%
          </motion.span>
          <span className="text-sm text-[#8b939c]">
            {t("lesson3.quality.trainer.accuracyLabel")}
            {lastDelta > 0 && totalPhotos > 0 && feedback.kind !== "ceiling" ? (
              <span
                className={
                  feedback.kind === "new" ? "text-[#60a5fa]" : "text-[#6b7580]"
                }
              >
                {" "}
                · +{lastDelta}%
              </span>
            ) : null}
          </span>
          <span className="w-full text-sm text-[#8b939c] sm:ml-auto sm:w-auto">
            {t("lesson3.quality.trainer.kindsCovered")}{" "}
            <span className="font-semibold text-[#c5cbd2]">
              {kindsUsed} / {TRAINER_CASES.length}
            </span>
          </span>
        </div>

        <div
          className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-white/15"
          aria-hidden
        >
          <motion.div
            className="h-full rounded-full bg-white"
            initial={false}
            animate={{ width: `${accuracy}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={feedbackMessage}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`mt-5 text-sm sm:text-base ${
              feedback.kind === "new" || feedback.kind === "ceiling"
                ? "text-[#60a5fa]"
                : feedback.kind === "mono"
                  ? "text-[#f0b27a]"
                  : feedback.kind === "duplicate"
                    ? "text-[#9aa3ad]"
                    : "text-[#8b939c]"
            }`}
          >
            {feedbackMessage}
          </motion.p>
        </AnimatePresence>

        <p className="mt-8 font-[family-name:var(--font-figtree)] text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#6b7580]">
          {t("lesson3.quality.trainer.addCue")}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3">
          {trainerCases.map((c) => {
            const n = counts[c.id] ?? 0;
            const thumbSrc = c.images[Math.min(n, 2)];
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => addPhoto(c.id)}
                aria-label={t("lesson3.quality.trainer.addAria", {
                  alt: c.alt,
                  n,
                })}
                className="group flex flex-col items-center gap-2 rounded-sm border border-white/15 bg-transparent px-3 py-3 text-center transition hover:border-white/35 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]"
              >
                <div className="relative">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-white/10 bg-white/5 sm:h-[4.5rem] sm:w-[4.5rem]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={thumbSrc}
                      src={thumbSrc}
                      alt={c.alt}
                      width={72}
                      height={72}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {n > 0 ? (
                    <span className="absolute -right-1.5 -top-1.5 rounded-sm bg-black/80 px-1.5 py-0.5 font-[family-name:var(--font-figtree)] text-[0.65rem] font-bold text-[#93c5fd]">
                      ×{n}
                    </span>
                  ) : null}
                </div>
                <span className="text-sm leading-snug text-[#c5cbd2]">
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#8b939c]">
              {totalPhotos === 1
                ? t("lesson3.quality.trainer.setCountOne", { count: totalPhotos })
                : t("lesson3.quality.trainer.setCountMany", {
                    count: totalPhotos,
                  })}
              {kindsUsed > 0 ? (
                <span className="text-[#6b7580]">
                  {kindsUsed === 1
                    ? t("lesson3.quality.trainer.kindsOne", { count: kindsUsed })
                    : t("lesson3.quality.trainer.kindsMany", {
                        count: kindsUsed,
                      })}
                </span>
              ) : null}
            </p>
            <button
              type="button"
              onClick={reset}
              disabled={totalPhotos === 0}
              className="rounded-sm border border-white/15 px-3 py-1.5 text-sm text-[#9aa3ad] transition enabled:hover:border-white/35 enabled:hover:text-white disabled:opacity-35"
            >
              {t("lesson3.quality.trainer.reset")}
            </button>
          </div>

          {added.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {added.map((photo, i) => (
                <motion.li
                  key={`${photo.src}-${i}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="shrink-0"
                >
                  <div className="h-10 w-10 overflow-hidden rounded-sm border border-white/15 bg-white/5 sm:h-12 sm:w-12">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt=""
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-mute sm:text-left">
        {t("lesson3.quality.trainer.disclaimer")}
      </p>

      <LibraryContinue disabled={!canContinue} onClick={onContinue} />
    </div>
  );
}
