"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipPlayer } from "@/components/lesson7/ClipPlayer";
import { SongBoard } from "@/components/lesson7/SongBoard";
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

type Answer = "similar" | "not";

/** Step 6 – two quick rounds: non-obvious relationships in the representation. */
export function Hidden({
  onContinue,
  gateOpen,
  onGate,
  reducedMotion,
}: Props) {
  const steps = useLesson7StepCopy();
  const copy = steps.hidden;
  const chrome = useLesson7Chrome();
  const ui = chrome.hidden ?? {};
  const clipOf =
    (chrome.clipPlayer as { clipOf?: string } | undefined)?.clipOf ??
    "Clip {n} of {total}";
  const { bundle, playingId, setPlayingId } = useLesson7Audio();
  const [round, setRound] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [round1Done, setRound1Done] = useState(false);
  const [round2Done, setRound2Done] = useState(false);

  const pairs = bundle?.hiddenPairs ?? [];
  const pair = pairs[round];

  const clips = useMemo(() => {
    if (!bundle || !pair) return [];
    return bundle.clips.filter(
      (c) => c.id === pair.clipA || c.id === pair.clipB,
    );
  }, [bundle, pair]);

  const boardPoints = useMemo(() => {
    if (!bundle || !pair) return [];
    const idSet = new Set([pair.clipA, pair.clipB]);
    // Always use the embedding drawing (layoutDefault) – not the workout
    // logistic head. Step 6 is about similarity in the representation.
    const raw = bundle.layoutDefault.filter((p) => idSet.has(p.id));
    if (raw.length !== 2) return raw;

    const [a, b] = raw;
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    const d = Math.hypot(dx, dy) || 1e-6;
    // Rescale so "far" / "close" is unmistakable on our drawing, while keeping
    // the PCA direction. Relative claim is already gated by embedDistance.
    const target = pair.expected === "close" ? 0.14 : 0.72;
    const scale = target / d;
    const clamp = (v: number) => Math.min(0.92, Math.max(0.08, v));
    return [
      {
        id: a.id,
        x: clamp(mx + (dx / 2) * scale),
        y: clamp(my + (dy / 2) * scale),
      },
      {
        id: b.id,
        x: clamp(mx - (dx / 2) * scale),
        y: clamp(my - (dy / 2) * scale),
      },
    ];
  }, [bundle, pair]);

  useEffect(() => {
    if (round1Done && round2Done) onGate();
  }, [round1Done, round2Done, onGate]);

  if (!pair || clips.length < 2) {
    return (
      <ListeningRoomFrame>
        <ListeningRoomTitle plaque={copy.plaque}>{copy.title}</ListeningRoomTitle>
        <p className="lr-desk-status">{ui.pairsMissing}</p>
        <ListeningRoomContinue label={copy.cta} onClick={onContinue} disabled={!gateOpen} />
      </ListeningRoomFrame>
    );
  }

  const placementWord =
    pair.expected === "far" ? ui.farApart : ui.closeTogether;

  const onReveal = () => {
    if (!answer) return;
    setRevealed(true);
    if (round === 0) setRound1Done(true);
    if (round === 1) setRound2Done(true);
  };

  const nextRound = () => {
    setRound(1);
    setAnswer(null);
    setRevealed(false);
  };

  const roundHint =
    pair.kind === "same-measures-different-feel"
      ? ui.similarMeasurements
      : ui.differentMeasurements;

  return (
    <ListeningRoomFrame>
      <div className="lr-step-grid">
        <div>
          <ListeningRoomTitle plaque={copy.plaque} compact>
            {copy.title}
          </ListeningRoomTitle>
          <p className="lr-helper">
            {(ui.roundOf ?? "Round {n} of 2").replace(
              "{n}",
              String(round + 1),
            )}
            {roundHint}
          </p>

          <div className="lr-clip-stack">
            {clips.map((clip, i) => (
              <ClipPlayer
                key={clip.id}
                clip={clip}
                playingId={playingId}
                onPlayingChange={setPlayingId}
                indexLabel={clipOf
                  .replace("{n}", String(i + 1))
                  .replace("{total}", "2")}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>

          {!revealed ? (
            <div
              className="lr-hand-actions"
              role="group"
              aria-label={ui.areTheseSimilar}
            >
              <button
                type="button"
                className={`lr-judge-btn${answer === "similar" ? " is-on" : ""}`}
                aria-pressed={answer === "similar"}
                onClick={() => setAnswer("similar")}
              >
                {ui.similar}
              </button>
              <button
                type="button"
                className={`lr-judge-btn${answer === "not" ? " is-on" : ""}`}
                aria-pressed={answer === "not"}
                onClick={() => setAnswer("not")}
              >
                {ui.notSimilar}
              </button>
              <button
                type="button"
                className="lr-btn"
                disabled={!answer}
                onClick={onReveal}
              >
                {ui.seeWhere}
              </button>
            </div>
          ) : (
            <>
              <p className="lr-running" aria-live="polite">
                {ui.youSaidPrefix}{" "}
                {answer === "similar" ? ui.youSaidSimilar : ui.youSaidNotSimilar}
                . {ui.placedThem} <strong>{placementWord}</strong>.
              </p>
              {round === 0 && !round2Done ? (
                <button type="button" className="lr-btn" onClick={nextRound}>
                  {ui.nextPair}
                </button>
              ) : null}
            </>
          )}

          {round1Done && round2Done ? (
            <>
              <ListeningRoomLine>{copy.body1}</ListeningRoomLine>
              <ListeningRoomContinue
                label={copy.cta}
                onClick={onContinue}
                disabled={!gateOpen}
                className="mt-5"
              />
            </>
          ) : null}
        </div>

        <aside className="lr-hidden-aside">
          <SongBoard
            clips={clips}
            points={revealed ? boardPoints : []}
            activeId={playingId}
            onSelect={(id) => setPlayingId(id)}
            reducedMotion={reducedMotion}
            summary={
              revealed
                ? (ui.placementSummary ?? "Placement: {where}.").replace(
                    "{where}",
                    placementWord ?? "",
                  )
                : ui.answerFirst
            }
          />
          {round1Done && round2Done ? (
            <p className="lr-hidden-note">{copy.body2}</p>
          ) : null}
        </aside>
      </div>
    </ListeningRoomFrame>
  );
}
