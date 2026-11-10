"use client";

import { useEffect } from "react";
import {
  DepthContinue,
  DepthFrame,
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

export function CompressReveal({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson6StepCopy();
  const copy = steps.compressReveal;
  const chrome = useLesson6Chrome();
  const ui = chrome.compressReveal ?? {};
  useEffect(() => {
    onGate();
  }, [onGate]);

  const term = ui.highlightedTerm ?? "";
  const titleLead =
    term && copy.title.endsWith(term)
      ? copy.title.slice(0, -term.length).trimEnd()
      : copy.title;
  const showTerm = Boolean(term && copy.title.endsWith(term));

  return (
    <DepthFrame className="depth-reveal">
      <DepthTitle plaque={copy.plaque}>
        {showTerm ? (
          <>
            {titleLead} <span className="depth-term">{term}</span>
          </>
        ) : (
          copy.title
        )}
      </DepthTitle>

      <div className="depth-reveal-main">
        <p className="depth-reveal-def">{copy.definition}</p>
        <p className="depth-reveal-aside">{copy.analogy}</p>
      </div>

      <div className="depth-reveal-support">
        <p className="depth-reveal-support-label">{ui.whatJustHappened}</p>
        <p className="depth-reveal-support-body">{copy.recap}</p>
        <p className="depth-reveal-support-body depth-reveal-tease">
          {copy.tease}
        </p>
      </div>

      <DepthContinue
        label={copy.cta}
        onClick={onContinue}
        disabled={!gateOpen}
        className="mt-8 self-start"
      />
    </DepthFrame>
  );
}
