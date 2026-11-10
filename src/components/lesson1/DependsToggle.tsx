"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { LiveRegion } from "@/components/lesson1/a11y";
import {
  MuseumContinue,
  MuseumFrame,
  MuseumLine,
  MuseumTitle,
  Pedestal,
} from "@/components/lesson1/MuseumFrame";
import { RichText } from "@/i18n/RichText";
import { useLesson1Copy } from "@/lib/useLesson1Copy";
import { useTrackChoice } from "@/lib/analytics/useTrackChoice";
import { QStep, qid } from "@/lib/analytics/questionIds";

type Props = {
  onContinue: () => void;
};

type Phase = "intro" | "toggle" | "point";
type Era = "then" | "now";

export function DependsToggle({ onContinue }: Props) {
  const { t, depends, domainLabel, originLabel } = useLesson1Copy();
  const trackChoice = useTrackChoice();
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [era, setEra] = useState<Era>("then");
  const [announce, setAnnounce] = useState("");
  const [thumbProgress, setThumbProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const current = depends[index];
  const isLast = index >= depends.length - 1;
  const activeEra = era === "then" ? current?.eraThen : current?.eraNow;

  function setEraValue(next: Era, options?: { snapThumb?: boolean }) {
    if (!current) return;
    if (options?.snapThumb !== false) {
      setThumbProgress(next === "then" ? 0 : 1);
    }
    setEra((prev) => {
      if (prev === next) return prev;
      const eraData = next === "then" ? current.eraThen : current.eraNow;
      setAnnounce(
        t("lesson1.depends.toggle.announceChange", {
          domain: domainLabel(current.domain),
          origin: originLabel(eraData.origin),
        }),
      );
      return next;
    });
  }

  function progressFromClientX(clientX: number) {
    const track = trackRef.current;
    if (!track) return thumbProgress;
    const { left, width } = track.getBoundingClientRect();
    const thumb = 36;
    const pad = 6;
    const travel = Math.max(width - thumb - pad * 2, 1);
    return Math.min(1, Math.max(0, (clientX - left - pad - thumb / 2) / travel));
  }

  function onTrackPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    const progress = progressFromClientX(event.clientX);
    setThumbProgress(progress);
    setEraValue(progress < 0.5 ? "then" : "now", { snapThumb: false });
  }

  function onTrackPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    const progress = progressFromClientX(event.clientX);
    setThumbProgress(progress);
    setEraValue(progress < 0.5 ? "then" : "now", { snapThumb: false });
  }

  function onTrackPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    const progress = progressFromClientX(event.clientX);
    setEraValue(progress < 0.5 ? "then" : "now");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function nextObject() {
    if (current) {
      trackChoice({ questionId: qid(QStep.era, current.id), selectedOptionId: era });
    }
    if (isLast) {
      setPhase("point");
      setAnnounce("");
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setEra("then");
    setThumbProgress(0);
    const nextItem = depends[nextIndex];
    if (nextItem) {
      setAnnounce(
        t("lesson1.depends.toggle.announceObject", {
          index: nextIndex + 1,
          total: depends.length,
          label: nextItem.label,
          domain: domainLabel(nextItem.domain),
          origin: originLabel(nextItem.eraThen.origin),
        }),
      );
    }
  }

  if (phase === "intro") {
    return (
      <MuseumFrame>
        <MuseumTitle plaque={t("lesson1.depends.plaque")} focusKey="intro">
          {t("lesson1.depends.intro.title")}
        </MuseumTitle>
        <MuseumLine>{t("lesson1.depends.intro.body")}</MuseumLine>
        <MuseumContinue
          label={t("lesson1.depends.intro.cta")}
          onClick={() => {
            setPhase("toggle");
            const first = depends[0];
            if (first) {
              setAnnounce(
                t("lesson1.depends.toggle.announceObject", {
                  index: 1,
                  total: depends.length,
                  label: first.label,
                  domain: domainLabel(first.domain),
                  origin: originLabel(first.eraThen.origin),
                }),
              );
            }
          }}
        />
      </MuseumFrame>
    );
  }

  if (phase === "point") {
    return (
      <MuseumFrame>
        <MuseumTitle plaque={t("lesson1.depends.plaque")} focusKey="point">
          {t("lesson1.depends.point.title")}
        </MuseumTitle>
        <div className="museum-line -mt-4 max-w-2xl space-y-3">
          <RichText as="p" text={t("lesson1.depends.point.p1")} />
          <RichText as="p" text={t("lesson1.depends.point.p2")} />
          <RichText as="p" text={t("lesson1.depends.point.p3")} />
        </div>
        <MuseumContinue
          label={t("lesson1.depends.point.cta")}
          onClick={onContinue}
        />
      </MuseumFrame>
    );
  }

  if (!current || !activeEra) return null;

  const domainText = domainLabel(current.domain);
  const originText = originLabel(activeEra.origin);

  return (
    <MuseumFrame>
      <LiveRegion message={announce} />
      <p className="museum-eyebrow mb-2" aria-hidden="true">
        {t("lesson1.depends.toggle.objectOf", {
          index: index + 1,
          total: depends.length,
        })}
      </p>
      <MuseumTitle plaque={t("lesson1.depends.plaque")}>
        {current.label}
      </MuseumTitle>
      <MuseumLine>{t("lesson1.depends.toggle.sub")}</MuseumLine>

      <div className="mt-8">
        <Pedestal float>
          <div className="px-6 py-8 sm:px-10">
            <div className="museum-depends-badges">
              <span className="museum-badge museum-depends-domain">
                <span>
                  {t("lesson1.depends.toggle.domainBadge", {
                    domain: domainText,
                  })}
                </span>
                <span className="museum-depends-tag">
                  {t("lesson1.depends.toggle.stays")}
                </span>
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${current.id}-${era}-origin`}
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className={`museum-badge museum-depends-origin is-${activeEra.origin}`}
                >
                  <span>
                    {t("lesson1.depends.toggle.originBadge", {
                      origin: originText,
                    })}
                  </span>
                  <span className="museum-depends-tag">
                    {t("lesson1.depends.toggle.flips")}
                  </span>
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
                <button
                  type="button"
                  onClick={() => setEraValue("then")}
                  className={`museum-interactive rounded px-1 py-0.5 ${
                    era === "then" ? "text-ink" : "hover:text-ink"
                  }`}
                  aria-pressed={era === "then"}
                >
                  {t("lesson1.depends.toggle.then")}
                </button>
                <span aria-hidden>⟷</span>
                <button
                  type="button"
                  onClick={() => setEraValue("now")}
                  className={`museum-interactive rounded px-1 py-0.5 ${
                    era === "now" ? "text-ink" : "hover:text-ink"
                  }`}
                  aria-pressed={era === "now"}
                >
                  {t("lesson1.depends.toggle.now")}
                </button>
              </div>

              <div
                ref={trackRef}
                role="slider"
                tabIndex={0}
                aria-label={t("lesson1.depends.toggle.sliderAria")}
                aria-valuemin={0}
                aria-valuemax={1}
                aria-valuenow={era === "then" ? 0 : 1}
                aria-valuetext={
                  era === "then"
                    ? t("lesson1.depends.toggle.then")
                    : t("lesson1.depends.toggle.now")
                }
                onPointerDown={onTrackPointerDown}
                onPointerMove={onTrackPointerMove}
                onPointerUp={onTrackPointerUp}
                onPointerCancel={onTrackPointerUp}
                onKeyDown={(event) => {
                  if (
                    event.key === "ArrowLeft" ||
                    event.key === "Home" ||
                    event.key === "ArrowDown"
                  ) {
                    event.preventDefault();
                    setEraValue("then");
                  } else if (
                    event.key === "ArrowRight" ||
                    event.key === "End" ||
                    event.key === "ArrowUp"
                  ) {
                    event.preventDefault();
                    setEraValue("now");
                  } else if (event.key === " " || event.key === "Enter") {
                    event.preventDefault();
                    setEraValue(era === "then" ? "now" : "then");
                  }
                }}
                className="museum-interactive relative h-12 cursor-pointer touch-none select-none rounded-full border border-[rgba(20,20,20,0.12)] bg-[rgba(20,20,20,0.04)] px-1.5"
              >
                <motion.div
                  aria-hidden
                  className="absolute top-1.5 h-9 w-9 rounded-full bg-ink shadow-[0_6px_16px_rgba(20,20,20,0.18)]"
                  animate={{
                    left: `calc(0.375rem + (100% - 3rem) * ${thumbProgress})`,
                  }}
                  transition={
                    dragging
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 32 }
                  }
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 flex items-center justify-between px-5 text-[0.65rem] font-bold uppercase tracking-[0.16em]"
                >
                  <span
                    className={
                      thumbProgress < 0.5
                        ? "text-transparent"
                        : "text-ink-soft/70"
                    }
                  >
                    {t("lesson1.depends.toggle.then")}
                  </span>
                  <span
                    className={
                      thumbProgress >= 0.5
                        ? "text-transparent"
                        : "text-ink-soft/70"
                    }
                  >
                    {t("lesson1.depends.toggle.now")}
                  </span>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${current.id}-${era}-era`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`museum-depends-era is-${activeEra.origin}`}
              >
                <p className="museum-depends-era-kicker">
                  {t("lesson1.depends.toggle.eraKicker", {
                    era:
                      era === "then"
                        ? t("lesson1.depends.toggle.then")
                        : t("lesson1.depends.toggle.now"),
                    origin: originText,
                  })}
                </p>
                <p className="museum-depends-era-body">{activeEra.label}</p>
              </motion.div>
            </AnimatePresence>

            <p className="museum-depends-note">{current.note}</p>
          </div>
        </Pedestal>
      </div>

      <MuseumContinue
        label={
          isLast
            ? t("lesson1.depends.toggle.seePoint")
            : t("lesson1.depends.toggle.next")
        }
        onClick={nextObject}
      />
    </MuseumFrame>
  );
}
