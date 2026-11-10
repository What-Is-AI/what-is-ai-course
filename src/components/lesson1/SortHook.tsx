"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { LiveRegion } from "@/components/lesson1/a11y";
import {
  MuseumContinue,
  MuseumFrame,
  MuseumLine,
  MuseumTitle,
  Pedestal,
} from "@/components/lesson1/MuseumFrame";
import { type Bucket } from "@/lib/lesson1-data";
import { useLesson1Copy } from "@/lib/useLesson1Copy";
import { useTrackChoice } from "@/lib/analytics/useTrackChoice";
import { QStep, qid } from "@/lib/analytics/questionIds";

type Props = {
  onContinue: (placements: Record<string, Bucket>) => void;
};

const SLIDE = { type: "spring" as const, stiffness: 420, damping: 34 };
const LAYOUT = { type: "spring" as const, stiffness: 460, damping: 38 };

export function SortHook({ onContinue }: Props) {
  const { t, buckets, round1 } = useLesson1Copy();
  const trackChoice = useTrackChoice();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"ask" | "sort">("ask");
  const [active, setActive] = useState(round1[0]?.id ?? "");
  const [placements, setPlacements] = useState<Record<string, Bucket>>({});
  const [announce, setAnnounce] = useState("");
  const [flashBucket, setFlashBucket] = useState<Bucket | null>(null);
  const [revealedComplete, setRevealedComplete] = useState(false);

  const total = round1.length;
  const remaining = useMemo(
    () => round1.filter((item) => !placements[item.id]),
    [placements, round1],
  );

  const done =
    remaining.length === 0 &&
    round1.every((item) => Boolean(placements[item.id]));
  const current = remaining.find((item) => item.id === active) ?? remaining[0];
  const placedCount = total - remaining.length;
  const objectIndex = placedCount + 1;
  const firstChoice = placedCount === 0;

  useEffect(() => {
    if (!done) {
      setRevealedComplete(false);
      return;
    }
    const delay = reduceMotion ? 0 : 480;
    const timeout = window.setTimeout(() => setRevealedComplete(true), delay);
    return () => window.clearTimeout(timeout);
  }, [done, reduceMotion]);

  const progressAnnounce = done
    ? t("lesson1.hook.sort.completeTitle")
    : current
      ? t("lesson1.hook.sort.objectOf", {
          index: objectIndex,
          total,
          label: current.label,
        })
      : "";

  function place(bucket: Bucket) {
    if (!current || done) return;
    const bucketMeta = buckets.find((item) => item.id === bucket);
    setAnnounce(
      t("lesson1.hook.sort.sortedInto", {
        label: current.label,
        bucket: bucketMeta?.label ?? bucket,
      }),
    );
    const next = { ...placements, [current.id]: bucket };
    setPlacements(next);
    trackChoice({
      questionId: qid(QStep.sortR1, current.id),
      selectedOptionId: bucket,
    });
    setFlashBucket(bucket);
    window.setTimeout(() => setFlashBucket(null), 650);
    const nextItem = round1.find((item) => !next[item.id]);
    setActive(nextItem?.id ?? "");
  }

  if (phase === "ask") {
    return (
      <MuseumFrame className="justify-center">
        <MuseumTitle focusKey="ask">{t("lesson1.hook.ask.title")}</MuseumTitle>
        <MuseumLine>{t("lesson1.hook.ask.subhead")}</MuseumLine>
        <MuseumContinue
          label={t("lesson1.hook.ask.cta")}
          onClick={() => setPhase("sort")}
        />
      </MuseumFrame>
    );
  }

  return (
    <MuseumFrame>
      <LiveRegion message={announce} />
      <LiveRegion message={progressAnnounce} />

      <p className="museum-eyebrow mb-2">{t("lesson1.hook.sort.eyebrow")}</p>
      <MuseumTitle focusKey="sort">{t("lesson1.hook.sort.title")}</MuseumTitle>
      <MuseumLine>{t("lesson1.hook.sort.subhead")}</MuseumLine>

      <LayoutGroup id="sort-hook">
        <div className="mt-4 grid flex-1 gap-4 md:mt-8 md:gap-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start">
          <div className="flex flex-col gap-4 md:gap-6">
            {!done && current ? (
              <div className="museum-sort-beat">
                <div className="museum-sort-subject">
                  <p className="museum-eyebrow" aria-hidden="true">
                    {String(objectIndex).padStart(2, "0")} /{" "}
                    {String(total).padStart(2, "0")}
                  </p>
                  <div className="museum-sort-object-slot">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.p
                        key={current.id}
                        layoutId={`sort-item-${current.id}`}
                        className="museum-sort-object-label"
                        initial={reduceMotion ? false : { opacity: 0, x: -28 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, x: 20, scale: 0.96 }
                        }
                        transition={{
                          layout: LAYOUT,
                          ...SLIDE,
                        }}
                      >
                        {current.label}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="museum-sort-choose">
                  <p className="museum-sort-prompt" id="sort-hook-prompt">
                    {t("lesson1.hook.sort.prompt")}
                  </p>
                  <div
                    className="museum-sort-choices"
                    role="group"
                    aria-labelledby="sort-hook-prompt"
                  >
                    {buckets.map((bucket) => (
                      <button
                        key={bucket.id}
                        type="button"
                        onClick={() => place(bucket.id)}
                        className={`museum-sort-choice museum-sort-choice-${bucket.id}${firstChoice ? " museum-sort-choice-invite" : ""}${flashBucket === bucket.id ? " museum-sort-choice-picked" : ""}`}
                        aria-label={t("lesson1.hook.sort.sortAria", {
                          label: current.label,
                          bucket: bucket.label,
                        })}
                      >
                        <span
                          className="museum-sort-choice-icon"
                          aria-hidden="true"
                        >
                          {bucket.id === "definitely"
                            ? "✓"
                            : bucket.id === "could"
                              ? "?"
                              : "✕"}
                        </span>
                        <span className="museum-sort-choice-text">
                          {bucket.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <p className="museum-sort-hint">{t("lesson1.hook.sort.hint")}</p>
                </div>
              </div>
            ) : null}

            {done && revealedComplete ? (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <Pedestal>
                  <div className="px-6 py-8 text-center md:py-12">
                    <p className="font-[family-name:var(--font-museum)] text-3xl tracking-tight sm:text-4xl">
                      {t("lesson1.hook.sort.completeTitle")}
                    </p>
                    <p className="mt-3 text-lg text-ink-soft">
                      {t("lesson1.hook.sort.completeSub")}
                    </p>
                  </div>
                </Pedestal>
                <MuseumContinue
                  label={t("lesson1.hook.sort.cta")}
                  onClick={() => onContinue(placements)}
                />
              </motion.div>
            ) : null}
          </div>

          <aside className="museum-sort-output min-w-0">
            <p className="museum-sort-output-label">
              {t("lesson1.hook.sort.outputLabel")}
            </p>
            <p className="museum-sort-output-note">
              {t("lesson1.hook.sort.outputNote")}
            </p>
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
              {buckets.map((bucket) => {
                const items = round1.filter(
                  (item) => placements[item.id] === bucket.id,
                );
                const isFlashing = flashBucket === bucket.id;
                return (
                  <motion.section
                    key={bucket.id}
                    layout
                    aria-label={t("lesson1.hook.sort.binAria", {
                      bucket: bucket.label,
                      count: items.length,
                    })}
                    className={`museum-sort-bin${isFlashing ? " museum-sort-bin-active" : ""}`}
                    transition={{ layout: LAYOUT }}
                  >
                    <p className="museum-sort-bin-label" aria-hidden="true">
                      {bucket.label}
                      <span className="museum-sort-bin-count">
                        {items.length}
                      </span>
                    </p>
                    <ul className="mt-2 flex max-h-28 flex-wrap gap-2 overflow-y-auto lg:max-h-36">
                      <AnimatePresence initial={false} mode="popLayout">
                        {items.length === 0 ? (
                          <li key="empty" className="museum-sort-bin-empty">
                            {t("lesson1.hook.sort.waiting")}
                          </li>
                        ) : (
                          items.map((item) => (
                            <motion.li
                              key={item.id}
                              layout
                              layoutId={`sort-item-${item.id}`}
                              className="museum-chip"
                              transition={{ layout: LAYOUT }}
                            >
                              {item.label}
                            </motion.li>
                          ))
                        )}
                      </AnimatePresence>
                    </ul>
                  </motion.section>
                );
              })}
            </div>
          </aside>
        </div>
      </LayoutGroup>
    </MuseumFrame>
  );
}
