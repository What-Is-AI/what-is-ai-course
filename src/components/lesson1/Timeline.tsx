"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { LiveRegion } from "@/components/lesson1/a11y";
import {
  MuseumContinue,
  MuseumFrame,
  MuseumLine,
  MuseumTitle,
} from "@/components/lesson1/MuseumFrame";
import { StatusLabel } from "@/components/lesson1/StatusLabel";
import type { Locale } from "@/i18n/config";
import { formatOrdinal } from "@/i18n/ordinal";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  TIMELINE,
  type TimelineGuessMeta,
} from "@/lib/lesson1-data";
import { useLesson1Copy } from "@/lib/useLesson1Copy";

type Props = {
  onContinue: () => void;
};

function shuffledIds() {
  const ids = TIMELINE.map((item) => item.id);
  for (let i = ids.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}

function tieIdsFor(item: TimelineGuessMeta): Set<string> {
  if (!item.tieGroup) return new Set([item.id]);
  return new Set(
    TIMELINE.filter((entry) => entry.tieGroup === item.tieGroup).map(
      (entry) => entry.id,
    ),
  );
}

function tieIndicesFor(item: TimelineGuessMeta): number[] {
  if (!item.tieGroup) return [];
  return TIMELINE.map((entry, i) =>
    entry.tieGroup === item.tieGroup ? i : -1,
  ).filter((i) => i >= 0);
}

/** Slot is correct if exact match, or any order within a complete tie group. */
function isSlotCorrect(guessOrder: string[], index: number): boolean {
  const expected = TIMELINE[index];
  const guessedId = guessOrder[index];
  if (!expected || !guessedId) return false;

  if (!expected.tieGroup) return guessedId === expected.id;

  const expectedIds = tieIdsFor(expected);
  const indices = tieIndicesFor(expected);
  const placed = indices.map((i) => guessOrder[i]);
  const placedSet = new Set(placed);

  const pairComplete =
    placed.every((id) => id && expectedIds.has(id)) &&
    placedSet.size === expectedIds.size;

  return pairComplete && expectedIds.has(guessedId);
}

function placementDelta(
  itemId: string,
  placedIndex: number,
  locale: Locale,
  range: (from: string, to: string) => string,
) {
  const item = TIMELINE.find((entry) => entry.id === itemId);
  if (!item) {
    return { belongsLabel: "—", offBy: 0 };
  }

  if (item.tieGroup) {
    const indices = tieIndicesFor(item);
    const lo = Math.min(...indices);
    const hi = Math.max(...indices);
    const belongsLabel =
      lo === hi
        ? formatOrdinal(lo + 1, locale)
        : range(
            formatOrdinal(lo + 1, locale),
            formatOrdinal(hi + 1, locale),
          );
    const offBy =
      placedIndex < lo
        ? lo - placedIndex
        : placedIndex > hi
          ? placedIndex - hi
          : 0;
    return { belongsLabel, offBy };
  }

  const correctIndex = TIMELINE.findIndex((entry) => entry.id === itemId);
  return {
    belongsLabel: formatOrdinal(correctIndex + 1, locale),
    offBy: Math.abs(placedIndex - correctIndex),
  };
}

export function Timeline({ onContinue }: Props) {
  const { t, timeline, timelineSources } = useLesson1Copy();
  const { locale } = useLocale();
  const byId = (id: string) => timeline.find((item) => item.id === id);

  function range(from: string, to: string) {
    return t("lesson1.timeline.ordinalRange", { from, to });
  }

  function offByCopy(
    placedIndex: number,
    belongsLabel: string,
    offBy: number,
  ) {
    if (offBy === 0) return t("lesson1.timeline.rightPlace");
    return t("lesson1.timeline.offBy", {
      placed: formatOrdinal(placedIndex + 1, locale),
      belongs: belongsLabel,
      offBy,
    });
  }
  const [guessOrder, setGuessOrder] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [poolOrder] = useState(shuffledIds);
  const [announce, setAnnounce] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropSlot, setDropSlot] = useState<number | null>(null);
  const [dropPool, setDropPool] = useState(false);
  const suppressClickRef = useRef(false);

  const remaining = useMemo(
    () =>
      poolOrder
        .filter((id) => !guessOrder.includes(id))
        .map((id) => timeline.find((item) => item.id === id))
        .filter((item): item is (typeof timeline)[number] => Boolean(item)),
    [guessOrder, poolOrder, timeline],
  );

  function announcePlace(id: string, position: number) {
    const item = byId(id);
    if (!item) return;
    setAnnounce(
      t("lesson1.timeline.placedAnnounce", {
        label: item.label,
        position,
      }),
    );
  }

  function pick(id: string) {
    if (revealed) return;
    const position = guessOrder.length + 1;
    setGuessOrder((prev) => [...prev, id]);
    announcePlace(id, position);
  }

  function remove(id: string) {
    if (revealed) return;
    const item = byId(id);
    setGuessOrder((prev) => prev.filter((entry) => entry !== id));
    if (item) {
      setAnnounce(
        t("lesson1.timeline.returnedAnnounce", { label: item.label }),
      );
    }
  }

  /** Insert `id` at `slotIndex` (0-based), shifting others. Contiguous list. */
  function placeAt(id: string, slotIndex: number) {
    if (revealed) return;
    const without = guessOrder.filter((entry) => entry !== id);
    const clamped = Math.min(Math.max(slotIndex, 0), without.length);
    const next = [...without];
    next.splice(clamped, 0, id);
    setGuessOrder(next);
    announcePlace(id, clamped + 1);
  }

  function onDragStart(id: string, event: React.DragEvent) {
    if (revealed) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  }

  function onDragEnd() {
    setDraggingId(null);
    setDropSlot(null);
    setDropPool(false);
    suppressClickRef.current = true;
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 80);
  }

  function readDragId(event: React.DragEvent) {
    return event.dataTransfer.getData("text/plain") || draggingId;
  }

  function onSlotDragOver(index: number, event: React.DragEvent) {
    if (revealed || !draggingId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDropSlot(index);
    setDropPool(false);
  }

  function onSlotDrop(index: number, event: React.DragEvent) {
    event.preventDefault();
    const id = readDragId(event);
    setDropSlot(null);
    setDraggingId(null);
    if (!id || revealed) return;
    suppressClickRef.current = true;
    placeAt(id, index);
  }

  function onPoolDragOver(event: React.DragEvent) {
    if (revealed || !draggingId) return;
    // Only allow return-to-pool when the item is already placed
    if (!guessOrder.includes(draggingId)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDropPool(true);
    setDropSlot(null);
  }

  function onPoolDrop(event: React.DragEvent) {
    event.preventDefault();
    const id = readDragId(event);
    setDropPool(false);
    setDraggingId(null);
    if (!id || revealed || !guessOrder.includes(id)) return;
    suppressClickRef.current = true;
    remove(id);
  }

  function handlePoolClick(id: string) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    pick(id);
  }

  function handlePlacedClick(id: string) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    remove(id);
  }

  const complete = guessOrder.length === TIMELINE.length;

  const rightCount = useMemo(
    () =>
      revealed
        ? TIMELINE.filter((_, index) => isSlotCorrect(guessOrder, index)).length
        : 0,
    [guessOrder, revealed],
  );

  function checkOrder() {
    setRevealed(true);
    const lines = guessOrder.map((id, index) => {
      const item = byId(id);
      if (!item) return "";
      const delta = placementDelta(item.id, index, locale, range);
      const feedback = offByCopy(index, delta.belongsLabel, delta.offBy);
      return t("lesson1.timeline.lineAnnounce", {
        label: item.label,
        position: index + 1,
        feedback,
      });
    });
    const count = TIMELINE.filter((_, index) =>
      isSlotCorrect(guessOrder, index),
    ).length;
    setAnnounce(
      t("lesson1.timeline.scoreAnnounce", {
        count,
        total: TIMELINE.length,
        lines: lines.join(" "),
      }),
    );
  }

  return (
    <MuseumFrame>
      <LiveRegion message={announce} />
      <MuseumTitle plaque={t("lesson1.timeline.plaque")} focusKey="timeline">
        {t("lesson1.timeline.title")}
      </MuseumTitle>
      <MuseumLine>{t("lesson1.timeline.sub")}</MuseumLine>

      {revealed ? (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 max-w-2xl font-[family-name:var(--font-museum)] text-xl leading-snug tracking-tight text-ink sm:text-2xl"
        >
          {t("lesson1.timeline.score", {
            count: rightCount,
            total: TIMELINE.length,
          })}{" "}
          <span className="text-ink-soft">{t("lesson1.timeline.scoreHint")}</span>
        </motion.p>
      ) : null}

      <div className="mt-6 grid gap-6 md:mt-10 md:gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="museum-eyebrow">{t("lesson1.timeline.yourOrder")}</p>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
              <span>{t("lesson1.timeline.oldest")}</span>
              <span aria-hidden>↓</span>
              <span>{t("lesson1.timeline.newest")}</span>
            </div>
          </div>

          <ol className="relative space-y-0 pl-1">
            <motion.span
              aria-hidden
              className="absolute bottom-4 left-[1.2rem] top-4 w-px origin-top bg-ink/15"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />

            {Array.from({ length: TIMELINE.length }).map((_, index) => {
              const id = guessOrder[index];
              const item = id ? byId(id) : undefined;
              const isRight = revealed && isSlotCorrect(guessOrder, index);
              const isFirst = index === 0;
              const isLast = index === TIMELINE.length - 1;
              const delta =
                revealed && item
                  ? placementDelta(item.id, index, locale, range)
                  : null;

              return (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * index, duration: 0.4 }}
                  className="relative flex gap-4 pb-4 last:pb-0"
                >
                  <div className="relative z-10 flex w-8 shrink-0 flex-col items-center pt-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
                        revealed
                          ? isRight
                            ? "border-transparent text-white"
                            : item
                              ? "border-transparent text-white"
                              : "border-line bg-white text-ink-soft"
                          : item
                            ? "border-transparent bg-ink text-white"
                            : "border-line bg-white text-ink-soft"
                      }`}
                      style={
                        revealed
                          ? isRight
                            ? { background: "var(--museum-ok)", color: "#fff" }
                            : item
                              ? { background: "var(--museum-warn)", color: "#fff" }
                              : undefined
                          : item
                            ? { color: "#fff" }
                            : undefined
                      }
                    >
                      {index + 1}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    {isFirst ? (
                      <p
                        className="museum-eyebrow mb-1"
                        style={{ color: "var(--museum-ink)" }}
                      >
                        {t("lesson1.timeline.oldest")}
                      </p>
                    ) : null}
                    {isLast ? (
                      <p
                        className="museum-eyebrow mb-1"
                        style={{ color: "var(--museum-ink)" }}
                      >
                        {t("lesson1.timeline.newest")}
                      </p>
                    ) : null}

                    {item && !revealed ? (
                      <button
                        type="button"
                        draggable
                        onDragStart={(event) => onDragStart(item.id, event)}
                        onDragEnd={onDragEnd}
                        onDragOver={(event) => onSlotDragOver(index, event)}
                        onDrop={(event) => onSlotDrop(index, event)}
                        onClick={() => handlePlacedClick(item.id)}
                        aria-label={t("lesson1.timeline.placedAria", {
                          label: item.label,
                          position: index + 1,
                        })}
                        className={`museum-glass museum-interactive w-full cursor-grab px-4 py-3 text-left transition hover:border-ink/25 active:cursor-grabbing ${
                          draggingId === item.id ? "opacity-50" : ""
                        } ${
                          dropSlot === index
                            ? "border-ink/40 ring-2 ring-ink/15"
                            : ""
                        }`}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <p className="font-[family-name:var(--font-museum)] text-xl tracking-tight text-ink">
                              {item.label}
                            </p>
                            <p className="mt-1 text-sm text-ink-soft">
                              {item.blurb}
                            </p>
                            <p className="mt-2 text-xs font-medium text-ink-soft">
                              {t("lesson1.timeline.tapToReturn")}
                            </p>
                          </motion.div>
                        </AnimatePresence>
                      </button>
                    ) : (
                      <div
                        role="status"
                        aria-label={
                          item
                            ? revealed && delta
                              ? t("lesson1.timeline.slotAria", {
                                  label: item.label,
                                  position: index + 1,
                                  feedback: offByCopy(
                                    index,
                                    delta.belongsLabel,
                                    delta.offBy,
                                  ),
                                })
                              : t("lesson1.timeline.positionAria", {
                                  label: item.label,
                                  position: index + 1,
                                })
                            : t("lesson1.timeline.emptySlotAria", {
                                position: index + 1,
                              })
                        }
                        onDragOver={
                          revealed
                            ? undefined
                            : (event) => onSlotDragOver(index, event)
                        }
                        onDragLeave={
                          revealed
                            ? undefined
                            : () =>
                                setDropSlot((prev) =>
                                  prev === index ? null : prev,
                                )
                        }
                        onDrop={
                          revealed
                            ? undefined
                            : (event) => onSlotDrop(index, event)
                        }
                        className={`min-h-[5.5rem] rounded-[1.25rem] border px-4 py-3 ${
                          revealed
                            ? isRight
                              ? "border-[rgba(47,107,79,0.28)]"
                              : item
                                ? "border-[rgba(138,90,43,0.28)]"
                                : "border-dashed border-line"
                            : dropSlot === index
                              ? "border-ink/40 bg-white ring-2 ring-ink/15"
                              : "border-dashed border-line bg-white/50"
                        }`}
                        style={
                          revealed
                            ? {
                                background: isRight
                                  ? "var(--museum-ok-soft)"
                                  : item
                                    ? "var(--museum-warn-soft)"
                                    : undefined,
                              }
                            : undefined
                        }
                      >
                        <AnimatePresence mode="wait">
                          {item ? (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <p className="font-[family-name:var(--font-museum)] text-xl tracking-tight text-ink">
                                {item.label}
                                {revealed ? (
                                  <span className="ml-2 text-sm font-bold text-ink">
                                    · {item.year}
                                  </span>
                                ) : null}
                              </p>
                              {revealed && delta ? (
                                <p className="mt-1.5 text-sm leading-snug text-ink-soft">
                                  {delta.offBy === 0 ? (
                                    <>
                                      <StatusLabel kind="right-place" />.
                                    </>
                                  ) : (
                                    offByCopy(
                                      index,
                                      delta.belongsLabel,
                                      delta.offBy,
                                    )
                                  )}
                                </p>
                              ) : null}
                            </motion.div>
                          ) : (
                            <span className="text-ink-soft">
                              {t("lesson1.timeline.emptySlot")}
                            </span>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <div>
          <p className="museum-eyebrow mb-3">
            {revealed
              ? t("lesson1.timeline.correctOrder")
              : t("lesson1.timeline.pool")}
          </p>
          {!revealed ? (
            <div
              className={`grid gap-3 rounded-[1.25rem] p-1 transition ${
                dropPool ? "bg-ink/[0.04] ring-2 ring-ink/15" : ""
              }`}
              onDragOver={onPoolDragOver}
              onDragLeave={() => setDropPool(false)}
              onDrop={onPoolDrop}
            >
              {remaining.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  style={{ animationDelay: `${index * 0.4}s` }}
                  className={`museum-float ${draggingId === item.id ? "opacity-50" : ""}`}
                >
                  <button
                    type="button"
                    draggable
                    onDragStart={(event) => onDragStart(item.id, event)}
                    onDragEnd={onDragEnd}
                    onClick={() => handlePoolClick(item.id)}
                    aria-label={t("lesson1.timeline.placeAria", {
                      label: item.label,
                    })}
                    className="museum-glass museum-interactive w-full cursor-grab px-4 py-3 text-left transition hover:border-ink/25 active:cursor-grabbing"
                  >
                    <span className="block font-[family-name:var(--font-museum)] text-lg tracking-tight text-ink">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-ink-soft">
                      {item.blurb}
                    </span>
                  </button>
                </motion.div>
              ))}
              {remaining.length === 0 ? (
                <p className="text-sm text-ink-soft">
                  {t("lesson1.timeline.allPlaced")}
                </p>
              ) : (
                <p className="px-1 text-xs text-ink-soft">
                  {t("lesson1.timeline.clickOrDrag")}
                </p>
              )}
            </div>
          ) : (
            <motion.ol
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative space-y-0 pl-1"
            >
              <span
                aria-hidden
                className="absolute bottom-4 left-[1.2rem] top-4 w-px bg-ink/20"
              />
              {timeline.map((item, index) => {
                const prev = timeline[index - 1];
                const showTieNote =
                  item.tieGroup && prev?.tieGroup === item.tieGroup;

                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="relative flex flex-col gap-3 pb-4 last:pb-0"
                  >
                    {showTieNote ? (
                      <p className="ml-12 border-l-2 border-ink/20 pl-4 font-[family-name:var(--font-museum)] text-base italic leading-snug text-ink-soft">
                        {t("lesson1.timeline.tieNote")}
                      </p>
                    ) : null}
                    <div className="relative flex gap-4">
                      <div className="relative z-10 flex w-8 shrink-0 justify-center pt-3">
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-bold"
                          style={{ color: "#fff" }}
                        >
                          {index + 1}
                        </span>
                      </div>
                      <div className="museum-glass min-w-0 flex-1 px-4 py-3">
                        {index === 0 ? (
                          <p className="museum-eyebrow mb-1">
                            {t("lesson1.timeline.oldest")}
                          </p>
                        ) : null}
                        {index === timeline.length - 1 ? (
                          <p className="museum-eyebrow mb-1">
                            {t("lesson1.timeline.newest")}
                          </p>
                        ) : null}
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="text-sm font-bold text-ink">
                            {item.year}
                          </span>
                          <span className="font-[family-name:var(--font-museum)] text-lg tracking-tight text-ink">
                            {item.label}
                          </span>
                          {item.tieGroup ? (
                            <span className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-ink-soft">
                              {t("lesson1.timeline.eitherOrder")}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-ink-soft">{item.blurb}</p>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ol>
          )}
        </div>
      </div>

      {!revealed ? (
        <MuseumContinue
          label={t("lesson1.timeline.check")}
          disabled={!complete}
          onClick={checkOrder}
        />
      ) : (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 max-w-2xl font-[family-name:var(--font-museum)] text-xl italic leading-snug text-ink-soft sm:text-2xl"
          >
            {t("lesson1.timeline.punchline")}
          </motion.p>

          <motion.details
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="museum-glass mt-6 max-w-2xl px-5 py-4"
          >
            <summary className="cursor-pointer list-none font-[family-name:var(--font-museum)] text-lg tracking-tight text-ink [&::-webkit-details-marker]:hidden">
              <span className="museum-eyebrow mb-1 block">
                {t("lesson1.timeline.sourcesEyebrow")}
              </span>
              {t("lesson1.timeline.sourcesTitle")}
            </summary>
            <ul className="mt-4 space-y-3 border-t border-[rgba(20,20,20,0.08)] pt-4">
              {timelineSources.map((source) => (
                <li key={source.id} className="text-sm leading-relaxed text-ink-soft">
                  {source.href ? (
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-ink underline decoration-ink/25 underline-offset-2 transition hover:decoration-ink/60"
                    >
                      {source.cite}
                    </a>
                  ) : (
                    <span className="font-medium text-ink">{source.cite}</span>
                  )}
                  {source.note ? (
                    <span className="text-ink-soft"> – {source.note}</span>
                  ) : null}
                  {source.flag ? (
                    <span className="mt-1 block text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
                      {source.flag}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </motion.details>

          <MuseumContinue onClick={onContinue} />
        </>
      )}
    </MuseumFrame>
  );
}
