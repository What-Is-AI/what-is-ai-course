"use client";

import { useEffect } from "react";
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

/** Step 1 – Arrive. Opens the Listening Room and the L6 question thread. */
export function Arrive({ onContinue, gateOpen, onGate, reducedMotion }: Props) {
  const steps = useLesson7StepCopy();
  const copy = steps.arrive;
  const chrome = useLesson7Chrome();
  const ui = chrome.arrive ?? {};
  const clipOf =
    (chrome.clipPlayer as { clipOf?: string } | undefined)?.clipOf ??
    "Clip {n} of {total}";
  const { clipsFor, playingId, setPlayingId, loading, error } =
    useLesson7Audio();

  useEffect(() => {
    if (gateOpen) return;
    if (reducedMotion) {
      onGate();
      return;
    }
    const t = window.setTimeout(() => onGate(), 600);
    return () => window.clearTimeout(t);
  }, [gateOpen, onGate, reducedMotion]);

  const preview = clipsFor("predict").slice(0, 2);

  return (
    <ListeningRoomFrame>
      <div className="lr-arrive">
        <div className="lr-arrive-copy">
          <ListeningRoomTitle plaque={copy.plaque}>
            {copy.title}
          </ListeningRoomTitle>
          <ListeningRoomLine>{copy.body1}</ListeningRoomLine>
          <ListeningRoomLine compact>{copy.body2}</ListeningRoomLine>
          <ListeningRoomContinue
            label={copy.cta}
            onClick={onContinue}
            disabled={!gateOpen}
          />
        </div>

        <ListeningDesk plaque={ui.listeningDesk} className="lr-arrive-desk">
          {loading ? (
            <p className="lr-desk-status">{ui.warmingUp}</p>
          ) : error ? (
            <p className="lr-desk-status lr-desk-status-error">{error}</p>
          ) : (
            <div className="lr-clip-stack">
              {preview.map((clip, i) => (
                <ClipPlayer
                  key={clip.id}
                  clip={clip}
                  playingId={playingId}
                  onPlayingChange={setPlayingId}
                  indexLabel={clipOf
                    .replace("{n}", String(i + 1))
                    .replace("{total}", String(preview.length))}
                  reducedMotion={reducedMotion}
                  compact
                />
              ))}
              <p className="lr-desk-hint lr-mono">{ui.playHint}</p>
            </div>
          )}
        </ListeningDesk>
      </div>
    </ListeningRoomFrame>
  );
}
