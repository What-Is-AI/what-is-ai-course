"use client";

import { useEffect } from "react";
import {
  ListeningRoomContinue,
  ListeningRoomFrame,
  ListeningRoomLine,
  ListeningRoomTitle,
} from "@/components/lesson7/ListeningRoomFrame";
import { useLesson7Session } from "@/components/lesson7/useLesson7Session";
import { FEATURE_OPTIONS, type FeatureOptionId } from "@/lib/lesson7-data";
import { useLesson7Chrome, useLesson7StepCopy } from "@/lib/useLesson7Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
};

/** Step 2b – name the features behind the playlist picks. */
export function PredictName({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson7StepCopy();
  const chrome = useLesson7Chrome();
  const copy = steps.predictName;
  const legend = chrome.predictName?.featuresYouWereGoingOn as string | undefined;
  const { features, toggleFeature } = useLesson7Session();

  useEffect(() => {
    if (features.length >= 1) onGate();
  }, [features, onGate]);

  return (
    <ListeningRoomFrame>
      <ListeningRoomTitle>{copy.title}</ListeningRoomTitle>
      <ListeningRoomLine>{copy.subhead}</ListeningRoomLine>

      <fieldset className="lr-feature-set">
        <legend className="sr-only">{legend}</legend>
        <div className="lr-feature-grid">
          {FEATURE_OPTIONS.map((id) => {
            const checked = features.includes(id);
            const label = copy.options[id as FeatureOptionId];
            return (
              <label key={id} className={`lr-feature-option${checked ? " is-on" : ""}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleFeature(id)}
                />
                <span>{label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {features.length > 0 ? (
        <ListeningRoomLine compact>{copy.hold}</ListeningRoomLine>
      ) : null}

      <ListeningRoomContinue
        label={copy.cta}
        onClick={onContinue}
        disabled={!gateOpen}
      />
    </ListeningRoomFrame>
  );
}
