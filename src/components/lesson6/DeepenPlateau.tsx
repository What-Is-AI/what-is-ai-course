"use client";

import { useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  DepthContinue,
  DepthFrame,
  DepthLine,
  DepthTitle,
} from "@/components/lesson6/DepthFrame";
import { useLesson6Chrome, useLesson6StepCopy } from "@/lib/useLesson6Copy";
import {
  TOY_DEPTH_LEVELS,
  TOY_PLATEAU_SCHEDULE,
} from "@/lib/lesson6-data";
import {
  hiddenSizesForDepth,
  makePlateauRings,
  ToyMLP,
} from "@/lib/lesson6-toy-mlp";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
};

type Pred = "improve" | "plateau" | "worse" | null;
type CurvePt = { depth: number; acc: number };

function fillTemplate(
  template: string,
  vars: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] == null ? `{${key}}` : String(vars[key]),
  );
}

function describeStep(
  copy: ReturnType<typeof useLesson6StepCopy>["deepenPlateau"],
  depth: number,
  acc: number,
  curve: CurvePt[],
): string {
  const pct = Math.round(acc * 100);
  const prev = curve[curve.length - 2];
  const bestSoFar =
    curve.length === 0
      ? acc
      : Math.max(...curve.map((c) => c.acc), acc);
  if (depth <= 1) {
    return fillTemplate(copy.readout.shallow, { d: depth, pct });
  }
  if (prev && acc < prev.acc - 0.02) {
    const kind = acc < bestSoFar - 0.04 ? copy.readout.worse : copy.readout.slip;
    return fillTemplate(kind, { d: depth, pct });
  }
  if (Math.abs(acc - bestSoFar) < 0.005) {
    return fillTemplate(copy.readout.peak, { d: depth, pct });
  }
  return fillTemplate(copy.readout.rising, { d: depth, pct });
}

function hasTurned(curve: CurvePt[]): boolean {
  if (curve.length < 2) return false;
  let peak = curve[0].acc;
  let peakIdx = 0;
  for (let i = 1; i < curve.length; i++) {
    if (curve[i].acc > peak) {
      peak = curve[i].acc;
      peakIdx = i;
    }
  }
  for (let i = peakIdx + 1; i < curve.length; i++) {
    if (curve[i].acc <= peak - 0.04) return true;
  }
  return false;
}

function peakDepth(curve: CurvePt[]): number {
  let best = curve[0];
  for (const c of curve) {
    if (c.acc > best.acc) best = c;
  }
  return best.depth;
}

