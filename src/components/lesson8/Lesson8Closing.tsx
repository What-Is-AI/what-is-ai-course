"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChooseHelper } from "@/components/lesson8/ChooseHelper";
import {
  ReadingRoomFrame,
  ReadingRoomLine,
  ReadingRoomTitle,
} from "@/components/lesson8/ReadingRoomFrame";
import {
  useLesson8Chrome,
  useLesson8StepCopy,
} from "@/lib/useLesson8Copy";

type Props = {
  onGate: () => void;
  reducedMotion: boolean;
};

type Phase = "reveal" | "bridge";

/** S14 – Final reveal + Lesson 9 bridge. */
export function Lesson8Closing({ onGate, reducedMotion }: Props) {
  const steps = useLesson8StepCopy();
  const copy = steps.closing;
  const chrome = useLesson8Chrome();
  const ui: Record<string, string> = chrome.closing ?? {};
  const [phase, setPhase] = useState<Phase>("reveal");

  useEffect(() => {
    onGate();
  }, [onGate]);

  const showBridge = phase === "bridge" || reducedMotion;

  return (
    <ReadingRoomFrame className="rr-closing">
      <div className="rr-stage">
        <div className="rr-stage-copy">
          <ReadingRoomTitle plaque={copy.plaque} compact>
            {copy.headline}
          </ReadingRoomTitle>
          <ReadingRoomLine compact>{copy.body}</ReadingRoomLine>
          <ReadingRoomLine compact>{copy.under}</ReadingRoomLine>
          {phase === "reveal" && !reducedMotion ? (
            <div className="rr-action-bar">
              <ChooseHelper>{ui.pressToContinue}</ChooseHelper>
              <button
                type="button"
                className="rr-btn rr-btn-operate"
                onClick={() => setPhase("bridge")}
              >
                {ui.oneMoreThing}
              </button>
            </div>
          ) : null}
        </div>

        {showBridge ? (
          <div className="rr-stage-action rr-closing-block">
            <p className="rr-pivot">{copy.but}</p>
            <ReadingRoomLine compact>{copy.bridge}</ReadingRoomLine>
            <p className="rr-surprise">{copy.nextLesson}</p>
            <div className="rr-closing-cta">
              <button
                type="button"
                className="rr-btn rr-btn-soon"
                disabled
                aria-label={`${copy.nextLabel} (${ui.comingSoon})`}
              >
                <span>{copy.nextLabel}</span>
                <span className="rr-soon">{ui.comingSoon}</span>
              </button>
              <Link href="/" className="rr-btn-secondary inline-flex">
                {copy.home}
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </ReadingRoomFrame>
  );
}
