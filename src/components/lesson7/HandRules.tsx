"use client";

import { useEffect } from "react";
import {
  ListeningRoomContinue,
  ListeningRoomFrame,
  ListeningRoomLine,
  ListeningRoomTitle,
} from "@/components/lesson7/ListeningRoomFrame";
import { useLesson7Session } from "@/components/lesson7/useLesson7Session";
import type { SliderFeatureId } from "@/lib/lesson7-data";
import {
  useLesson7Chrome,
  useLesson7DataCopy,
  useLesson7StepCopy,
} from "@/lib/useLesson7Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
};

function formatPct(v: number): string {
  return `${Math.round(v * 100)}`;
}

/** Step 3a – set threshold sliders from named features. */
export function HandRules({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson7StepCopy();
  const copy = steps.handRules;
  const chrome = useLesson7Chrome();
  const ui = chrome.handRules ?? {};
  const dataCopy = useLesson7DataCopy();
  const sliderLabels = dataCopy.sliderLabels as Record<SliderFeatureId, string>;
  const {
    features,
    activeSliderIds,
    thresholds,
    setThreshold,
    ensureThresholds,
  } = useLesson7Session();

  useEffect(() => {
    ensureThresholds();
    onGate();
  }, [ensureThresholds, onGate]);

  const onlyUnnamed =
    features.length > 0 && features.every((f) => f === "unnamed");

  return (
    <ListeningRoomFrame>
      <ListeningRoomTitle plaque={copy.plaque}>{copy.title}</ListeningRoomTitle>
      <ListeningRoomLine>{copy.body}</ListeningRoomLine>
      {onlyUnnamed ? <p className="lr-helper">{ui.unnamedHelper}</p> : null}

      <div
        className="lr-slider-panel"
        role="group"
        aria-label={ui.detectorThresholds}
      >
        {activeSliderIds.map((id) => {
          const value = thresholds[id] ?? 0.5;
          return (
            <label key={id} className="lr-slider-row">
              <span className="lr-slider-label">
                {sliderLabels[id as SliderFeatureId]}
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={value}
                onChange={(e) =>
                  setThreshold(id, Number.parseFloat(e.target.value))
                }
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(value * 100)}
                aria-valuetext={`${sliderLabels[id as SliderFeatureId]} ${formatPct(value)}`}
              />
              <span className="lr-slider-value lr-mono" aria-hidden>
                {formatPct(value)}
              </span>
            </label>
          );
        })}
      </div>

      <p className="lr-helper lr-mono" aria-live="polite">
        {ui.rule}
      </p>

      <ListeningRoomContinue
        label={copy.cta}
        onClick={onContinue}
        disabled={!gateOpen}
      />
    </ListeningRoomFrame>
  );
}
