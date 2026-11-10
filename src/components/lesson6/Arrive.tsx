"use client";

import { useEffect, useState } from "react";
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
import { PIXEL_SEVEN } from "@/lib/lesson6-data";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion: boolean;
};

export function Arrive({ onContinue, gateOpen, onGate, reducedMotion }: Props) {
  const steps = useLesson6StepCopy();
  const copy = steps.arrive;
  const chrome = useLesson6Chrome();
  const ui = chrome.arrive ?? {};
  const [stage, setStage] = useState(reducedMotion ? 2 : 0);

  useEffect(() => {
    if (gateOpen) return;
    if (reducedMotion) {
      onGate();
      return;
    }
    const t1 = window.setTimeout(() => setStage(1), 700);
    const t2 = window.setTimeout(() => {
      setStage(2);
      onGate();
    }, 1600);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reducedMotion, onGate, gateOpen]);

  const cells: { key: string; on: boolean }[] = [];
  for (let y = 0; y < 14; y++) {
    for (let x = 0; x < 14; x++) {
      const key = `${y},${x}`;
      cells.push({ key, on: PIXEL_SEVEN.has(key) });
    }
  }

  return (
    <DepthFrame>
      <div className="depth-layout">
        <div>
          <DepthTitle plaque={copy.plaque}>{copy.title}</DepthTitle>
          <DepthLine>{copy.body1}</DepthLine>
          <DepthLine compact>{copy.body2}</DepthLine>
          <DepthContinue
            label={copy.cta}
            onClick={onContinue}
            disabled={!gateOpen}
          />
        </div>
        <aside className="flex flex-col items-center gap-3">
          <div className="depth-pixel-grid" aria-hidden>
            {cells.map((c) => (
              <span key={c.key} className={c.on ? "is-on" : undefined} />
            ))}
          </div>
          <div className="flex w-full max-w-xs flex-col gap-2">
            <div className={`depth-pane ${stage >= 0 ? "opacity-100" : "opacity-40"}`}>
              {ui.pixels}
            </div>
            <div className={`depth-pane ${stage >= 1 ? "opacity-100" : "opacity-30"}`}>
              {ui.earlyTransform}
            </div>
            <div className={`depth-pane ${stage >= 2 ? "opacity-100" : "opacity-20"}`}>
              {ui.deeperRepresentation}
            </div>
          </div>
          <p className="depth-mono text-center">
            {gateOpen ? ui.descentComplete : ui.watchingStages}
          </p>
        </aside>
      </div>
    </DepthFrame>
  );
}
