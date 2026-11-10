"use client";

import { useEffect } from "react";
import {
  ReadingRoomContinue,
  ReadingRoomFrame,
  ReadingRoomLine,
  ReadingRoomTitle,
} from "@/components/lesson8/ReadingRoomFrame";
import { useLesson8Chrome, useLesson8StepCopy } from "@/lib/useLesson8Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion?: boolean;
};

/** S10 – Why this mattered: parallel exchange → BERT / decoder-only / scale. */
export function WhyMattered({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson8StepCopy();
  const chrome = useLesson8Chrome();
  const copy = steps.whyMattered;
  const ui = chrome.whyMattered ?? {};

  useEffect(() => {
    if (!gateOpen) onGate();
  }, [gateOpen, onGate]);

  return (
    <ReadingRoomFrame>
      <div className="rr-stage">
        <div className="rr-stage-copy">
          <ReadingRoomTitle plaque={copy.plaque} compact>
            {copy.title}
          </ReadingRoomTitle>
          <ReadingRoomLine compact>{copy.body}</ReadingRoomLine>
          <ReadingRoomLine compact>{copy.benefits}</ReadingRoomLine>
          <ReadingRoomLine compact>{copy.later}</ReadingRoomLine>
          <ReadingRoomContinue
            label={copy.cta}
            onClick={onContinue}
            disabled={!gateOpen}
          />
        </div>

        <div className="rr-stage-action">
          <ul className="rr-lineage" aria-label={ui.laterLines}>
            <li>
              <span className="rr-eyebrow">{ui.encoderStyle}</span>
              <p>{copy.bert}</p>
            </li>
            <li>
              <span className="rr-eyebrow">{ui.decoderOnly}</span>
              <p>{copy.decoder}</p>
            </li>
            <li>
              <span className="rr-eyebrow">{ui.scale}</span>
              <p>{copy.scale}</p>
            </li>
          </ul>
        </div>
      </div>
    </ReadingRoomFrame>
  );
}
