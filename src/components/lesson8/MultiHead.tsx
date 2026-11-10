"use client";

import { useEffect, useState } from "react";
import { ChooseHelper } from "@/components/lesson8/ChooseHelper";
import { GoDeeperStrip } from "@/components/lesson8/GoDeeperStrip";
import { HonestyChip } from "@/components/lesson8/HonestyChip";
import { LivingSentence } from "@/components/lesson8/LivingSentence";
import { PaperPage } from "@/components/lesson8/PaperPage";
import {
  ReadingRoomFrame,
  ReadingRoomLine,
} from "@/components/lesson8/ReadingRoomFrame";
import {
  useLesson8Chrome,
  useLesson8LocaleData,
  useLesson8StepCopy,
} from "@/lib/useLesson8Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion: boolean;
};

/** S9 – Optional multi-head strip (skip by default). */
export function MultiHead({
  onContinue,
  gateOpen,
  onGate,
  reducedMotion,
}: Props) {
  const steps = useLesson8StepCopy();
  const chrome = useLesson8Chrome();
  const copy = steps.multiHead;
  const ui = chrome.multiHead ?? {};
  const localeData = useLesson8LocaleData();
  const [activeHead, setActiveHead] = useState<"a" | "b">("a");

  useEffect(() => {
    if (!gateOpen) onGate();
  }, [gateOpen, onGate]);

  const links = activeHead === "a" ? localeData.headALinks : localeData.headBLinks;

  return (
    <ReadingRoomFrame>
      <GoDeeperStrip
        plaque={copy.plaque}
        title={copy.title}
        teaser={copy.teaser}
        deeperLabel={copy.deeperCta}
        skipLabel={copy.skipCta}
        onContinue={onContinue}
        gateOpen={gateOpen}
      >
        <div className="rr-stage rr-stage-deeper">
          <div className="rr-stage-copy">
            <ReadingRoomLine compact>{copy.deeperBody}</ReadingRoomLine>
            <ReadingRoomLine compact>{copy.notAssigned}</ReadingRoomLine>
            <p className="rr-pivot">{copy.loadBearing}</p>
          </div>

          <div className="rr-stage-action">
            <ChooseHelper>{ui.tapAHead}</ChooseHelper>
            <div
              className="rr-choose-row"
              role="group"
              aria-label={ui.attentionHead}
            >
              <button
                type="button"
                className={`rr-choose${activeHead === "a" ? " is-selected" : ""}`}
                aria-pressed={activeHead === "a"}
                onClick={() => setActiveHead("a")}
              >
                {ui.headA}
              </button>
              <button
                type="button"
                className={`rr-choose${activeHead === "b" ? " is-selected" : ""}`}
                aria-pressed={activeHead === "b"}
                onClick={() => setActiveHead("b")}
              >
                {ui.headB}
              </button>
            </div>

            <PaperPage
              mark={
                activeHead === "a" ? ui.headAPattern : ui.headBPattern
              }
            >
              <LivingSentence
                words={localeData.canonicalWords}
                mode="exhibit"
                focusWordId={localeData.canonicalItId}
                links={links}
                reducedMotion={reducedMotion}
              />
              <HonestyChip />
              <ReadingRoomLine compact>
                {activeHead === "a" ? copy.headA : copy.headB}
              </ReadingRoomLine>
            </PaperPage>
          </div>
        </div>
      </GoDeeperStrip>
    </ReadingRoomFrame>
  );
}
