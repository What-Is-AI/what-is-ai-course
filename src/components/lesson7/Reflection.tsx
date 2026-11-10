"use client";

import { useEffect, useState } from "react";
import {
  ListeningRoomContinue,
  ListeningRoomFrame,
  ListeningRoomTitle,
} from "@/components/lesson7/ListeningRoomFrame";
import { useLesson7StepCopy } from "@/lib/useLesson7Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
};

/** Step 10 – reflection: before / after against the title question. */
export function Reflection({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson7StepCopy();
  const copy = steps.reflection;
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");

  useEffect(() => {
    // Ungated – open immediately; CTA always available
    onGate();
  }, [onGate]);

  return (
    <ListeningRoomFrame>
      <ListeningRoomTitle plaque={copy.plaque}>{copy.title}</ListeningRoomTitle>

      <label className="lr-field-label" htmlFor="lr-reflect-before">
        {copy.beforeLabel}
      </label>
      <textarea
        id="lr-reflect-before"
        className="lr-textarea"
        rows={3}
        value={before}
        onChange={(e) => setBefore(e.target.value)}
        placeholder={copy.beforePlaceholder}
      />

      <label className="lr-field-label" htmlFor="lr-reflect-after">
        {copy.afterLabel}
      </label>
      <textarea
        id="lr-reflect-after"
        className="lr-textarea"
        rows={3}
        value={after}
        onChange={(e) => setAfter(e.target.value)}
        placeholder={copy.afterPlaceholder}
      />

      <ListeningRoomContinue
        label={copy.cta}
        onClick={onContinue}
        disabled={!gateOpen}
      />
    </ListeningRoomFrame>
  );
}
