"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  NetworkContinue,
  NetworkFrame,
  NetworkTitle,
} from "@/components/lesson5/NetworkFrame";
import { useT } from "@/i18n/LocaleProvider";

type Props = { onContinue: () => void };
type Pt = { x: number; y: number };
type TrainPt = Pt & { label: 0 | 1 }; // 0 = cat, 1 = dog

const VB = 100;
const PAD = 8;

/** Same 12 training dots on both plots. */
const TRAIN: TrainPt[] = [
  { x: 18, y: 22, label: 0 },
  { x: 28, y: 18, label: 0 },
  { x: 38, y: 26, label: 0 },
  { x: 22, y: 34, label: 0 },
  { x: 32, y: 40, label: 0 },
  { x: 48, y: 28, label: 0 },
  { x: 62, y: 58, label: 1 },
  { x: 72, y: 52, label: 1 },
  { x: 78, y: 68, label: 1 },
  { x: 68, y: 74, label: 1 },
  { x: 84, y: 60, label: 1 },
  { x: 55, y: 48, label: 1 },
];

/** Smooth boundary: misses the near dog at (55,48) → 11/12. */
const SMOOTH: Pt[] = [
  { x: 0, y: 42 },
  { x: 25, y: 43 },
  { x: 45, y: 52 },
  { x: 60, y: 54 },
  { x: 80, y: 50 },
  { x: 100, y: 48 },
];

/** Wiggly boundary: wraps every training point → 12/12. */
const WIGGLY: Pt[] = [
  { x: 0, y: 44 },
  { x: 10, y: 40 },
  { x: 18, y: 48 },
  { x: 24, y: 36 },
  { x: 32, y: 48 },
  { x: 38, y: 34 },
  { x: 44, y: 44 },
  { x: 50, y: 38 },
  { x: 54, y: 45.5 },
  { x: 58, y: 50 },
  { x: 66, y: 48 },
  { x: 72, y: 51 },
  { x: 80, y: 56 },
  { x: 88, y: 50 },
  { x: 100, y: 52 },
];

const NEW_START: Pt = { x: 50, y: 14 };

function curveY(x: number, pts: Pt[]) {
  if (x <= pts[0].x) return pts[0].y;
  if (x >= pts[pts.length - 1].x) return pts[pts.length - 1].y;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (x >= a.x && x <= b.x) {
      const t = (x - a.x) / (b.x - a.x || 1);
      return a.y + t * (b.y - a.y);
    }
  }
  return pts[pts.length - 1].y;
}

/** Cat if above the curve (smaller SVG y); dog otherwise. */
function predict(p: Pt, curve: Pt[]): 0 | 1 {
  return p.y < curveY(p.x, curve) ? 0 : 1;
}

function sampleCurve(pts: Pt[], steps = 48): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * VB;
    out.push({ x, y: curveY(x, pts) });
  }
  return out;
}

function boundaryPath(pts: Pt[]) {
  const samples = sampleCurve(pts);
  return samples
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
}

/** sklearn-style region fill: class 0 above the boundary. */
function regionAbovePath(pts: Pt[]) {
  const samples = sampleCurve(pts);
  const along = samples
    .map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  return `M 0 0 L 0 ${samples[0].y.toFixed(2)} ${along} L ${VB} 0 Z`;
}

