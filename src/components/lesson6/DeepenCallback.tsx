"use client";

import { useEffect } from "react";
import {
  DepthContinue,
  DepthFrame,
  DepthLine,
  DepthTitle,
} from "@/components/lesson6/DepthFrame";
import { LayerStackMotion } from "@/components/lesson6/LayerStackMotion";
import { useLesson6StepCopy } from "@/lib/useLesson6Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
};

export function DeepenCallback({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson6StepCopy();
  const copy = steps.deepenCallback;
  useEffect(() => {
    onGate();
  }, [onGate]);

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
        <aside>
          <LayerStackMotion />
        </aside>
      </div>
    </DepthFrame>
  );
}
