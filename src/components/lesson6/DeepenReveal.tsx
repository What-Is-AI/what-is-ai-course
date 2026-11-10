"use client";

import { useEffect } from "react";
import {
  DepthContinue,
  DepthFrame,
  DepthLine,
  DepthTitle,
} from "@/components/lesson6/DepthFrame";
import { DepthOpportunityViz } from "@/components/lesson6/DepthOpportunityViz";
import { useLesson6StepCopy } from "@/lib/useLesson6Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
};

export function DeepenReveal({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson6StepCopy();
  const copy = steps.deepenReveal;
  useEffect(() => {
    onGate();
  }, [onGate]);

  return (
    <DepthFrame>
      <div className="depth-layout">
        <div>
          <DepthTitle plaque={copy.plaque}>{copy.title}</DepthTitle>
          <DepthLine>{copy.body1}</DepthLine>
          <DepthLine compact>{copy.historyCallback}</DepthLine>
          <DepthLine compact>{copy.historyNew}</DepthLine>
          <aside className="depth-why mt-6">
            <p className="depth-eyebrow mb-2">{copy.whyLabel}</p>
            <p className="depth-line depth-line-compact">{copy.whyBody}</p>
          </aside>
          <DepthContinue
            label={copy.cta}
            onClick={onContinue}
            disabled={!gateOpen}
          />
        </div>
        <aside>
          <DepthOpportunityViz />
        </aside>
      </div>
    </DepthFrame>
  );
}
