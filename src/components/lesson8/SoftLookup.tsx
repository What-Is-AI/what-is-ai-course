"use client";

import { useEffect, useMemo, useState } from "react";
import { ChooseHelper } from "@/components/lesson8/ChooseHelper";
import { HonestyChip } from "@/components/lesson8/HonestyChip";
import { PaperPage } from "@/components/lesson8/PaperPage";
import {
  ReadingRoomContinue,
  ReadingRoomFrame,
  ReadingRoomLine,
  ReadingRoomTitle,
} from "@/components/lesson8/ReadingRoomFrame";
import {
  useLesson8Chrome,
  useLesson8LocaleData,
  useLesson8StepCopy,
} from "@/lib/useLesson8Copy";
import { normalizeWeights } from "@/lib/lesson8-data";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion: boolean;
};

/** S5 – Soft lookup: drawers → Q/K/V strip → weighted mixture. */
export function SoftLookup({
  onContinue,
  gateOpen,
  onGate,
  reducedMotion: _reducedMotion,
}: Props) {
  const steps = useLesson8StepCopy();
  const chrome = useLesson8Chrome();
  const copy = steps.softLookup;
  const ui = chrome.softLookup ?? {};
  const localeData = useLesson8LocaleData();
  const [scores, setScores] = useState(() =>
    localeData.lookupDrawers.map((d) => d.match),
  );
  const [inspected, setInspected] = useState(false);
  const [stripped, setStripped] = useState(false);
  const [live, setLive] = useState("");

  const weights = useMemo(() => normalizeWeights(scores), [scores]);
  const ready = inspected;

  useEffect(() => {
    if (ready && !gateOpen) onGate();
  }, [ready, gateOpen, onGate]);

  function bump(index: number, value: number) {
    setScores((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setInspected(true);
    const drawer = localeData.lookupDrawers[index]!;
    setLive(
      `${drawer.keyLabel} match ${value.toFixed(2)}. Mixture updates.`,
    );
  }

  function inspectRow(index: number) {
    setInspected(true);
    const drawer = localeData.lookupDrawers[index]!;
    const w = weights[index] ?? 0;
    setLive(
      `${drawer.keyLabel}: match ${scores[index]!.toFixed(2)}, weight ${(w * 100).toFixed(0)}%, value “${drawer.valueLabel}”.`,
    );
  }

  return (
    <ReadingRoomFrame>
      <div className="rr-stage rr-stage-lookup">
        <div className="rr-lookup-lead">
          <ReadingRoomTitle plaque={copy.plaque} compact>
            {copy.title}
          </ReadingRoomTitle>
          <ReadingRoomLine compact>{copy.body}</ReadingRoomLine>
          <ReadingRoomLine compact>{copy.drawers}</ReadingRoomLine>
          <ReadingRoomLine compact>{copy.compare}</ReadingRoomLine>
        </div>

        <div className="rr-lookup-desk">
          <ChooseHelper>{ui.inspectOrNudge}</ChooseHelper>
          <PaperPage mark={ui.referenceDesk} className="rr-lookup-page">
            <p className="rr-eyebrow">{copy.queryLabel}</p>
            <p className="rr-lookup-query">{localeData.lookupQuery}</p>

            <table className="rr-lookup-table">
              <caption className="sr-only">{ui.tableCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">
                    {stripped ? copy.kLabel : copy.drawerCol}
                  </th>
                  <th scope="col">{copy.matchCol}</th>
                  <th scope="col">
                    {stripped ? copy.vLabel : copy.contentCol}
                  </th>
                </tr>
              </thead>
              <tbody>
                {localeData.lookupDrawers.map((drawer, i) => (
                  <tr key={drawer.id}>
                    <th scope="row">
                      <button
                        type="button"
                        className="rr-lookup-key"
                        onClick={() => inspectRow(i)}
                      >
                        {drawer.keyLabel}
                      </button>
                    </th>
                    <td>
                      <label className="rr-lookup-score">
                        <span className="sr-only">
                          Match score for {drawer.keyLabel}
                        </span>
                        <input
                          type="range"
                          min={0.05}
                          max={1}
                          step={0.01}
                          value={scores[i]}
                          onChange={(e) => bump(i, Number(e.target.value))}
                          aria-valuetext={scores[i]!.toFixed(2)}
                        />
                        <span className="rr-strength-val">
                          {scores[i]!.toFixed(2)}
                        </span>
                      </label>
                    </td>
                    <td>
                      <span className="rr-lookup-value">
                        {drawer.valueLabel}
                      </span>
                      <span className="rr-lookup-weight">
                        {(weights[i]! * 100).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="rr-lookup-desk-foot">
              <HonestyChip />
              <p className="rr-gate-hint">{copy.nudgeHint}</p>
            </div>

            {!stripped ? (
              <button
                type="button"
                className="rr-deeper-open"
                onClick={() => {
                  setStripped(true);
                  setInspected(true);
                }}
              >
                {copy.stripLabel} → {copy.qLabel} / {copy.kLabel} /{" "}
                {copy.vLabel}
              </button>
            ) : (
              <ReadingRoomLine compact>{copy.analogy}</ReadingRoomLine>
            )}
          </PaperPage>

          <p className="sr-only" role="status" aria-live="polite">
            {live}
          </p>
        </div>

        <div className="rr-lookup-result">
          <div className="rr-mixture" role="status">
            <p className="rr-eyebrow">{copy.mixtureLabel}</p>
            <ul className="rr-mixture-list">
              {localeData.lookupDrawers.map((drawer, i) => (
                <li key={drawer.id}>
                  <span
                    className="rr-mixture-bar"
                    style={{ width: `${weights[i]! * 100}%` }}
                    aria-hidden
                  />
                  <span>
                    {drawer.keyLabel}: {(weights[i]! * 100).toFixed(0)}% ·{" "}
                    {drawer.valueLabel}
                  </span>
                </li>
              ))}
            </ul>
            <ReadingRoomLine compact>{copy.mixtureHint}</ReadingRoomLine>
          </div>

          {ready ? (
            <ReadingRoomContinue
              label={copy.cta}
              onClick={onContinue}
              disabled={!gateOpen}
            />
          ) : (
            <p className="rr-gate-hint" role="status">
              Inspect a drawer or nudge a match score to continue.
            </p>
          )}
        </div>
      </div>
    </ReadingRoomFrame>
  );
}
