"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ListeningRoomFrame,
  ListeningRoomLine,
  ListeningRoomTitle,
} from "@/components/lesson7/ListeningRoomFrame";
import { MusicCredits } from "@/components/lesson7/MusicCredits";
import {
  useLesson7Chrome,
  useLesson7StepCopy,
} from "@/lib/useLesson7Copy";

type Props = {
  onGate: () => void;
  reducedMotion: boolean;
};

type Phase = "changed" | "bank" | "handoff";

/** Step 11 – closing + bank bridge to Lesson 8 (question form, unresolved). */
export function Lesson7Closing({ onGate, reducedMotion }: Props) {
  const steps = useLesson7StepCopy();
  const copy = steps.closing;
  const chrome = useLesson7Chrome();
  const ui = chrome.closing ?? {};
  const music = chrome.musicCredits ?? {};
  const [phase, setPhase] = useState<Phase>("changed");

  useEffect(() => {
    onGate();
  }, [onGate]);

  const showBank = phase === "bank" || phase === "handoff" || reducedMotion;
  const showHandoff = phase === "handoff" || reducedMotion;

  return (
    <ListeningRoomFrame className="lr-closing-frame">
      <div className="lr-closing-block">
        <ListeningRoomTitle plaque={copy.plaque}>
          {ui.whatChangedTitle}
        </ListeningRoomTitle>
        <div className="lr-before-after">
          <p>
            <span className="lr-ba-label">{ui.before}</span>
            {copy.before}
          </p>
          <p>
            <span className="lr-ba-label">{ui.after}</span>
            {copy.after}
          </p>
        </div>
        <ListeningRoomLine>{copy.body}</ListeningRoomLine>
        {phase === "changed" && !reducedMotion ? (
          <button
            type="button"
            className="lr-btn"
            onClick={() => setPhase("bank")}
          >
            {ui.oneMoreThing}
          </button>
        ) : null}
      </div>

      {showBank ? (
        <div className="lr-closing-block lr-bank-block">
          <p className="lr-bank-line">{copy.bankLine}</p>
          <p className="lr-bank-ask">{copy.bankAsk}</p>
          <ul className="lr-bank-meanings">
            <li>{copy.bankRiver}</li>
            <li>{copy.bankFinance}</li>
          </ul>
          <p className="lr-bank-then">{copy.bankThen}</p>
          <ListeningRoomLine compact>{copy.connective}</ListeningRoomLine>
          {phase === "bank" && !reducedMotion ? (
            <button
              type="button"
              className="lr-btn"
              onClick={() => setPhase("handoff")}
            >
              {ui.continue}
            </button>
          ) : null}
        </div>
      ) : null}

      {showHandoff ? (
        <div className="lr-closing-handoff">
          <h2 className="lr-title">{copy.headline}</h2>
          <div className="lr-closing-cta">
            <Link href="/lessons/8" className="lr-btn inline-flex">
              {copy.nextLabel}
            </Link>
            <Link href="/" className="lr-btn-secondary inline-flex">
              {copy.home}
            </Link>
          </div>
          <MusicCredits
            className="mt-10"
            variant="compact"
            copy={{
              title: music.title ?? "Music credits",
              body:
                music.body ??
                "These short clips are by Kevin MacLeod (incompetech.com), licensed under CC BY 3.0.",
              artistLine:
                music.artistLine ??
                "Music by Kevin MacLeod (incompetech.com).",
              licenseLabel: music.licenseLabel ?? "License:",
            }}
          />
        </div>
      ) : null}
    </ListeningRoomFrame>
  );
}
