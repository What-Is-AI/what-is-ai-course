"use client";

import { useEffect, useState } from "react";
import { ChooseHelper } from "@/components/lesson8/ChooseHelper";
import { LivingSentence } from "@/components/lesson8/LivingSentence";
import { PaperPage } from "@/components/lesson8/PaperPage";
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
import { tokenizePassage } from "@/lib/lesson8-data";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion: boolean;
};

/** S6 – Physical reorder, then positional information. */
export function Order({
  onContinue,
  gateOpen,
  onGate,
  reducedMotion,
}: Props) {
  const steps = useLesson8StepCopy();
  const copy = steps.order;
  const chrome = useLesson8Chrome();
  const ui: Record<string, string> = chrome.order ?? {};
  const localeData = useLesson8LocaleData();
  const [shuffled, setShuffled] = useState(false);
  const [seenBoth, setSeenBoth] = useState(false);

  useEffect(() => {
    if (seenBoth && !gateOpen) onGate();
  }, [seenBoth, gateOpen, onGate]);

  const words = shuffled ? tokenizePassage(localeData.orderShuffled) : tokenizePassage(localeData.orderOriginal);
  const orderText = words.map((w) => w.text).join(" ");

  function toggle() {
    setShuffled((prev) => {
      const next = !prev;
      if (next) setSeenBoth(true);
      return next;
    });
  }

  return (
    <ReadingRoomFrame>
      <div className="rr-stage">
        <div className="rr-stage-copy">
          <ReadingRoomTitle plaque={copy.plaque} compact>
            {copy.title}
          </ReadingRoomTitle>
          <ReadingRoomLine compact>{copy.body}</ReadingRoomLine>
          <ReadingRoomLine compact>{copy.sameWords}</ReadingRoomLine>

          {shuffled ? (
            <p className="rr-surprise">{copy.afterShuffle}</p>
          ) : null}

          {seenBoth ? (
            <>
              <ReadingRoomLine compact>{copy.needPositional}</ReadingRoomLine>
              <ReadingRoomLine compact>{copy.encodings}</ReadingRoomLine>
              <p className="rr-pivot">{copy.twoPieces}</p>
              <ReadingRoomContinue
                label={copy.cta}
                onClick={onContinue}
                disabled={!gateOpen}
              />
            </>
          ) : (
            <p className="rr-gate-hint" role="status">
              {ui.shuffleOnce}
            </p>
          )}
        </div>

        <div className="rr-stage-action">
          <div className="rr-action-bar">
            <ChooseHelper>{ui.pressToReorder}</ChooseHelper>
            <button
              type="button"
              className="rr-btn rr-btn-operate"
              onClick={toggle}
            >
              {shuffled ? copy.restoreCta : copy.shuffleCta}
            </button>
          </div>

          <PaperPage mark={shuffled ? ui.shuffledOrder : ui.originalOrder}>
            <LivingSentence
              words={words}
              mode="exhibit"
              reducedMotion={reducedMotion}
            />
            <p className="rr-order-linear" aria-live="polite">
              {(ui.linearOrder ?? "Linear order: {orderText}").replace(
                "{orderText}",
                orderText,
              )}
            </p>
            <ol className="rr-order-positions" aria-label={ui.positions}>
              {words.map((w, i) => (
                <li key={`${w.id}-${shuffled ? "s" : "o"}`}>
                  <span className="rr-order-idx">
                    {(ui.posN ?? "pos {n}").replace("{n}", String(i + 1))}
                  </span>{" "}
                  {w.text}
                </li>
              ))}
            </ol>
          </PaperPage>
        </div>
      </div>
    </ReadingRoomFrame>
  );
}
