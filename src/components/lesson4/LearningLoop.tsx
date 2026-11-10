"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import {
  FacilityContinue,
  FacilityFrame,
  FacilityLine,
  FacilityTitle,
} from "@/components/lesson4/FacilityFrame";
import { useLesson4Copy } from "@/lib/useLesson4Copy";
import {
  LOOP_CARDS_SHUFFLED_IDS,
  LOOP_SPEED_COUNTS,
  loopAccuracyForCount,
} from "@/lib/lesson4-data";

type Phase = "sort" | "run";

type Props = {
  onContinue: () => void;
};

export function LearningLoop({ onContinue }: Props) {
  const { t, locale, loopCards, loopFlashes } = useLesson4Copy();
  const loopRealCards = loopCards.filter((c) => !c.decoy);
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("sort");
  const [slots, setSlots] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [holding, setHolding] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState<string | null>(null);
  const [cycles, setCycles] = useState(0);
  const [flashIndex, setFlashIndex] = useState(0);
  const [rampIndex, setRampIndex] = useState(-1);
  const holdRef = useRef<number | null>(null);
  const holdingFf = useRef(false);

  const pool = useMemo(
    () =>
      LOOP_CARDS_SHUFFLED_IDS.map(
        (id) => loopCards.find((c) => c.id === id)!,
      ).filter((c) => !slots.includes(c.id)),
    [loopCards, slots],
  );

  const orderedCorrect = slots.every((id, i) => {
    if (!id) return false;
    const card = loopCards.find((c) => c.id === id);
    return card?.order === i + 1;
  });

  const allFilled = slots.every(Boolean);
  const loopCount =
    rampIndex >= 0 ? LOOP_SPEED_COUNTS[rampIndex] : Math.max(cycles, 0);
  const accuracy = loopAccuracyForCount(Math.max(loopCount, cycles));
  const flash = loopFlashes[flashIndex % loopFlashes.length];
  const rampDone = rampIndex >= LOOP_SPEED_COUNTS.length - 1;

  const nextSlot = slots.findIndex((id) => id === null);

  function tryPlace(cardId: string, slotIndex: number) {
    const card = loopCards.find((c) => c.id === cardId);
    if (!card || slots[slotIndex]) return;

    if (card.decoy || card.order == null) {
      setRejectNote(t("lesson4.loop.rejectDecoy", { label: card.label }));
      setHolding(null);
      return;
    }
    if (card.order !== slotIndex + 1) {
      setRejectNote(
        t("lesson4.loop.rejectStep", {
          label: card.label,
          step: slotIndex + 1,
        }),
      );
      setHolding(null);
      return;
    }

    setRejectNote(null);
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = cardId;
      return next;
    });
    setHolding(null);
  }

  function placeInSlot(slotIndex: number) {
    if (!holding) return;
    tryPlace(holding, slotIndex);
  }

  function pickCard(cardId: string) {
    if (nextSlot >= 0) {
      tryPlace(cardId, nextSlot);
      return;
    }
    setRejectNote(null);
    setHolding((h) => (h === cardId ? null : cardId));
  }

  function returnCard(slotIndex: number) {
    if (!slots[slotIndex]) return;
    setRejectNote(null);
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  }

  function onDragStart(event: DragEvent, cardId: string) {
    event.dataTransfer.setData("text/plain", cardId);
    event.dataTransfer.effectAllowed = "move";
    setHolding(cardId);
    setRejectNote(null);
  }

  function onDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function onDrop(event: DragEvent, slotIndex: number) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain") || holding;
    if (!cardId) return;
    tryPlace(cardId, slotIndex);
  }

  function runOneCycle() {
    setCycles((c) => c + 1);
    setFlashIndex((i) => i + 1);
    setRampIndex(-1);
  }

  function startHold() {
    if (rampDone) return;
    holdingFf.current = true;
    if (reduceMotion) {
      setRampIndex(LOOP_SPEED_COUNTS.length - 1);
      setCycles(1_000_000);
      return;
    }
    const tick = () => {
      if (!holdingFf.current) return;
      setRampIndex((i) => {
        const next = Math.min(i + 1, LOOP_SPEED_COUNTS.length - 1);
        setCycles(LOOP_SPEED_COUNTS[next]);
        setFlashIndex((f) => f + 1);
        if (next >= LOOP_SPEED_COUNTS.length - 1) {
          holdingFf.current = false;
        }
        return next;
      });
      holdRef.current = window.setTimeout(tick, 420);
    };
    setRampIndex((i) => (i < 0 ? 0 : i));
    setCycles((c) => (c < 10 ? 10 : c));
    holdRef.current = window.setTimeout(tick, 420);
  }

  function endHold() {
    holdingFf.current = false;
    if (holdRef.current) {
      window.clearTimeout(holdRef.current);
      holdRef.current = null;
    }
  }

  useEffect(() => () => endHold(), []);

  return (
    <FacilityFrame>
      <AnimatePresence mode="wait">
        {phase === "sort" ? (
          <motion.div
            key="sort"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <FacilityTitle compact plaque={t("lesson4.loop.plaque")}>
              {t("lesson4.loop.title")}
            </FacilityTitle>
            <FacilityLine compact>{t("lesson4.loop.subhead")}</FacilityLine>

            <div className="mt-4 grid w-full gap-4 lg:grid-cols-[minmax(11rem,0.85fr)_minmax(16rem,1.25fr)] lg:items-start lg:gap-6">
              <div className="flex min-w-0 flex-col gap-2">
                <p className="facility-choice-cue">{t("lesson4.loop.pickCard")}</p>
                <p className="text-xs leading-snug text-[var(--fac-mute)]">
                  {t("lesson4.loop.pickHint")}
                </p>
                <div
                  className="flex flex-col gap-2"
                  role="listbox"
                  aria-label={t("lesson4.loop.poolAria")}
                >
                  {pool.map((card) => {
                    const selected = holding === card.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        draggable
                        onDragStart={(event) => onDragStart(event, card.id)}
                        onDragEnd={() => setHolding(null)}
                        onClick={() => pickCard(card.id)}
                        className={`facility-choice facility-choice-marked facility-choice-compact cursor-grab active:cursor-grabbing${
                          !holding ? " facility-choice-invite" : ""
                        }${selected ? " is-selected" : ""}`}
                      >
                        <span className="facility-choice-mark" aria-hidden>
                          ∷
                        </span>
                        <span>{card.label}</span>
                      </button>
                    );
                  })}
                  {pool.length === 0 ? (
                    <p className="text-sm text-[var(--fac-mute)]">
                      {t("lesson4.loop.allPlaced")}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-2">
                <p className="facility-choice-cue">{t("lesson4.loop.build")}</p>
                <p className="text-xs leading-snug text-[var(--fac-mute)]">
                  {holding
                    ? t("lesson4.loop.dropHint")
                    : nextSlot >= 0
                      ? t("lesson4.loop.nextOpen", { step: nextSlot + 1 })
                      : t("lesson4.loop.completeHint")}
                </p>
                <div className="grid gap-1.5">
                  {slots.map((id, i) => {
                    const card = id
                      ? loopCards.find((c) => c.id === id)
                      : null;
                    const isNext = !card && i === nextSlot;
                    const canDrop = !card && Boolean(holding);
                    return (
                      <div
                        key={i}
                        onDragOver={card ? undefined : onDragOver}
                        onDrop={card ? undefined : (event) => onDrop(event, i)}
                        className={`facility-slot flex items-center gap-2.5 px-2.5 py-1.5 ${
                          card
                            ? "is-filled"
                            : isNext
                              ? "is-next"
                              : canDrop
                                ? "is-droppable"
                                : ""
                        }`}
                      >
                        <span className="facility-slot-num" aria-hidden>
                          {i + 1}
                        </span>
                        {card ? (
                          <button
                            type="button"
                            onClick={() => returnCard(i)}
                            className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-[var(--fac-ink)]"
                            aria-label={t("lesson4.loop.removeAria", {
                              label: card.label,
                              step: i + 1,
                            })}
                            title={
                              card.gloss
                                ? `${card.label} – ${card.gloss}`
                                : card.label
                            }
                          >
                            {card.label}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => placeInSlot(i)}
                            disabled={!holding}
                            className="min-w-0 flex-1 text-left text-xs text-[var(--fac-mute)] disabled:cursor-default sm:text-sm"
                          >
                            {holding
                              ? t("lesson4.loop.dropOrTap")
                              : isNext
                                ? t("lesson4.loop.waiting")
                                : t("lesson4.loop.empty")}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {allFilled && orderedCorrect ? (
                  <div className="facility-sticky-cta">
                    <FacilityContinue
                      className="mt-0"
                      label={t("lesson4.loop.runLoop")}
                      onClick={() => {
                        setCycles(0);
                        setRampIndex(-1);
                        setFlashIndex(0);
                        setPhase("run");
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <AnimatePresence>
              {rejectNote ? (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="facility-reject mt-3 max-w-xl px-4 py-3"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--fac-warn)]">
                    {t("lesson4.loop.doesntBelong")}
                  </p>
                  <p className="mt-1 text-sm text-[var(--fac-ink-soft)]">
                    {rejectNote}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="run"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FacilityTitle compact plaque={t("lesson4.loop.plaque")}>
              {t("lesson4.loop.runTitle")}
            </FacilityTitle>
            <FacilityLine compact>{t("lesson4.loop.runSub")}</FacilityLine>

            <div className="mt-5 grid w-full gap-5 lg:grid-cols-[minmax(16rem,1.15fr)_minmax(14rem,0.85fr)] lg:items-start lg:gap-8">
              <div className="facility-monitor px-5 py-5 sm:px-6">
                <div className="mx-auto flex max-w-sm flex-wrap justify-center gap-2">
                  {loopRealCards.map((card, i) => (
                    <motion.span
                      key={card.id}
                      animate={
                        cycles > 0 && !reduceMotion
                          ? { opacity: [0.35, 1, 0.35] }
                          : { opacity: 0.7 }
                      }
                      transition={{
                        duration: 0.85,
                        delay: (i % 5) * 0.08,
                        repeat: cycles > 0 && !reduceMotion ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                      className="rounded-sm border border-[var(--fac-line)] px-2 py-1 text-[0.65rem] font-semibold text-[var(--fac-ink-soft)]"
                    >
                      {card.label}
                    </motion.span>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {cycles > 0 ? (
                    <motion.p
                      key={`${cycles}-${flash.prediction}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-5 text-center text-sm font-semibold"
                      aria-live="polite"
                    >
                      🐱 {flash.prediction}
                      <span className="block font-medium text-[var(--fac-ink-soft)]">
                        {flash.result}
                      </span>
                    </motion.p>
                  ) : (
                    <p className="mt-5 text-center text-sm text-[var(--fac-mute)]">
                      {t("lesson4.loop.ready")}
                    </p>
                  )}
                </AnimatePresence>

                <p className="mt-5 text-center text-4xl font-semibold tabular-nums tracking-tight text-[var(--fac-accent)] sm:text-5xl">
                  {loopCount.toLocaleString(locale)}
                </p>
                <p className="mt-1 text-center text-sm text-[var(--fac-mute)]">
                  {t("lesson4.loop.loopsAcc", { accuracy })}
                </p>
              </div>

              <div className="flex min-w-0 flex-col gap-2.5">
                {!rampDone ? (
                  <>
                    <p className="facility-choice-cue">{t("lesson4.train.drive")}</p>
                    <button
                      type="button"
                      onClick={runOneCycle}
                      className="facility-btn facility-choice-invite w-full"
                    >
                      {t("lesson4.loop.runCta")}
                    </button>
                    <button
                      type="button"
                      onPointerDown={startHold}
                      onPointerUp={endHold}
                      onPointerLeave={endHold}
                      onPointerCancel={endHold}
                      className="facility-btn-secondary w-full"
                    >
                      {t("lesson4.loop.holdAcc")}
                    </button>
                    {cycles >= 3 ? (
                      <p className="text-xs leading-snug text-[var(--fac-mute)]">
                        {t("lesson4.loop.holdHintLater")}
                      </p>
                    ) : (
                      <p className="text-xs leading-snug text-[var(--fac-mute)]">
                        {t("lesson4.loop.holdHintEarly")}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="facility-choice-cue">{t("lesson4.loop.done")}</p>
                    <p className="text-sm text-[var(--fac-ink-soft)]">
                      {t("lesson4.loop.doneBody")}
                    </p>
                    <FacilityContinue
                      className="mt-1"
                      label={t("lesson4.shared.continue")}
                      onClick={onContinue}
                    />
                  </>
                )}

                {reduceMotion && cycles >= 1 && !rampDone ? (
                  <FacilityContinue
                    className="mt-1"
                    label={t("lesson4.shared.continue")}
                    onClick={onContinue}
                  />
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </FacilityFrame>
  );
}
