"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipPlayer } from "@/components/lesson7/ClipPlayer";
import { ListeningDesk } from "@/components/lesson7/ListeningDesk";
import {
  ListeningRoomContinue,
  ListeningRoomFrame,
  ListeningRoomTitle,
} from "@/components/lesson7/ListeningRoomFrame";
import { useLesson7Audio } from "@/components/lesson7/useLesson7Audio";
import { useLesson7Session } from "@/components/lesson7/useLesson7Session";
import {
  handDetectorSaysYes,
  predictLabel,
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

/**
 * Step 5 – live head-to-head: learner thresholds vs trained model on held-out.
 * Ground truth: curated workoutBelongs (same answers for both systems).
 */
export function HeadToHead({
  onContinue,
  gateOpen,
  onGate,
  reducedMotion,
}: Props) {
  const steps = useLesson7StepCopy();
  const copy = steps.headToHead;
  const chrome = useLesson7Chrome();
  const ui = chrome.headToHead ?? {};
  const clipOf =
    (chrome.clipPlayer as { clipOf?: string } | undefined)?.clipOf ??
    "Clip {n} of {total}";
  const { bundle, playingId, setPlayingId, loading } = useLesson7Audio();
  const { thresholds, activeSliderIds, trainedModel, features } =
    useLesson7Session();

  const [guessRules, setGuessRules] = useState(3);
  const [guessModel, setGuessModel] = useState(4);
  const [predicted, setPredicted] = useState(false);
  const [running, setRunning] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [done, setDone] = useState(false);

  const heldOut = useMemo(() => {
    if (!bundle) return [];
    const set = new Set(bundle.heldOutIds);
    return bundle.clips.filter((c) => set.has(c.id));
  }, [bundle]);

  const total = heldOut.length || 5;

  const thrRecord = useMemo(() => {
    const out: Record<string, number> = {};
    for (const id of activeSliderIds) {
      out[id] = thresholds[id] ?? 0.5;
    }
    return out;
  }, [activeSliderIds, thresholds]);

  const results = useMemo(() => {
    return heldOut.map((clip) => {
      const truth = Boolean(clip.workoutBelongs);
      const rulesYes = handDetectorSaysYes(clip.features, thrRecord);
      const emb = bundle?.embeddings[clip.id];
      const modelYes =
        trainedModel && emb
          ? predictLabel(trainedModel, emb) === 1
          : false;
      return {
        clip,
        truth,
        rulesCorrect: rulesYes === truth,
        modelCorrect: modelYes === truth,
      };
    });
  }, [heldOut, thrRecord, trainedModel, bundle]);

  const rulesScore = results
    .slice(0, revealed)
    .filter((r) => r.rulesCorrect).length;
  const modelScore = results
    .slice(0, revealed)
    .filter((r) => r.modelCorrect).length;

  const rulesFinal = results.filter((r) => r.rulesCorrect).length;
  const modelFinal = results.filter((r) => r.modelCorrect).length;

  useEffect(() => {
    if (done) onGate();
  }, [done, onGate]);

  useEffect(() => {
    if (!running || !predicted) return;
    if (revealed >= results.length) {
      setRunning(false);
      setDone(true);
      return;
    }
    const delay = reducedMotion ? 80 : 380;
    const t = window.setTimeout(() => setRevealed((n) => n + 1), delay);
    return () => window.clearTimeout(t);
  }, [running, predicted, revealed, results.length, reducedMotion]);

  const startRun = () => {
    setPredicted(true);
    setRevealed(0);
    setDone(false);
    setRunning(true);
  };

  const namedUnnamed = features.includes("unnamed");
  const rulesShown = done ? rulesFinal : rulesScore;
  const modelShown = done ? modelFinal : modelScore;

  return (
    <ListeningRoomFrame>
      <div className="lr-step-grid">
        <div className="lr-h2h-copy">
          <ListeningRoomTitle plaque={copy.plaque} compact>
            {copy.title}
          </ListeningRoomTitle>
          {!predicted ? (
            <p className="lr-helper">{copy.body}</p>
          ) : null}

          {!predicted ? (
            <div className="lr-guess-panel">
              <p className="lr-h2h-predict">
                {copy.predict.replace("{n}", String(total))}
              </p>
              <label className="lr-guess-row">
                {ui.yourRules}
                <input
                  type="number"
                  min={0}
                  max={total}
                  value={guessRules}
                  onChange={(e) =>
                    setGuessRules(
                      Math.min(total, Math.max(0, Number(e.target.value) || 0)),
                    )
                  }
                />
                <span className="lr-mono">/ {total}</span>
              </label>
              <label className="lr-guess-row">
                {ui.theModel}
                <input
                  type="number"
                  min={0}
                  max={total}
                  value={guessModel}
                  onChange={(e) =>
                    setGuessModel(
                      Math.min(total, Math.max(0, Number(e.target.value) || 0)),
                    )
                  }
                />
                <span className="lr-mono">/ {total}</span>
              </label>
              <button
                type="button"
                className="lr-btn"
                disabled={loading || !trainedModel || heldOut.length === 0}
                onClick={startRun}
              >
                {ui.runBoth}
              </button>
              {!trainedModel ? (
                <p className="lr-helper">{ui.trainFirst}</p>
              ) : null}
            </div>
          ) : (
            <div className="lr-h2h-results">
              <div className="lr-tally" aria-live="polite">
                <div className="lr-tally-row">
                  <span className="lr-tally-label">{ui.yourRules}</span>
                  <span className="lr-tally-score lr-mono">
                    {rulesShown}
                    <span className="lr-tally-of">/{total}</span>
                  </span>
                  <span className="lr-tally-guess lr-mono">
                    {(ui.guessed ?? "guessed {n}").replace(
                      "{n}",
                      String(guessRules),
                    )}
                  </span>
                </div>
                <div className="lr-tally-row">
                  <span className="lr-tally-label">{ui.theModel}</span>
                  <span className="lr-tally-score lr-mono">
                    {modelShown}
                    <span className="lr-tally-of">/{total}</span>
                  </span>
                  <span className="lr-tally-guess lr-mono">
                    {(ui.guessed ?? "guessed {n}").replace(
                      "{n}",
                      String(guessModel),
                    )}
                  </span>
                </div>
              </div>

              {!done ? (
                <p className="lr-helper lr-mono" aria-live="polite">
                  {(ui.scoringSong ?? "Scoring song {n} of {total}…")
                    .replace("{n}", String(Math.min(revealed + 1, total)))
                    .replace("{total}", String(total))}
                </p>
              ) : (
                <div className="lr-h2h-verdict">
                  <p className="lr-h2h-support">{copy.after1}</p>
                  <p className="lr-h2h-pivot">{copy.after2}</p>
                  {namedUnnamed ? (
                    <p className="lr-h2h-callback">{copy.callback}</p>
                  ) : null}
                </div>
              )}

              <ListeningRoomContinue
                label={copy.cta}
                onClick={onContinue}
                disabled={!gateOpen}
                className="mt-5"
              />
            </div>
          )}
        </div>

        <ListeningDesk plaque={ui.sameSongs}>
          {heldOut.length === 0 ? (
            <p className="lr-desk-status">{ui.loading}</p>
          ) : (
            <div className="lr-clip-stack">
              {heldOut.map((clip, i) => {
                const row = results[i];
                const shown = predicted && i < revealed;
                return (
                  <div key={clip.id} className="lr-hand-card">
                    <ClipPlayer
                      clip={clip}
                      playingId={playingId}
                      onPlayingChange={setPlayingId}
                      indexLabel={clipOf
                        .replace("{n}", String(i + 1))
                        .replace("{total}", String(total))}
                      reducedMotion={reducedMotion}
                      compact
                    />
                    {shown && row ? (
                      <p className="lr-hand-feedback lr-mono">
                        {(ui.resultLine ?? "rules {rules} · model {model}")
                          .replace("{rules}", row.rulesCorrect ? "✓" : "✗")
                          .replace("{model}", row.modelCorrect ? "✓" : "✗")}
                      </p>
                    ) : (
                      <p className="lr-hand-feedback lr-mono">{ui.waiting}</p>
                    )}
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
