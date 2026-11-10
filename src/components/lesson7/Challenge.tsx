"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipPlayer } from "@/components/lesson7/ClipPlayer";
import { ListeningDesk } from "@/components/lesson7/ListeningDesk";
import {
  ListeningRoomContinue,
  ListeningRoomFrame,
  ListeningRoomLine,
  ListeningRoomTitle,
} from "@/components/lesson7/ListeningRoomFrame";
import { useLesson7Audio } from "@/components/lesson7/useLesson7Audio";
import {
  useLesson7Chrome,
  useLesson7StepCopy,
} from "@/lib/useLesson7Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion: boolean;
};

/** Step 9 – try to write the rule; failure to pin it all is the point. */
export function Challenge({
  onContinue,
  gateOpen,
  onGate,
  reducedMotion,
}: Props) {
  const steps = useLesson7StepCopy();
  const copy = steps.challenge;
  const chrome = useLesson7Chrome();
  const ui = chrome.challenge ?? {};
  const clipOf =
    (chrome.clipPlayer as { clipOf?: string } | undefined)?.clipOf ??
    "Clip {n} of {total}";
  const { bundle, playingId, setPlayingId } = useLesson7Audio();
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const examples = useMemo(() => {
    if (!bundle) return [];
    const withLabels = bundle.clips.filter(
      (c) => c.workoutBelongs === true || c.workoutBelongs === false,
    );
    const challenge = withLabels.filter((c) => c.roles.includes("challenge"));
    const pool = challenge.length >= 4 ? challenge : withLabels;
    const yes = pool.filter((c) => c.workoutBelongs).slice(0, 2);
    const no = pool.filter((c) => !c.workoutBelongs).slice(0, 3);
    return [...yes, ...no].slice(0, 5);
  }, [bundle]);

  useEffect(() => {
    if (submitted) onGate();
  }, [submitted, onGate]);

  const submit = () => setSubmitted(true);
  const cantPin = () => {
    setText("");
    setSubmitted(true);
  };

  return (
    <ListeningRoomFrame>
      <div className="lr-step-grid">
        <div>
          <ListeningRoomTitle plaque={copy.plaque}>
            {copy.prompt}
          </ListeningRoomTitle>
          <ListeningRoomLine>{ui.intro}</ListeningRoomLine>

          {!submitted ? (
            <>
              <label className="lr-field-label" htmlFor="lr-challenge-text">
                {ui.yourRule}
              </label>
              <textarea
                id="lr-challenge-text"
                className="lr-textarea"
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={ui.placeholder}
              />
              <div className="lr-hand-actions">
                <button
                  type="button"
                  className="lr-btn"
                  onClick={submit}
                  disabled={text.trim().length < 3}
                >
                  {ui.submit}
                </button>
                <button type="button" className="lr-btn-secondary" onClick={cantPin}>
                  {copy.cantPin}
                </button>
              </div>
            </>
          ) : (
            <>
              <ListeningRoomLine>{copy.after}</ListeningRoomLine>
              <ListeningRoomLine compact>{copy.land}</ListeningRoomLine>
              <ListeningRoomContinue
                label={copy.cta}
                onClick={onContinue}
                disabled={!gateOpen}
              />
            </>
          )}
        </div>

        <ListeningDesk plaque={ui.examples}>
          <div className="lr-clip-stack">
            {examples.map((clip, i) => {
              const marked =
                clip.workoutBelongs === true
                  ? "belongs"
                  : clip.workoutBelongs === false
                    ? "doesnt"
                    : null;
              return (
                <div key={clip.id} className="lr-hand-card">
                  <ClipPlayer
                    clip={clip}
                    playingId={playingId}
                    onPlayingChange={setPlayingId}
                    indexLabel={clipOf
                      .replace("{n}", String(i + 1))
                      .replace("{total}", String(examples.length))}
                    reducedMotion={reducedMotion}
                    compact
                  />
                  {marked ? (
                    <p className="lr-hand-feedback lr-mono">
                      {marked === "belongs" ? ui.belongsMark : ui.doesntMark}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </ListeningDesk>
      </div>
    </ListeningRoomFrame>
  );
}
