"use client";

import { useState } from "react";
import {
  ReadingRoomContinue,
  ReadingRoomLine,
} from "@/components/lesson8/ReadingRoomFrame";

type Props = {
  /** Short label for the strip (e.g. “Go deeper”). */
  plaque?: string;
  title: string;
  teaser: string;
  deeperLabel?: string;
  skipLabel?: string;
  continueLabel?: string;
  /** Called when learner Advances (skip or after exploring). */
  onContinue: () => void;
  gateOpen?: boolean;
  onOpened?: () => void;
  children: React.ReactNode;
};

/**
 * Optional “Go deeper” strip — skip by default on the main thread.
 * Primary Advance is Continue; Go deeper is Operate (expand in place).
 */
export function GoDeeperStrip({
  plaque = "",
  title,
  teaser,
  deeperLabel = "",
  skipLabel = "",
  continueLabel = "",
  onContinue,
  gateOpen = true,
  onOpened,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rr-deeper ${open ? "is-open" : ""}`}>
      <p className="rr-eyebrow">{plaque}</p>
      <h3 className="rr-deeper-title">{title}</h3>
      <ReadingRoomLine compact>{teaser}</ReadingRoomLine>

      {!open ? (
        <div className="rr-deeper-actions">
          <ReadingRoomContinue
            label={skipLabel}
            onClick={onContinue}
            disabled={!gateOpen}
            className="mt-0"
          />
          <button
            type="button"
            className="rr-deeper-open"
            onClick={() => {
              setOpen(true);
              onOpened?.();
            }}
          >
            {deeperLabel}
          </button>
        </div>
      ) : (
        <div className="rr-deeper-body">
          {children}
          <ReadingRoomContinue
            label={continueLabel}
            onClick={onContinue}
            disabled={!gateOpen}
          />
        </div>
      )}
    </div>
  );
}
