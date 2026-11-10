"use client";

import { useEffect } from "react";
import {
  ListeningRoomContinue,
  ListeningRoomFrame,
  ListeningRoomLine,
  ListeningRoomTitle,
} from "@/components/lesson7/ListeningRoomFrame";
import { useLesson7Chrome, useLesson7StepCopy } from "@/lib/useLesson7Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
};

/** Step 8 – guardrail: people still made every big call. */
export function WhoDecides({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson7StepCopy();
  const chrome = useLesson7Chrome();
  const copy = steps.whoDecides;
  const cardsAria =
    chrome.whoDecides?.humanChoices ?? "Human choices around the model";

  useEffect(() => {
    onGate();
  }, [onGate]);

  return (
    <ListeningRoomFrame>
      <ListeningRoomTitle plaque={copy.plaque}>{copy.title}</ListeningRoomTitle>
      <ListeningRoomLine>{copy.body}</ListeningRoomLine>
      <ul className="lr-wall-cards" aria-label={cardsAria}>
        {copy.cards.map((card) => (
          <li key={card} className="lr-wall-card" tabIndex={0}>
            {card}
          </li>
        ))}
      </ul>
      <p className="lr-term">{copy.keyLine}</p>
      <ListeningRoomContinue
        label={copy.cta}
        onClick={onContinue}
        disabled={!gateOpen}
      />
    </ListeningRoomFrame>
  );
}
