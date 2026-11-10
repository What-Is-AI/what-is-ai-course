"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDelegateRealWorkCopy } from "@/lib/useDelegateRealWorkCopy";

type Props = {
  onComplete: () => void;
  className?: string;
};

export function PlaybackPlayer({ onComplete, className = "" }: Props) {
  const { t, watchFrames } = useDelegateRealWorkCopy();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const completedRef = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const visible = watchFrames.slice(0, index + 1);
  const atEnd = index >= watchFrames.length - 1;
  const latest = watchFrames[index];

  useEffect(() => {
    if (atEnd && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [atEnd, onComplete]);

  useEffect(() => {
    if (!playing || atEnd || reduceMotion) return;
    const id = window.setTimeout(() => {
      setIndex((i) => Math.min(i + 1, watchFrames.length - 1));
    }, 1600);
    return () => window.clearTimeout(id);
  }, [playing, index, atEnd, reduceMotion, watchFrames.length]);

  useEffect(() => {
    if (atEnd) setPlaying(false);
  }, [atEnd]);

  useEffect(() => {
    if (reduceMotion || index === 0) return;
    listRef.current?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [index, reduceMotion]);

  function replay() {
    completedRef.current = false;
    setIndex(0);
    setPlaying(false);
  }

  function step() {
    setPlaying(false);
    setIndex((i) => Math.min(i + 1, watchFrames.length - 1));
  }

  function play() {
    if (atEnd) return;
    if (reduceMotion) {
      step();
      return;
    }
    setPlaying(true);
  }

  return (
    <div className={`coworker-panel overflow-hidden ${className}`}>
      <div
        className="flex flex-wrap items-center gap-2 border-b border-[color:var(--cw-line)] px-4 py-3"
        role="group"
        aria-label={t("delegateRealWork.watch.playbackAria")}
      >
        <button
          type="button"
          className="coworker-btn-secondary !px-3 !py-2 text-sm"
          onClick={play}
          disabled={atEnd}
          aria-label={t("delegateRealWork.watch.controls.play")}
        >
          {t("delegateRealWork.watch.controls.play")}
        </button>
        <button
          type="button"
          className="coworker-btn-secondary !px-3 !py-2 text-sm"
          onClick={step}
          disabled={atEnd}
          aria-label={t("delegateRealWork.watch.controls.step")}
        >
          {t("delegateRealWork.watch.controls.step")}
        </button>
        <button
          type="button"
          className="coworker-btn-secondary !px-3 !py-2 text-sm"
          onClick={replay}
          aria-label={t("delegateRealWork.watch.controls.replay")}
        >
          {t("delegateRealWork.watch.controls.replay")}
        </button>
        <span className="coworker-mono ml-auto" aria-live="polite">
          {t("delegateRealWork.watch.progress", {
            current: index + 1,
            total: watchFrames.length,
          })}
        </span>
      </div>

      <div
        ref={listRef}
        className="px-5 py-5 sm:px-6"
        role="list"
        aria-label={t("delegateRealWork.watch.runStepsAria")}
      >
        <AnimatePresence initial={false}>
          {visible.map((frame, i) => {
            const isLatest = i === index;
            const isLast = i === visible.length - 1;
            return (
              <motion.div
                key={frame.id}
                role="listitem"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.35 }}
                className="relative flex gap-4"
              >
                <div
                  className="relative flex w-4 shrink-0 flex-col items-center"
                  aria-hidden
                >
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      isLatest
                        ? "bg-[color:var(--cw-accent)] shadow-[0_0_10px_var(--cw-accent-glow)]"
                        : "bg-[color:var(--cw-cool)]"
                    }`}
                  />
                  {!isLast ? (
                    <span className="mt-1 w-px flex-1 min-h-[1.75rem] bg-[color:var(--cw-line)]" />
                  ) : null}
                </div>

                <div
                  className={`min-w-0 flex-1 pb-5 ${
                    isLatest && !reduceMotion ? "coworker-frame-glow rounded" : ""
                  } ${isLast ? "pb-1" : ""}`}
                >
                  <p className="coworker-eyebrow">{frame.frame}</p>
                  <p className="coworker-mono mt-2 text-sm leading-relaxed text-[color:var(--cw-ink)] sm:text-base">
                    {frame.detail}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {latest.frame}. {latest.detail}
        </span>
      </div>
    </div>
  );
}
