"use client";

import { useEffect, useState } from "react";
import {
  ReadingRoomContinue,
  ReadingRoomFrame,
  ReadingRoomTitle,
} from "@/components/lesson8/ReadingRoomFrame";
import { useLesson8StepCopy } from "@/lib/useLesson8Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion?: boolean;
};

/** S13 – Reflection prompts (ungated). */
export function Reflection({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson8StepCopy();
  const copy = steps.reflection;
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const [want, setWant] = useState("");

  useEffect(() => {
    onGate();
  }, [onGate]);

  return (
    <ReadingRoomFrame>
      <div className="rr-stage">
        <div className="rr-stage-copy">
          <ReadingRoomTitle plaque={copy.plaque} compact>
            {copy.title}
          </ReadingRoomTitle>
          <ReadingRoomContinue
            label={copy.cta}
            onClick={onContinue}
            disabled={!gateOpen}
          />
        </div>

        <div className="rr-stage-action">
          <label className="rr-field-label" htmlFor="rr-reflect-before">
            {copy.beforeLabel}
          </label>
          <textarea
            id="rr-reflect-before"
            className="rr-textarea"
            rows={3}
            value={before}
            onChange={(e) => setBefore(e.target.value)}
          />

          <label className="rr-field-label" htmlFor="rr-reflect-after">
            {copy.afterLabel}
          </label>
          <textarea
            id="rr-reflect-after"
            className="rr-textarea"
            rows={3}
            value={after}
            onChange={(e) => setAfter(e.target.value)}
          />

          <label className="rr-field-label" htmlFor="rr-reflect-want">
            {copy.wantLabel}
          </label>
          <textarea
            id="rr-reflect-want"
            className="rr-textarea"
            rows={3}
            value={want}
            onChange={(e) => setWant(e.target.value)}
          />
        </div>
      </div>
    </ReadingRoomFrame>
  );
}
