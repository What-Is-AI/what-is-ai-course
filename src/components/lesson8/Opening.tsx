"use client";

import { useEffect, useState } from "react";
import { LivingSentence } from "@/components/lesson8/LivingSentence";
import {
  ReadingRoomContinue,
  ReadingRoomFrame,
  ReadingRoomLine,
  ReadingRoomTitle,
} from "@/components/lesson8/ReadingRoomFrame";
import { useLesson8LocaleData, useLesson8StepCopy } from "@/lib/useLesson8Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion: boolean;
};

type Referent = "animal" | "road" | "unsure";

/**
 * S1 – Opening.
 * Roles: Exhibit (sentence) · Choose (options) · Advance (after pick).
 * Inline helper sits on the Choose set (interaction-contract §8 / §15).
 */
export function Opening({
  onContinue,
  gateOpen,
  onGate,
  reducedMotion,
}: Props) {
  const steps = useLesson8StepCopy();
  const copy = steps.opening;
  const localeData = useLesson8LocaleData();
  const [choice, setChoice] = useState<Referent | null>(null);

  useEffect(() => {
    if (choice && !gateOpen) onGate();
  }, [choice, gateOpen, onGate]);

  return (
    <ReadingRoomFrame>
      <div className="rr-arrive">
        <ReadingRoomTitle plaque={copy.plaque}>
          {copy.title}
        </ReadingRoomTitle>
        <ReadingRoomLine>{copy.body2}</ReadingRoomLine>
        <ReadingRoomLine compact>{copy.leadIn}</ReadingRoomLine>

        <div className="rr-ask-row">
          <p className="rr-ask-label" id="rr-opening-ask">
            {copy.ask}
          </p>

          <div className="rr-ask-sentence" aria-hidden={false}>
            <LivingSentence
              words={localeData.canonicalWords}
              mode="exhibit"
              focusWordId={localeData.canonicalItId}
              reducedMotion={reducedMotion}
            />
          </div>

          <div className="rr-ask-choices">
            <p className="rr-choose-helper" id="rr-opening-choose-help">
              {copy.chooseHelper}
            </p>
            <div
              className="rr-choose-stack"
              role="group"
              aria-labelledby="rr-opening-ask"
              aria-describedby="rr-opening-choose-help"
            >
              {(
                [
                  ["animal", copy.options.animal],
                  ["road", copy.options.road],
                  ["unsure", copy.options.unsure],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`rr-choose rr-choose-block${
                    choice === id ? " is-selected" : ""
                  }`}
                  aria-pressed={choice === id}
                  onClick={() => setChoice(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {choice ? (
          <div className="rr-arrive-after">
            <ReadingRoomLine>{copy.body3}</ReadingRoomLine>
            <p className="rr-pivot">{copy.pivot}</p>
            <ReadingRoomContinue
              label={copy.cta}
              onClick={onContinue}
              disabled={!gateOpen}
            />
          </div>
        ) : null}
      </div>
    </ReadingRoomFrame>
  );
}
