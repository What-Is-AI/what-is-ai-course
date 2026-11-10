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
import { useLesson7Session } from "@/components/lesson7/useLesson7Session";
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

/** Step 2a – pick workout playlist clips. */
export function PredictPick({
  onContinue,
  gateOpen,
  onGate,
  reducedMotion,
}: Props) {
  const steps = useLesson7StepCopy();
  const copy = steps.predictPick;
  const chrome = useLesson7Chrome();
  const ui = chrome.predictPick ?? {};
  const clipOf =
    (chrome.clipPlayer as { clipOf?: string } | undefined)?.clipOf ??
    "Clip {n} of {total}";
  const { clipsFor, playingId, setPlayingId, loading } = useLesson7Audio();
  const { playlistIds, togglePlaylist } = useLesson7Session();
  const clips = clipsFor("predict").slice(0, 6);

  useEffect(() => {
    if (playlistIds.length >= 1) onGate();
  }, [playlistIds, onGate]);

  return (
    <ListeningRoomFrame>
      <div className="lr-step-grid">
        <div>
          <ListeningRoomTitle>{copy.title}</ListeningRoomTitle>
          <ListeningRoomLine>{copy.subhead}</ListeningRoomLine>
          <ListeningRoomContinue
            label={copy.cta}
            onClick={onContinue}
            disabled={!gateOpen}
          />
        </div>

        <ListeningDesk plaque={ui.playlistAudition}>
          <p className="lr-desk-hint">{ui.tapToAdd}</p>
          {loading ? (
            <p className="lr-desk-status">{ui.loadingClips}</p>
          ) : (
            <div className="lr-clip-stack">
              {clips.map((clip, i) => (
                <ClipPlayer
                  key={clip.id}
                  clip={clip}
                  playingId={playingId}
                  onPlayingChange={setPlayingId}
                  selectable
                  selected={playlistIds.includes(clip.id)}
                  onSelect={togglePlaylist}
                  indexLabel={clipOf
                    .replace("{n}", String(i + 1))
                    .replace("{total}", String(clips.length))}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          )}
        </ListeningDesk>
      </div>
    </ListeningRoomFrame>
  );
}
