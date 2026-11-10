"use client";

import { useEffect } from "react";
import {
  DepthContinue,
  DepthFrame,
  DepthLine,
  DepthTitle,
} from "@/components/lesson6/DepthFrame";
import {
  useLesson6Chrome,
  useLesson6StepCopy,
} from "@/lib/useLesson6Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
};

export function Tracker({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson6StepCopy();
  const copy = steps.tracker;
  const chrome = useLesson6Chrome();
  const ui = chrome.tracker ?? {};
  useEffect(() => {
    onGate();
  }, [onGate]);

  return (
    <DepthFrame>
      <DepthTitle plaque={copy.plaque}>{copy.title}</DepthTitle>
      <div className="depth-tracker mt-2">
        <div className="depth-panel depth-tracker-panel">
          <p className="depth-eyebrow mb-2">{ui.before}</p>
          <DepthLine compact>{copy.before}</DepthLine>
        </div>
        <div className="depth-panel depth-tracker-panel">
          <p className="depth-eyebrow mb-2">{ui.after}</p>
          <DepthLine compact>{copy.after}</DepthLine>
        </div>
      </div>
      <DepthContinue label={copy.cta} onClick={onContinue} disabled={!gateOpen} />
    </DepthFrame>
  );
}