function regionBelowPath(pts: Pt[]) {
  const samples = sampleCurve(pts);
  const along = samples
    .map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  return `M 0 ${VB} L 0 ${samples[0].y.toFixed(2)} ${along} L ${VB} ${VB} Z`;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function BoundaryPlot({
  title,
  badge,
  badgeOk,
  curve,
  newPt,
  showOutcome,
  missHighlight,
  onPointerDownNew,
}: {
  title: string;
  badge: string;
  badgeOk: boolean;
  curve: Pt[];
  newPt: Pt;
  showOutcome: boolean;
  missHighlight: boolean;
  onPointerDownNew: (e: ReactPointerEvent) => void;
}) {
  const t = useT();
  const clipId = useId().replace(/:/g, "");
  const pred = predict(newPt, curve);
  const correct = pred === 0;
  const boundary = useMemo(() => boundaryPath(curve), [curve]);
  const above = useMemo(() => regionAbovePath(curve), [curve]);
  const below = useMemo(() => regionBelowPath(curve), [curve]);

  return (
    <figure className="network-overfit-plot">
      <figcaption className="network-overfit-plot-head">
        <span className="network-overfit-plot-title">{title}</span>
        <span
          className={`network-overfit-badge${badgeOk ? " is-ok" : " is-soft"}`}
        >
          {badge}
        </span>
      </figcaption>
      <svg
        viewBox={`${-PAD} ${-PAD} ${VB + PAD * 2} ${VB + PAD * 2}`}
        className="network-overfit-svg"
        role="img"
        aria-label={title}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={0} width={VB} height={VB} rx={1.5} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect x={0} y={0} width={VB} height={VB} className="network-overfit-canvas" />
          <path d={above} className="network-overfit-region is-cat" />
          <path d={below} className="network-overfit-region is-dog" />
          {[20, 40, 60, 80].map((g) => (
            <g key={g} className="network-overfit-grid">
              <line x1={g} y1={0} x2={g} y2={VB} />
              <line x1={0} y1={g} x2={VB} y2={g} />
            </g>
          ))}
          <path d={boundary} className="network-overfit-boundary" fill="none" />
          {TRAIN.map((p, i) => {
            const miss = missHighlight && predict(p, curve) !== p.label;
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={miss ? 2.6 : 2.15}
                className={
                  p.label === 0
                    ? "network-overfit-dot is-cat"
                    : "network-overfit-dot is-dog"
                }
                strokeWidth={miss ? 1.1 : 0.55}
              />
            );
          })}
          {!showOutcome ? (
            <circle
              cx={newPt.x}
              cy={newPt.y}
              r={5.2}
              className="network-overfit-new-ring"
              aria-hidden
            />
          ) : null}
          <circle
            cx={newPt.x}
            cy={newPt.y}
            r={3.2}
            className={`network-overfit-new${showOutcome ? "" : " is-invite"}`}
            onPointerDown={onPointerDownNew}
            style={{ touchAction: "none", cursor: "grab" }}
          />
          <text
            x={newPt.x}
            y={newPt.y - 4.8}
            textAnchor="middle"
            className={`network-overfit-new-label${showOutcome ? "" : " is-invite"}`}
          >
            {t("lesson5.overfit.newTag")}
          </text>
        </g>
        <line
          x1={0}
          y1={VB}
          x2={VB}
          y2={VB}
          className="network-overfit-axis"
        />
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={VB}
          className="network-overfit-axis"
        />
      </svg>
      <div
        className={`network-overfit-outcome${
          showOutcome ? (correct ? " is-ok" : " is-miss") : " is-idle"
        }`}
        aria-live="polite"
      >
        {showOutcome ? (
          <>
            <span>
              {pred === 1
                ? t("lesson5.overfit.predDog")
                : t("lesson5.overfit.predCat")}
            </span>
            <span className="network-overfit-outcome-sep">·</span>
            <span>{t("lesson5.overfit.actualCat")}</span>
            <span className="network-overfit-outcome-flag">
              {correct
                ? t("lesson5.overfit.flagCorrect")
                : t("lesson5.overfit.flagMiss")}
            </span>
          </>
        ) : (
          <span>{t("lesson5.overfit.dropHint")}</span>
        )}
      </div>
    </figure>
  );
}

