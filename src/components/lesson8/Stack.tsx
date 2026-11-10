"use client";

import { useEffect } from "react";
import { PaperPage } from "@/components/lesson8/PaperPage";
import {
  ReadingRoomContinue,
  ReadingRoomFrame,
  ReadingRoomLine,
  ReadingRoomTitle,
} from "@/components/lesson8/ReadingRoomFrame";
import {
  useLesson8Chrome,
  useLesson8StepCopy,
} from "@/lib/useLesson8Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion?: boolean;
};

const LAYER_KEYS = ["layer1", "layer2", "layer3"] as const;

/** S7 – Stack the layers (read). Attention is central, not the whole architecture. */
export function Stack({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson8StepCopy();
  const copy = steps.stack;
  const chrome = useLesson8Chrome();
  const ui: Record<string, string> = chrome.stack ?? {};

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
          <ReadingRoomLine compact>{copy.repeatedly}</ReadingRoomLine>
          <ReadingRoomLine compact>{copy.eachLayer}</ReadingRoomLine>
          <ReadingRoomLine compact>{copy.deepLearning}</ReadingRoomLine>
          <p className="rr-pivot">{copy.notOnlyAttention}</p>
          <ReadingRoomContinue
            label={copy.cta}
            onClick={onContinue}
            disabled={!gateOpen}
          />
        </div>

        <div className="rr-stage-action">
          <PaperPage mark={ui.stackedMark}>
            <ol className="rr-stack-layers">
              {LAYER_KEYS.map((key) => (
                <li key={key}>{ui[key]}</li>
              ))}
            </ol>
          </PaperPage>
        </div>
      </div>
    </ReadingRoomFrame>
  );
}
