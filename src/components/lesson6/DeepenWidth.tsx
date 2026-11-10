"use client";

import { useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  DepthContinue,
  DepthFrame,
  DepthLine,
  DepthTitle,
} from "@/components/lesson6/DepthFrame";
import {
  useLesson6Chrome,
  useLesson6StepCopy,
} from "@/lib/useLesson6Copy";
import { WIDE_VS_DEEP } from "@/lib/lesson6-data";
import { makeConcentricRings, type Point } from "@/lib/lesson6-toy-mlp";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
};

type Layout = "wide" | "deep";
type Pred = "yes" | "no" | null;

const RES = 48;
const SEPARATE_THRESHOLD = 0.82;

function fillTemplate(
  template: string,
  vars: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] == null ? `{${key}}` : String(vars[key]),
  );
}

/** Illustrative decision fields at equal unit count (see WIDE_VS_DEEP.mode). */
function illustrativeGrid(layout: Layout, res: number): Float32Array {
  const g = new Float32Array(res * res);
  for (let yi = 0; yi < res; yi++) {
    for (let xi = 0; xi < res; xi++) {
      const x = (xi / (res - 1)) * 2 - 1;
      const y = (yi / (res - 1)) * 2 - 1;
      if (layout === "wide") {
        // Soft linear cut — cannot wrap the rings.
        g[yi * res + xi] = 1 / (1 + Math.exp(-(x * 2.2 + y * 0.4)));
      } else {
        // Radial wrap — separates the rings.
        const r = Math.hypot(x, y);
        g[yi * res + xi] = 1 / (1 + Math.exp(-((r - 0.4) * 12)));
      }
    }
  }
  return g;
}

export function DeepenWidth({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson6StepCopy();
  const copy = steps.deepenWidth;
  const chrome = useLesson6Chrome();
  const ui = chrome.deepenWidth ?? {};
  const points = useMemo(() => makeConcentricRings(180, 42), []);
  const [pred, setPred] = useState<Pred>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [seen, setSeen] = useState<{ wide: boolean; deep: boolean }>({
    wide: false,
    deep: false,
  });
  const [status, setStatus] = useState<string>(copy.predictFirst);
  const [busy, setBusy] = useState(false);
  const [pcts, setPcts] = useState<{ wide: number | null; deep: number | null }>(
    { wide: null, deep: null },
  );
  const [verdict, setVerdict] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();
  const gateRef = useRef(onGate);
  gateRef.current = onGate;

  const bothSeen = seen.wide && seen.deep;
  const n = WIDE_VS_DEEP.totalUnits;
  const note = fillTemplate(copy.illustrativeNote, { n });

  async function runLayout(next: Layout) {
    if (pred == null || busy) return;
    setBusy(true);
    setLayout(next);
    if (!reduceMotion) await new Promise((r) => setTimeout(r, 40));

    const pct = WIDE_VS_DEEP.illustrativePct[next];
    const separated = pct / 100 >= SEPARATE_THRESHOLD;
    const nextVerdict = separated
      ? copy.verdict.separated
      : copy.verdict.notSeparated;

    paint(canvasRef.current, illustrativeGrid(next, RES), points);

    setVerdict(nextVerdict);
    setStatus(
      fillTemplate(copy.readout[next], { n, pct }) +
        " " +
        fillTemplate(ui.verdictSuffix ?? "Verdict: {verdict}.", {
          verdict: nextVerdict,
        }),
    );
    setPcts((prev) => ({ ...prev, [next]: pct }));
    const nextSeen = { ...seen, [next]: true };
    setSeen(nextSeen);
    if (nextSeen.wide && nextSeen.deep) gateRef.current();
    setBusy(false);
  }

  const predOptions = [
    ["yes", copy.preds.yes],
    ["no", copy.preds.no],
  ] as const;

  const layoutOptions = [
    ["wide", copy.options.wide],
    ["deep", copy.options.deep],
  ] as const;

  const caption =
    layout && pcts[layout] != null
      ? fillTemplate(copy.readout[layout], { n, pct: pcts[layout]! })
      : null;

  return (
    <DepthFrame>
      <div className="depth-layout">
        <div>
          <DepthTitle plaque={copy.plaque}>{copy.title}</DepthTitle>
          <DepthLine>{copy.body}</DepthLine>

          <p className="depth-eyebrow mt-5 mb-2">{copy.predictLabel}</p>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label={copy.predictLabel}
          >
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

          <p className="depth-eyebrow mt-5 mb-2">{copy.controlLabel}</p>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label={copy.controlLabel}
          >
            {layoutOptions.map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`depth-chip ${layout === id ? "is-active" : ""}`}
                aria-pressed={layout === id}
                aria-label={copy.layoutAnnounce[id]}
                disabled={pred == null || busy}
                onClick={() => void runLayout(id)}
              >
                {label}
                {seen[id] ? " ✓" : ""}
              </button>
            ))}
          </div>

          {!bothSeen ? (
            <p className="depth-mono mt-3" aria-live="polite">
              {busy ? copy.training : status}
            </p>
          ) : null}

          <DepthContinue
            label={copy.cta}
            onClick={onContinue}
            disabled={!gateOpen || !bothSeen}
          />
        </div>

        <aside className="depth-width-aside" aria-live="polite">
          <figure className="depth-split-panel">
            <p className="depth-eyebrow mb-2">
              {layout ? copy.layoutAnnounce[layout] : copy.controlLabel}
            </p>
            <canvas ref={canvasRef} className="depth-split-canvas" />
            <figcaption className="depth-split-result">
              {caption ?? "\u00a0"}
              {verdict && caption ? (
                <>
                  {" "}
                  <span className="depth-width-verdict">({verdict})</span>
                </>
              ) : null}
            </figcaption>
          </figure>

          {bothSeen ? (
            <aside className="depth-width-finding" role="note">
              <p className="depth-eyebrow mb-2">{ui.finding}</p>
              <p className="depth-mono depth-width-finding-note">{note}</p>
              <p className="depth-recon-finding-body mt-3">{copy.takeaway}</p>
              <p className="depth-width-finding-hedge mt-3">{copy.hedge}</p>
            </aside>
          ) : null}
        </aside>
      </div>
    </DepthFrame>
  );
}

function paint(
  canvas: HTMLCanvasElement | null,
  grid: Float32Array,
  points: Point[],
) {
  if (!canvas) return;
  canvas.width = RES;
  canvas.height = RES;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const img = ctx.createImageData(RES, RES);
  for (let i = 0; i < RES * RES; i++) {
    const p = grid[i];
    const o = i * 4;
    img.data[o] = Math.round(20 + p * 40);
    img.data[o + 1] = Math.round(30 + p * 120);
    img.data[o + 2] = Math.round(40 + p * 140);
    img.data[o + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  for (const p of points) {
    const x = ((p.x + 1) / 2) * (RES - 1);
    const y = ((p.y + 1) / 2) * (RES - 1);
    ctx.fillStyle = p.label === 1 ? "#3db8c5" : "#e0a04a";
    ctx.fillRect(x - 1, y - 1, 2, 2);
  }
}
