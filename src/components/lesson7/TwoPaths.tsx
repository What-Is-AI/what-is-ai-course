"use client";

import { useEffect } from "react";
import {
  ListeningRoomContinue,
  ListeningRoomFrame,
  ListeningRoomLine,
  ListeningRoomTitle,
} from "@/components/lesson7/ListeningRoomFrame";
import {
  useLesson7Chrome,
  useLesson7StepCopy,
} from "@/lib/useLesson7Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
};

/** Drop leading "Label: " — the path title is shown separately. */
function pathBody(text: string): string {
  return text.replace(/^[^:]+:\s*/, "");
}

/** Step 4a – hand-designed vs learned paths. */
export function TwoPaths({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson7StepCopy();
  const copy = steps.twoPaths;
  const chrome = useLesson7Chrome();
  const ui = chrome.twoPaths ?? {};

  useEffect(() => {
    onGate();
  }, [onGate]);

  return (
    <ListeningRoomFrame>
      <ListeningRoomTitle plaque={copy.plaque}>{copy.title}</ListeningRoomTitle>
      <ul className="lr-path-list">
        <li>
          <span className="lr-path-label">{ui.path1}</span>
          <span className="lr-path-body">{pathBody(copy.path1)}</span>
        </li>
        <li>
          <span className="lr-path-label">{ui.path2}</span>
          <span className="lr-path-body">{pathBody(copy.path2)}</span>
        </li>
      </ul>
      <ListeningRoomLine>{copy.body}</ListeningRoomLine>
      <ListeningRoomContinue
        label={copy.cta}
        onClick={onContinue}
        disabled={!gateOpen}
      />
    </ListeningRoomFrame>
  );
}