export function OverfitSurprise({ onContinue }: Props) {
  const t = useT();
  const hintId = useId();
  const dragRef = useRef<{
    svg: SVGSVGElement;
    pointerId: number;
  } | null>(null);
  const [newPt, setNewPt] = useState<Pt>(NEW_START);
  const [placed, setPlaced] = useState(false);

  const clientToSvg = useCallback(
    (svg: SVGSVGElement, cx: number, cy: number) => {
      const pt = svg.createSVGPoint();
      pt.x = cx;
      pt.y = cy;
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const local = pt.matrixTransform(ctm.inverse());
      return {
        x: clamp(local.x, 3, 97),
        y: clamp(local.y, 3, 97),
      };
    },
    [],
  );

  const onPointerDownNew = useCallback(
    (e: ReactPointerEvent) => {
      const svg = (e.currentTarget as SVGCircleElement).ownerSVGElement;
      if (!svg) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = { svg, pointerId: e.pointerId };
      const next = clientToSvg(svg, e.clientX, e.clientY);
      if (next) {
        setNewPt(next);
        if (next.y > 18) setPlaced(true);
      }
    },
    [clientToSvg],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return;
      const next = clientToSvg(drag.svg, e.clientX, e.clientY);
      if (next) {
        setNewPt(next);
        if (next.y > 18) setPlaced(true);
      }
    };
    const onUp = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return;
      dragRef.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [clientToSvg]);

  const nudge = (dx: number, dy: number) => {
    setNewPt((p) => {
      const next = {
        x: clamp(p.x + dx, 3, 97),
        y: clamp(p.y + dy, 3, 97),
      };
      if (next.y > 18) setPlaced(true);
      return next;
    });
  };

  return (
    <NetworkFrame className="network-overfit">
      <div className="network-overfit-layout">
        <aside className="network-overfit-copy">
          <NetworkTitle plaque={t("lesson5.overfit.plaque")} compact>
            {t("lesson5.overfit.title")}
          </NetworkTitle>
          <p className="network-overfit-ask">{t("lesson5.overfit.ask")}</p>

          <div className="network-overfit-intro">
            <p>{t("lesson5.overfit.body1")}</p>
            <p>{t("lesson5.overfit.body2")}</p>
          </div>

          <div className="network-overfit-visual-lead">
            <p className="network-overfit-visual-intro">
              {t("lesson5.overfit.visualIntro")}
            </p>
            <p className="network-support">
              {t("lesson5.overfit.boundaryDef")}
            </p>
          </div>

          {placed ? (
            <div className="network-overfit-prose">
              <ol className="network-overfit-points">
                <li>{t("lesson5.overfit.debrief1")}</li>
                <li>{t("lesson5.overfit.debrief2")}</li>
              </ol>
              <p className="network-overfit-takeaway">
                {t("lesson5.overfit.takeaway")}
              </p>
              <NetworkContinue
                label={t("lesson5.overfit.cta")}
                onClick={onContinue}
                className="network-overfit-cta"
              />
            </div>
          ) : null}
        </aside>

        <div className="network-overfit-viz">
          <p className="network-overfit-prompt" id={hintId}>
            {t("lesson5.overfit.prompt")}
          </p>
          <button
            type="button"
            className="sr-only"
            aria-describedby={hintId}
            aria-label={t("lesson5.overfit.newAria")}
            onKeyDown={(e) => {
              const step = e.shiftKey ? 4 : 2;
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                nudge(-step, 0);
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                nudge(step, 0);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                nudge(0, -step);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                nudge(0, step);
              }
            }}
          />
          <div className="network-overfit-legend" aria-hidden>
            <span className="network-overfit-legend-item is-cat">
              {t("lesson5.shared.cat")}
            </span>
            <span className="network-overfit-legend-item is-dog">
              {t("lesson5.shared.dog")}
            </span>
          </div>
          <div className="network-overfit-stage">
            <BoundaryPlot
              title={t("lesson5.overfit.fitsLabel")}
              badge={t("lesson5.overfit.badgePerfect")}
              badgeOk
              curve={WIGGLY}
              newPt={newPt}
              showOutcome={placed}
              missHighlight={false}
              onPointerDownNew={onPointerDownNew}
            />
            <BoundaryPlot
              title={t("lesson5.overfit.learnsLabel")}
              badge={t("lesson5.overfit.badgeGeneral")}
              badgeOk={false}
              curve={SMOOTH}
              newPt={newPt}
              showOutcome={placed}
              missHighlight
              onPointerDownNew={onPointerDownNew}
            />
          </div>
        </div>
      </div>
    </NetworkFrame>
  );
}
