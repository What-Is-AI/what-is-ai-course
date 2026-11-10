"use client";

import { useState } from "react";
import {
  DepthContinue,
  DepthFrame,
  DepthLine,
  DepthTitle,
} from "@/components/lesson6/DepthFrame";
import {
  useLesson6Chrome,
  useLesson6DataCopy,
  useLesson6StepCopy,
} from "@/lib/useLesson6Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
};

type FinalChallenge = {
  prompt: string;
  options: Array<{ id: string; label: string }>;
  correctId: string;
};

export function Challenge({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson6StepCopy();
  const copy = steps.challenge;
  const chrome = useLesson6Chrome();
  const data = useLesson6DataCopy();
  const finalChallenge = data.finalChallenge as FinalChallenge;
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  function pick(id: string) {
    setSelected(id);
    if (id === finalChallenge.correctId) {
      setFeedback(chrome.challenge?.correct ?? "");
      onGate();
    } else {
      setFeedback(chrome.challenge?.wrong ?? "");
    }
  }

  return (
    <DepthFrame>
      <DepthTitle plaque={copy.plaque}>{finalChallenge.prompt}</DepthTitle>
      <DepthLine>{copy.title}</DepthLine>
      <div className="mt-4 flex max-w-2xl flex-col gap-2">
        {finalChallenge.options.map((opt) => {
          let cls = "depth-choice";
          if (selected === opt.id && opt.id === finalChallenge.correctId) {
            cls += " is-correct";
          } else if (selected === opt.id) {
            cls += " is-wrong";
          }
          return (
            <button
              key={opt.id}
              type="button"
              className={cls}
              onClick={() => pick(opt.id)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {feedback ? <DepthLine compact>{feedback}</DepthLine> : null}
      <DepthContinue
        label={copy.cta}
        onClick={onContinue}
        disabled={!gateOpen}
      />
    </DepthFrame>
  );
}