export function DeepenPlateau({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson6StepCopy();
  const chrome = useLesson6Chrome();
  const copy = steps.deepenPlateau;
  const ui = chrome.deepenPlateau ?? {};
  const points = useMemo(() => makePlateauRings(200, 11), []);
  const [pred, setPred] = useState<Pred>(null);
  const [nextIdx, setNextIdx] = useState(0);
  const [curve, setCurve] = useState<CurvePt[]>([]);
  const [status, setStatus] = useState<string>(copy.predictFirst);
  const [busy, setBusy] = useState(false);
  const [turned, setTurned] = useState(false);
  const reduceMotion = useReducedMotion();
  const gateRef = useRef(onGate);
  gateRef.current = onGate;

  function trainAt(idx: number): number {
    const d = TOY_DEPTH_LEVELS[idx];
    const schedule = TOY_PLATEAU_SCHEDULE[d];
    const net = new ToyMLP(
      hiddenSizesForDepth(d),
      2,
      1,
      schedule.seed,
    );
    net.train(points, schedule.epochs, schedule.lr);
    return net.separationScore(points);
  }

  async function addDepth() {
    if (pred == null || busy || nextIdx >= TOY_DEPTH_LEVELS.length) return;
    setBusy(true);
    if (!reduceMotion) await new Promise((r) => setTimeout(r, 40));

    const idx = nextIdx;
    const d = TOY_DEPTH_LEVELS[idx];
    const acc = trainAt(idx);
    const nextCurve = [...curve, { depth: d, acc }];
    const line = describeStep(copy, d, acc, nextCurve);
    const prev = curve[curve.length - 1];
    const announce =
      prev && acc < prev.acc
        ? `${line} Down from ${Math.round(prev.acc * 100)}%.`
        : line;

    setCurve(nextCurve);
    setNextIdx(idx + 1);
    setStatus(announce);

    const didTurn = hasTurned(nextCurve);
    if (didTurn) {
      setTurned(true);
      gateRef.current();
    }

    setBusy(false);
  }

  const pointList = curve
    .map((c) => `d${c.depth} ${Math.round(c.acc * 100)}%`)
    .join(", ");
  const chartSummary =
    turned && curve.length
      ? fillTemplate(copy.chartSummaryTemplate, { peak: peakDepth(curve) })
      : curve.length
        ? fillTemplate(ui.depthsSoFar ?? "Depth points so far: {points}.", {
            points: pointList,
          })
        : (ui.noDepthsMeasured ?? "No depths measured yet.");

  const canAdd = pred != null && nextIdx < TOY_DEPTH_LEVELS.length && !busy;
  const predOptions = [
    ["improve", copy.preds.improve],
    ["plateau", copy.preds.plateau],
    ["worse", copy.preds.worse],
  ] as const;

  return (
    <DepthFrame>
      <div className="depth-layout">
        <div>
          <DepthTitle plaque={copy.plaque}>{copy.title}</DepthTitle>
          <DepthLine>{copy.body}</DepthLine>

          <p className="depth-eyebrow mt-5 mb-2">{copy.predictLabel}</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={copy.predictLabel}>
            {predOptions.map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`depth-chip ${pred === id ? "is-active" : ""}`}
                aria-pressed={pred === id}
                onClick={() => setPred(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="depth-btn mt-4"
            disabled={!canAdd}
            onClick={() => void addDepth()}
          >
            {copy.addDepth}
          </button>

          <p className="depth-mono mt-3" aria-live="polite">
            {status}
          </p>

          {turned ? <DepthLine compact>{copy.reveal}</DepthLine> : null}

          <DepthContinue
            label={copy.cta}
            onClick={onContinue}
            disabled={!gateOpen || !turned}
          />
        </div>

        <aside className="depth-curve-panel">
          <p className="depth-eyebrow mb-3">{copy.chartTitle}</p>
          <DepthCurveChart curve={curve} peak={turned ? peakDepth(curve) : null} />
          <p className="depth-mono mt-3" aria-live="polite">
            {chartSummary}
          </p>
        </aside>
      </div>
    </DepthFrame>
  );
}

function DepthCurveChart({
  curve,
  peak,
}: {
  curve: CurvePt[];
  peak: number | null;
}) {
  const w = 280;
  const h = 160;
  const pad = { t: 12, r: 12, b: 28, l: 36 };
  const depths = [...TOY_DEPTH_LEVELS];
  const xOf = (d: number) =>
    pad.l +
    ((depths.indexOf(d as (typeof TOY_DEPTH_LEVELS)[number]) /
      Math.max(1, depths.length - 1)) *
      (w - pad.l - pad.r));
  const yOf = (acc: number) =>
    pad.t + (1 - Math.min(1, Math.max(0, acc))) * (h - pad.t - pad.b);

  const poly =
    curve.length > 0
      ? curve.map((c, i) => `${i === 0 ? "M" : "L"} ${xOf(c.depth)} ${yOf(c.acc)}`).join(" ")
      : "";

  return (
    <svg
      className="depth-curve-svg"
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-hidden
    >
      {[0.5, 0.75, 1].map((tick) => (
        <g key={tick}>
          <line
            x1={pad.l}
            x2={w - pad.r}
            y1={yOf(tick)}
            y2={yOf(tick)}
            className="depth-curve-grid"
          />
          <text x={4} y={yOf(tick) + 3} className="depth-curve-label">
            {Math.round(tick * 100)}
          </text>
        </g>
      ))}
      {depths.map((d) => (
        <text
          key={d}
          x={xOf(d)}
          y={h - 6}
          textAnchor="middle"
          className="depth-curve-label"
        >
          {d}
        </text>
      ))}
      {poly ? (
        <path d={poly} className="depth-curve-line" fill="none" />
      ) : null}
      {curve.map((c) => (
        <circle
          key={c.depth}
          cx={xOf(c.depth)}
          cy={yOf(c.acc)}
          r={peak === c.depth ? 5 : 3.5}
          className={
            peak === c.depth ? "depth-curve-peak" : "depth-curve-point"
          }
        />
      ))}
    </svg>
  );
}
