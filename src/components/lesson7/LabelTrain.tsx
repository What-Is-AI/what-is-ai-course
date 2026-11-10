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
import { useLesson7Session } from "@/components/lesson7/useLesson7Session";
import {
  layoutFromModel,
  trainLogistic,
  type TrainExample,
} from "@/lib/lesson7-train";
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

/** Step 4b – label examples, TRAIN, watch the board rearrange. */
export function LabelTrain({
  onContinue,
  gateOpen,
  onGate,
  reducedMotion,
}: Props) {
  const steps = useLesson7StepCopy();
  const copy = steps.labelTrain;
  const chrome = useLesson7Chrome();
  const ui = chrome.labelTrain ?? {};
  const clipOf =
    (chrome.clipPlayer as { clipOf?: string } | undefined)?.clipOf ??
    "Clip {n} of {total}";
  const { bundle, playingId, setPlayingId, loading } = useLesson7Audio();
  const {
    trainLabels,
    setTrainLabel,
    setTrainedModel,
    layoutAfter,
    setLayoutAfter,
    hasTrained,
    setHasTrained,
  } = useLesson7Session();
  const [status, setStatus] = useState("");
  const [showAfter, setShowAfter] = useState(true);

  const trainClips = useMemo(() => {
    if (!bundle) return [];
    const fromRole = bundle.clips.filter((c) => c.roles.includes("train"));
    return fromRole.slice(0, 10);
  }, [bundle]);

  const beforePoints = useMemo(() => {
    if (!bundle) return [];
    const ids = new Set(trainClips.map((c) => c.id));
    return bundle.layoutDefault.filter((p) => ids.has(p.id));
  }, [bundle, trainClips]);

  const labeled = Object.keys(trainLabels).filter((id) =>
    trainClips.some((c) => c.id === id),
  );
  const hasPos = labeled.some((id) => trainLabels[id] === "belongs");
  const hasNeg = labeled.some((id) => trainLabels[id] === "doesnt");
  const canTrain = labeled.length >= 2 && hasPos && hasNeg;

  useEffect(() => {
    if (hasTrained) onGate();
  }, [hasTrained, onGate]);

  const runTrain = () => {
    if (!bundle || !canTrain) return;
    setStatus(copy.status);
    const examples: TrainExample[] = labeled.map((id) => ({
      embedding: bundle.embeddings[id]!,
      label: trainLabels[id] === "belongs" ? 1 : 0,
    }));
    const model = trainLogistic(examples, { epochs: 100, lr: 0.12 });
    const ids = bundle.clips.map((c) => c.id);
    const after = layoutFromModel(ids, bundle.embeddings, model);
    setTrainedModel(model);
    setLayoutAfter(after);
    setHasTrained(true);
    setShowAfter(true);
    const belongsNow = after
      .filter((p) => trainLabels[p.id] === "belongs")
      .map((p) => p.x);
    const avgX =
      belongsNow.reduce((a, b) => a + b, 0) / (belongsNow.length || 1);
    setStatus(
      reducedMotion
        ? (ui.doneReduced ?? ui.done ?? "").replace(
            "{avgX}",
            avgX.toFixed(2),
          )
        : (ui.done ?? ""),
    );
  };

  const boardPoints = showAfter && layoutAfter.length > 0 ? layoutAfter : beforePoints;

  return (
    <ListeningRoomFrame>
      <div className="lr-step-grid">
        <div>
          <ListeningRoomTitle>{copy.title}</ListeningRoomTitle>
          <ListeningRoomLine>{ui.tagHint}</ListeningRoomLine>

          <div className="lr-train-list">
            {loading ? (
              <p className="lr-desk-status">{ui.loadingSongs}</p>
            ) : (
              trainClips.map((clip, i) => {
                const lab = trainLabels[clip.id];
                return (
                  <div key={clip.id} className="lr-train-row">
                    <ClipPlayer
                      clip={clip}
                      playingId={playingId}
                      onPlayingChange={setPlayingId}
                      indexLabel={clipOf
                        .replace("{n}", String(i + 1))
                        .replace("{total}", String(trainClips.length))}
                      reducedMotion={reducedMotion}
                      compact
                    />
                    <div className="lr-judge-row">
                      <button
                        type="button"
                        className={`lr-judge-btn${lab === "belongs" ? " is-on" : ""}`}
                        aria-pressed={lab === "belongs"}
                        onClick={() => setTrainLabel(clip.id, "belongs")}
                      >
                        {ui.belongs}
                      </button>
                      <button
                        type="button"
                        className={`lr-judge-btn${lab === "doesnt" ? " is-on" : ""}`}
                        aria-pressed={lab === "doesnt"}
                        onClick={() => setTrainLabel(clip.id, "doesnt")}
                      >
                        {ui.doesnt}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="lr-hand-actions">
            <button
              type="button"
              className="lr-btn"
              disabled={!canTrain}
              onClick={runTrain}
            >
              {ui.train}
            </button>
            {hasTrained && reducedMotion ? (
              <button
                type="button"
                className="lr-btn-secondary"
                onClick={() => setShowAfter((v) => !v)}
              >
                {showAfter ? ui.showBefore : ui.showAfter}
              </button>
            ) : null}
          </div>
          {status ? (
            <p className="lr-helper" aria-live="polite">
              {status}
            </p>
          ) : null}

          <ListeningRoomContinue
            label={copy.cta}
            onClick={onContinue}
            disabled={!gateOpen}
          />
        </div>

        <SongBoard
          clips={trainClips}
          points={boardPoints}
          labels={trainLabels}
          showLabelLegend
          activeId={playingId}
          onSelect={(id) => setPlayingId(id)}
          reducedMotion={reducedMotion}
          caption={copy.drawingCaption}
          summary={
            hasTrained
              ? showAfter
                ? ui.afterTrain
                : ui.beforeTrainScattered
              : ui.beforeTrainMark
          }
        />
      </div>
    </ListeningRoomFrame>
  );
}
