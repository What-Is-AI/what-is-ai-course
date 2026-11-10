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
import { useLesson7Session } from "@/components/lesson7/useLesson7Session";
import type { SliderFeatureId } from "@/lib/lesson7-data";
import { handDetectorSaysYes } from "@/lib/lesson7-train";
import {
  useLesson7Chrome,
  useLesson7DataCopy,
  useLesson7StepCopy,
} from "@/lib/useLesson7Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion: boolean;
};

function formatPct(v: number): string {
  return `${Math.round(v * 100)}`;
}

function truthBelongs(clip: { workoutBelongs?: boolean }): boolean {
  return Boolean(clip.workoutBelongs);
}

/** Step 3b – judge first (prediction); score detector against true labels. */
export function HandTest({
  onContinue,
  gateOpen,
  onGate,
  reducedMotion,
}: Props) {
  const steps = useLesson7StepCopy();
  const copy = steps.handTest;
  const chrome = useLesson7Chrome();
  const ui = chrome.handTest ?? {};
  const clipOf =
    (chrome.clipPlayer as { clipOf?: string } | undefined)?.clipOf ??
    "Clip {n} of {total}";
  const dataCopy = useLesson7DataCopy();
  const sliderLabels = dataCopy.sliderLabels as Record<SliderFeatureId, string>;
  const { bundle, playingId, setPlayingId, loading } = useLesson7Audio();
  const {
    thresholds,
    setThreshold,
    activeSliderIds,
    judgments,
    setJudgment,
    clearJudgments,
  } = useLesson7Session();
  const [showAdjust, setShowAdjust] = useState(false);

  const heldOut = useMemo(() => {
    if (!bundle) return [];
    const set = new Set(bundle.heldOutIds);
    return bundle.clips.filter((c) => set.has(c.id));
  }, [bundle]);

  const thrRecord = useMemo(() => {
    const out: Record<string, number> = {};
    for (const id of activeSliderIds) {
      out[id] = thresholds[id] ?? 0.5;
    }
    return out;
  }, [activeSliderIds, thresholds]);

  const judgedCount = heldOut.filter((c) => judgments[c.id] != null).length;
  const allJudged = heldOut.length > 0 && judgedCount === heldOut.length;

  /** Detector vs truth – the miss that the step is about. */
  const detectorHits = useMemo(() => {
    let hits = 0;
    let n = 0;
    for (const c of heldOut) {
      if (judgments[c.id] == null) continue;
      n += 1;
      const det = handDetectorSaysYes(c.features, thrRecord);
      if (det === truthBelongs(c)) hits += 1;
    }
    return { hits, n };
  }, [heldOut, judgments, thrRecord]);

  /** Learner vs truth – shown separately, not the miss tally. */
  const learnerHits = useMemo(() => {
    let hits = 0;
    let n = 0;
    for (const c of heldOut) {
      const j = judgments[c.id];
      if (j == null) continue;
      n += 1;
      if ((j === "belongs") === truthBelongs(c)) hits += 1;
    }
    return { hits, n };
  }, [heldOut, judgments]);

  /** Full-set detector score while adjusting (vs truth, all held-out). */
  const liveReadout = useMemo(() => {
    if (!showAdjust || heldOut.length === 0) return null;
    let hits = 0;
    for (const c of heldOut) {
      if (handDetectorSaysYes(c.features, thrRecord) === truthBelongs(c)) {
        hits += 1;
      }
    }
    return { hits, n: heldOut.length };
  }, [showAdjust, heldOut, thrRecord]);

  useEffect(() => {
    if (allJudged) onGate();
  }, [allJudged, onGate]);

  return (
    <ListeningRoomFrame>
      <div className="lr-step-grid">
        <div>
          <ListeningRoomTitle>{ui.title}</ListeningRoomTitle>
          <ListeningRoomLine>{copy.subhead}</ListeningRoomLine>

          <p className="lr-running" aria-live="polite">
            {judgedCount === 0
              ? copy.promptLine
              : `${copy.detectorTally
                  .replace("{hits}", String(detectorHits.hits))
                  .replace("{n}", String(detectorHits.n))}${
                  allJudged
                    ? ` ${copy.learnerTally
                        .replace("{hits}", String(learnerHits.hits))
                        .replace("{n}", String(learnerHits.n))}`
                    : ""
                }`}
          </p>

          {liveReadout ? (
            <p className="lr-helper lr-mono" aria-live="polite">
              {copy.adjustReadout
                .replace("{hits}", String(liveReadout.hits))
                .replace("{n}", String(liveReadout.n))}
            </p>
          ) : null}

          <div className="lr-hand-actions">
            <button
              type="button"
              className="lr-btn-secondary"
              onClick={() => setShowAdjust((v) => !v)}
            >
              {showAdjust ? ui.hideThresholds : ui.adjustThresholds}
            </button>
            {judgedCount > 0 ? (
              <button
                type="button"
                className="lr-btn-secondary"
                onClick={() => clearJudgments()}
              >
                {ui.clearJudgments}
              </button>
            ) : null}
          </div>

          {showAdjust ? (
            <div className="lr-slider-panel lr-slider-panel-compact">
              {activeSliderIds.map((id) => {
                const value = thresholds[id] ?? 0.5;
                return (
                  <label key={id} className="lr-slider-row">
                    <span className="lr-slider-label">
                      {sliderLabels[id as SliderFeatureId]}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={value}
                      onChange={(e) =>
                        setThreshold(id, Number.parseFloat(e.target.value))
                      }
                    />
                    <span className="lr-slider-value lr-mono">
                      {formatPct(value)}
                    </span>
                  </label>
                );
              })}
            </div>
          ) : null}

          <ListeningRoomContinue
            label={copy.cta}
            onClick={onContinue}
            disabled={!gateOpen}
          />
        </div>

        <ListeningDesk plaque={ui.heldOutSongs}>
          {loading || heldOut.length === 0 ? (
            <p className="lr-desk-status">{ui.loadingTestSet}</p>
          ) : (
            <div className="lr-clip-stack">
              {heldOut.map((clip, i) => {
                const judgment = judgments[clip.id];
                const revealed = judgment != null;
                const detYes = handDetectorSaysYes(clip.features, thrRecord);
                const truthYes = truthBelongs(clip);
                const detHit = detYes === truthYes;
                const learnerHit =
                  judgment != null && (judgment === "belongs") === truthYes;

                return (
                  <div key={clip.id} className="lr-hand-card">
                    <ClipPlayer
                      clip={clip}
                      playingId={playingId}
                      onPlayingChange={setPlayingId}
                      indexLabel={clipOf
                        .replace("{n}", String(i + 1))
                        .replace("{total}", String(heldOut.length))}
                      reducedMotion={reducedMotion}
                      compact
                    />
                    {!revealed ? (
                      <p className="lr-hand-feedback lr-mono">
                        {copy.hiddenPrompt}
                      </p>
                    ) : (
                      <p className="lr-hand-feedback lr-mono" aria-live="polite">
                        {copy.revealLine
                          .replace("{det}", detYes ? ui.detYes : ui.detNo)
                          .replace(
                            "{truth}",
                            truthYes ? ui.truthBelongs : ui.truthDoesnt,
                          )
                          .replace(
                            "{detHit}",
                            detHit ? ui.detHit : ui.detMiss,
                          )}
                        {" · "}
                        {learnerHit ? copy.youRight : copy.youWrong}
                      </p>
                    )}
                    <div
                      className="lr-judge-row"
                      role="group"
                      aria-label={`${ui.belongs} / ${ui.doesnt}: ${clip.title}`}
                    >
                      <button
                        type="button"
                        className={`lr-judge-btn${judgment === "belongs" ? " is-on" : ""}`}
                        aria-pressed={judgment === "belongs"}
                        onClick={() => setJudgment(clip.id, "belongs")}
                      >
                        {ui.belongs}
                      </button>
                      <button
                        type="button"
                        className={`lr-judge-btn${judgment === "doesnt" ? " is-on" : ""}`}
                        aria-pressed={judgment === "doesnt"}
                        onClick={() => setJudgment(clip.id, "doesnt")}
                      >
                        {ui.doesnt}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ListeningDesk>
      </div>
    </ListeningRoomFrame>
  );
}
