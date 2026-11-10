"use client";

import { useState } from "react";
import {
  DepthContinue,
  DepthFrame,
  DepthLine,
  DepthTitle,
} from "@/components/lesson6/DepthFrame";
import { useLesson6StepCopy } from "@/lib/useLesson6Copy";
import { saveLocal } from "@/lib/storage";

type Props = {
  onContinue: () => void;
  onGate: () => void;
};

export function Reflection({ onContinue, onGate }: Props) {
  const steps = useLesson6StepCopy();
  const copy = steps.reflection;
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const ready = before.trim().length > 0 && after.trim().length > 0;

  function save() {
    if (!ready) return;
    saveLocal("lesson6-reflection", {
      before: before.trim(),
      after: after.trim(),
      savedAt: new Date().toISOString(),
    });
    onGate();
    onContinue();
  }

  return (
    <DepthFrame>
      <DepthTitle plaque={copy.plaque}>{copy.title}</DepthTitle>
      <DepthLine>{copy.sub}</DepthLine>

      <div className="depth-reflection mt-8">
        <label className="depth-reflection-field">
          <span className="depth-eyebrow mb-3 block">{copy.beforeLabel}</span>
          <textarea
            value={before}
            onChange={(e) => setBefore(e.target.value)}
            rows={3}
            className="depth-input min-h-[5rem] w-full"
            placeholder={copy.beforePlaceholder}
          />
        </label>

        <label className="depth-reflection-field">
          <span className="depth-eyebrow mb-3 block">{copy.afterLabel}</span>
          <textarea
            value={after}
            onChange={(e) => setAfter(e.target.value)}
            rows={3}
            className="depth-input min-h-[5rem] w-full"
            placeholder={copy.afterPlaceholder}
          />
        </label>
      </div>

      <DepthContinue label={copy.cta} onClick={save} disabled={!ready} />
    </DepthFrame>
  );
}
