"use client";

import { useEffect } from "react";
import { ListeningDesk } from "@/components/lesson7/ListeningDesk";
import {
  ListeningRoomContinue,
  ListeningRoomFrame,
  ListeningRoomTitle,
} from "@/components/lesson7/ListeningRoomFrame";
import { useLesson7Chrome, useLesson7StepCopy } from "@/lib/useLesson7Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
};

/**
 * Step 3c – Neutral read beat.
 * Roles: Exhibit (listening notes on the desk) + Advance.
 */
export function HandWall({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson7StepCopy();
  const chrome = useLesson7Chrome();
  const copy = steps.handWall;
  const deskPlaque = chrome.handWall?.sessionNotes as string | undefined;

  useEffect(() => {
    onGate();
  }, [onGate]);

  return (
    <ListeningRoomFrame className="lr-wall-frame">
      <ListeningRoomTitle plaque={copy.plaque} compact>
        {copy.title}
      </ListeningRoomTitle>

      <div className="lr-wall-grid">
        <ListeningDesk plaque={deskPlaque}>
          <ol className="lr-wall-notes">
            <li className="lr-wall-note">
              <span className="lr-wall-note-mark lr-mono" aria-hidden>
                A
              </span>
              <p className="lr-wall-note-body">{copy.contrastA}</p>
            </li>
            <li className="lr-wall-note">
              <span className="lr-wall-note-mark lr-mono" aria-hidden>
                B
              </span>
              <p className="lr-wall-note-body">{copy.contrastB}</p>
            </li>
          </ol>
          <p className="lr-wall-finding">
            <span className="lr-wall-finding-label lr-mono">Finding</span>
            {copy.body2}
          </p>
        </ListeningDesk>

        <aside className="lr-wall-advance-col">
          <p className="lr-wall-history">{copy.body3}</p>
          <div className="lr-wall-pivot-block">
            <p className="lr-wall-pivot">{copy.pivot}</p>
            <ListeningRoomContinue
              label={copy.cta}
              onClick={onContinue}
              disabled={!gateOpen}
              className="mt-5"
            />
          </div>
        </aside>
      </div>
    </ListeningRoomFrame>
  );
}
