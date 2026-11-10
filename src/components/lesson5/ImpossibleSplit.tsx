"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  NetworkContinue,
  NetworkFrame,
  NetworkLine,
  NetworkTitle,
} from "@/components/lesson5/NetworkFrame";
import { useT } from "@/i18n/LocaleProvider";

type Props = { onContinue: () => void };
type Phase = "a" | "b" | "c";
type Point = { x: number; y: number; label: 0 | 1 };

const CAT_IMG = "/lesson2/tabby-staring.png";
const DOG_IMG = "/lesson2/golden-retriever-outdoors.png";

/** x = snout length, y = ear pointiness (SVG: high ear near top). Cat=0, Dog=1 */
const EASY: Point[] = [
  { x: 18, y: 22, label: 0 },
  { x: 24, y: 28, label: 0 },
  { x: 30, y: 18, label: 0 },
  { x: 22, y: 34, label: 0 },
  { x: 28, y: 26, label: 0 },
  { x: 72, y: 72, label: 1 },
  { x: 78, y: 68, label: 1 },
  { x: 68, y: 80, label: 1 },
  { x: 80, y: 76, label: 1 },
  { x: 74, y: 84, label: 1 },
];

const HARD: Point[] = [
  { x: 22, y: 26, label: 0 },
  { x: 28, y: 34, label: 0 },
  { x: 70, y: 68, label: 0 },
  { x: 76, y: 74, label: 0 },
  { x: 72, y: 28, label: 1 },
  { x: 78, y: 34, label: 1 },
  { x: 24, y: 68, label: 1 },
  { x: 30, y: 74, label: 1 },
];

function side(p: Point, angle: number, offset: number) {
  const rad = (angle * Math.PI) / 180;
  const nx = Math.cos(rad);
  const ny = Math.sin(rad);
  const cx = 50 + nx * offset;
  const cy = 50 + ny * offset;
  return (p.x - cx) * nx + (p.y - cy) * ny >= 0 ? 1 : 0;
}

function scoreLine(points: Point[], angle: number, offset: number) {
  const tally = (flip: boolean) => {
    let redOk = 0;
    let blueOk = 0;
    let redTotal = 0;
    let blueTotal = 0;
    for (const p of points) {
      let pred = side(p, angle, offset) as 0 | 1;
      if (flip) pred = pred === 0 ? 1 : 0;
      if (p.label === 0) {
        redTotal += 1;
        if (pred === 0) redOk += 1;
      } else {
        blueTotal += 1;
        if (pred === 1) blueOk += 1;
      }
    }
    return { redOk, blueOk, redTotal, blueTotal };
  };
  const a = tally(false);
  const b = tally(true);
  const useB = b.redOk + b.blueOk > a.redOk + a.blueOk;
  const best = useB ? b : a;
  return {
    ...best,
    separated: best.redOk === best.redTotal && best.blueOk === best.blueTotal,
  };
}

function scoreXor(
  points: Point[],
  a1: number,
  o1: number,
  a2: number,
  o2: number,
) {
  const tally = (flip: boolean) => {
    let redOk = 0;
    let blueOk = 0;
    let redTotal = 0;
    let blueTotal = 0;
    for (const p of points) {
      const s1 = side(p, a1, o1);
      const s2 = side(p, a2, o2);
      let pred = (s1 !== s2 ? 1 : 0) as 0 | 1;
      if (flip) pred = pred === 0 ? 1 : 0;
      if (p.label === 0) {
        redTotal += 1;
        if (pred === 0) redOk += 1;
      } else {
        blueTotal += 1;
        if (pred === 1) blueOk += 1;
      }
    }
    return { redOk, blueOk, redTotal, blueTotal };
  };
  const a = tally(false);
  const b = tally(true);
  const useB = b.redOk + b.blueOk > a.redOk + a.blueOk;
  const best = useB ? b : a;
  return {
    ...best,
    separated: best.redOk === best.redTotal && best.blueOk === best.blueTotal,
  };
}

function lineEnds(angle: number, offset: number) {
  const rad = (angle * Math.PI) / 180;
  const nx = Math.cos(rad);
  const ny = Math.sin(rad);
  const cx = 50 + nx * offset;
  const cy = 50 + ny * offset;
  const tx = -ny;
  const ty = nx;
  return {
    x1: cx - tx * 70,
    y1: cy - ty * 70,
    x2: cx + tx * 70,
    y2: cy + ty * 70,
  };
}

function FeaturePipeline({
  kind,
  src,
  ear,
  snout,
  photoLabel,
  featuresLabel,
  numbersLabel,
  earLabel,
  snoutLabel,
}: {
  kind: "cat" | "dog";
  src: string;
  ear: string;
  snout: string;
  photoLabel: string;
  featuresLabel: string;
  numbersLabel: string;
  earLabel: string;
  snoutLabel: string;
}) {
  return (
    <div className={`network-feature-row is-${kind}`}>
      <div className="network-feature-step">
        <div className="network-feature-thumb">
          <Image src={src} alt="" fill className="object-cover" sizes="72px" />
        </div>
        <span>{photoLabel}</span>
      </div>
      <span className="network-feature-arrow" aria-hidden>
        →
      </span>
      <div className="network-feature-step">
        <div className="network-feature-thumb is-grid">
          <Image
            src={src}
            alt=""
            fill
            className="object-cover grayscale contrast-125"
            sizes="72px"
            style={{ objectPosition: "50% 20%" }}
          />
        </div>
        <span>{featuresLabel}</span>
      </div>
      <span className="network-feature-arrow" aria-hidden>
        →
      </span>
      <div className="network-feature-nums">
        <p className="network-feature-nums-title">{numbersLabel}</p>
        <p>
          {earLabel} <strong>{ear}</strong>
        </p>
        <p>
          {snoutLabel} <strong>{snout}</strong>
        </p>
      </div>
    </div>
  );
}

export function ImpossibleSplit({ onContinue }: Props) {
  const t = useT();
  const [phase, setPhase] = useState<Phase>("a");
  const [angle, setAngle] = useState(90);
  const [offset, setOffset] = useState(-18);
  const [angle2, setAngle2] = useState(18);
  const [offset2, setOffset2] = useState(6);
  const [acceptedLimit, setAcceptedLimit] = useState(false);
  const [checked, setChecked] = useState(false);
  const [nudgeCount, setNudgeCount] = useState(0);

  const points = phase === "a" ? EASY : HARD;
  const result = useMemo(() => {
    if (phase === "c") return scoreXor(points, angle, offset, angle2, offset2);
    return scoreLine(points, angle, offset);
  }, [phase, points, angle, offset, angle2, offset2]);

  const l1 = lineEnds(angle, offset);
  const l2 = lineEnds(angle2, offset2);

  const nudge = (
    which: "angle" | "offset" | "angle2" | "offset2",
    delta: number,
  ) => {
    setChecked(false);
    setNudgeCount((n) => n + 1);
    if (which === "angle") setAngle((v) => (v + delta + 360) % 360);
    if (which === "offset")
      setOffset((v) => Math.max(-35, Math.min(35, v + delta)));
    if (which === "angle2") setAngle2((v) => (v + delta + 360) % 360);
    if (which === "offset2")
      setOffset2((v) => Math.max(-35, Math.min(35, v + delta)));
  };

  const controlClass = `network-btn-secondary${nudgeCount > 0 ? "" : " is-invite"}`;
  const canAdmitLimit = nudgeCount >= 2;

  const title =
    phase === "c"
      ? t("lesson5.impossibleSplit.titleC")
      : t("lesson5.impossibleSplit.titleA");
  const plaque =
    phase === "c"
      ? t("lesson5.impossibleSplit.plaqueC")
      : t("lesson5.impossibleSplit.plaque");

  return (
    <NetworkFrame>
      <NetworkTitle plaque={plaque}>{title}</NetworkTitle>
      {phase === "a" ? (
        <NetworkLine>{t("lesson5.impossibleSplit.subheadA")}</NetworkLine>
      ) : null}
      {phase === "b" ? (
        <>
          <NetworkLine>{t("lesson5.impossibleSplit.bodyB1")}</NetworkLine>
          <NetworkLine compact>
            {t("lesson5.impossibleSplit.bodyB2")}
          </NetworkLine>
        </>
      ) : null}
      {phase === "c" ? (
        <>
          <NetworkLine>{t("lesson5.impossibleSplit.bodyC1")}</NetworkLine>
          <NetworkLine compact>
            {t("lesson5.impossibleSplit.bodyC2")}
          </NetworkLine>
        </>
      ) : null}

      {phase === "a" ? (
        <div className="network-unit-board mt-6">
          <div className="network-unit-pipeline">
            <FeaturePipeline
              kind="cat"
              src={CAT_IMG}
              ear="0.8"
              snout="0.2"
              photoLabel={t("lesson5.impossibleSplit.photo")}
              featuresLabel={t("lesson5.impossibleSplit.findFeatures")}
              numbersLabel={t("lesson5.impossibleSplit.twoNumbers")}
              earLabel={t("lesson5.impossibleSplit.ear")}
              snoutLabel={t("lesson5.impossibleSplit.snout")}
            />
            <FeaturePipeline
              kind="dog"
              src={DOG_IMG}
              ear="0.1"
              snout="0.8"
              photoLabel={t("lesson5.impossibleSplit.photo")}
              featuresLabel={t("lesson5.impossibleSplit.findFeatures")}
              numbersLabel={t("lesson5.impossibleSplit.twoNumbers")}
              earLabel={t("lesson5.impossibleSplit.ear")}
              snoutLabel={t("lesson5.impossibleSplit.snout")}
            />
          </div>

          <div className="network-unit-plot-wrap">
            <svg
              viewBox="0 0 100 100"
              className="network-unit-plot"
              role="img"
              aria-label={t("lesson5.impossibleSplit.lineAria")}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  nudge("angle", -5);
                } else if (e.key === "ArrowRight") {
                  e.preventDefault();
                  nudge("angle", 5);
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  nudge("offset", -2);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  nudge("offset", 2);
                }
              }}
            >
              <text x="4" y="8" className="network-plot-axis">
                {t("lesson5.impossibleSplit.axisEar")}
              </text>
              <text x="62" y="96" className="network-plot-axis">
                {t("lesson5.impossibleSplit.axisSnout")}
              </text>
              <text x="2" y="18" className="network-plot-tick">
                {t("lesson5.impossibleSplit.high")}
              </text>
              <text x="2" y="92" className="network-plot-tick">
                {t("lesson5.impossibleSplit.low")}
              </text>
              <text x="12" y="98" className="network-plot-tick">
                {t("lesson5.impossibleSplit.short")}
              </text>
              <text x="78" y="98" className="network-plot-tick">
                {t("lesson5.impossibleSplit.long")}
              </text>
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={2.8}
                  className={
                    p.label === 0 ? "network-dot-red" : "network-dot-blue"
                  }
                />
              ))}
              <line
                x1={l1.x1}
                y1={l1.y1}
                x2={l1.x2}
                y2={l1.y2}
                className="network-split-line"
              />
            </svg>
          </div>

          <div className="network-unit-turn">
            <p className="network-eyebrow mb-2">
              {t("lesson5.impossibleSplit.yourTurn")}
            </p>
            <p className="network-unit-turn-ask">
              {t("lesson5.impossibleSplit.turnAsk")}
            </p>
            <div className="network-unit-controls">
              <button
                type="button"
                className={controlClass}
                onClick={() => nudge("angle", -8)}
              >
                {t("lesson5.impossibleSplit.rotateMinus")}
              </button>
              <button
                type="button"
                className={controlClass}
                onClick={() => nudge("angle", 8)}
              >
                {t("lesson5.impossibleSplit.rotatePlus")}
              </button>
              <button
                type="button"
                className={controlClass}
                onClick={() => nudge("offset", -3)}
              >
                {t("lesson5.impossibleSplit.shiftLeft")}
              </button>
              <button
                type="button"
                className={controlClass}
                onClick={() => nudge("offset", 3)}
              >
                {t("lesson5.impossibleSplit.shiftRight")}
              </button>
            </div>
            <p className="network-unit-tip">
              {t("lesson5.impossibleSplit.tip")}
            </p>
          </div>
        </div>
      ) : (
        <div className="network-split-stage mt-6">
          <div className="network-split-stage-plot">
            <svg
              viewBox="0 0 100 100"
              className="network-split-canvas"
              role="img"
              aria-label={t("lesson5.impossibleSplit.lineAria")}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  nudge("angle", -5);
                } else if (e.key === "ArrowRight") {
                  e.preventDefault();
                  nudge("angle", 5);
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  nudge("offset", -2);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  nudge("offset", 2);
                }
              }}
            >
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={3.2}
                  className={
                    p.label === 0 ? "network-dot-red" : "network-dot-blue"
                  }
                />
              ))}
              <line
                x1={l1.x1}
                y1={l1.y1}
                x2={l1.x2}
                y2={l1.y2}
                className="network-split-line"
              />
              {phase === "c" ? (
                <line
                  x1={l2.x1}
                  y1={l2.y1}
                  x2={l2.x2}
                  y2={l2.y2}
                  className="network-split-line network-split-line-2"
                />
              ) : null}
            </svg>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className={controlClass}
                onClick={() => nudge("angle", -8)}
              >
                {t("lesson5.impossibleSplit.rotateMinus")}
              </button>
              <button
                type="button"
                className={controlClass}
                onClick={() => nudge("angle", 8)}
              >
                {t("lesson5.impossibleSplit.rotatePlus")}
              </button>
              <button
                type="button"
                className={controlClass}
                onClick={() => nudge("offset", -3)}
              >
                {t("lesson5.impossibleSplit.shiftLeft")}
              </button>
              <button
                type="button"
                className={controlClass}
                onClick={() => nudge("offset", 3)}
              >
                {t("lesson5.impossibleSplit.shiftRight")}
              </button>
              {phase === "c" ? (
                <>
                  <button
                    type="button"
                    className={controlClass}
                    onClick={() => nudge("angle2", -8)}
                  >
                    Line 2 rotate −
                  </button>
                  <button
                    type="button"
                    className={controlClass}
                    onClick={() => nudge("angle2", 8)}
                  >
                    Line 2 rotate +
                  </button>
                </>
              ) : null}
            </div>
            <p
              className="mt-3 text-sm font-semibold"
              role="status"
              aria-live="polite"
            >
              <span
                className={
                  result.separated
                    ? "text-[var(--network-ok)]"
                    : "text-[var(--network-miss)]"
                }
              >
                {result.separated
                  ? t("lesson5.shared.separated")
                  : t("lesson5.shared.notSeparated")}
              </span>
              <span className="ml-2 font-normal text-[var(--network-dim)]">
                {t("lesson5.impossibleSplit.counts", {
                  redOk: result.redOk,
                  redTotal: result.redTotal,
                  blueOk: result.blueOk,
                  blueTotal: result.blueTotal,
                })}
              </span>
            </p>
          </div>

          <aside className="network-split-stage-copy">
            {phase === "b" && !acceptedLimit ? (
              <>
                <p className="network-eyebrow mb-2">
                  {t("lesson5.impossibleSplit.yourTurn")}
                </p>
                <p className="network-unit-turn-ask">
                  {t("lesson5.impossibleSplit.hardSideAsk")}
                </p>
                {canAdmitLimit ? (
                  <button
                    type="button"
                    className="network-btn-admit mt-4"
                    onClick={() => setAcceptedLimit(true)}
                  >
                    {t("lesson5.impossibleSplit.fallbackNo")}
                  </button>
                ) : (
                  <p className="mt-3 text-sm text-[var(--network-dim)]">
                    {t("lesson5.impossibleSplit.tryAdjusting")}
                  </p>
                )}
              </>
            ) : null}

            {phase === "b" && acceptedLimit ? (
              <>
                <p className="network-unit-turn-ask">
                  {t("lesson5.impossibleSplit.frustration")}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                  {t("lesson5.impossibleSplit.reveal1")}
                </p>
                <div className="network-split-stage-cta">
                  <NetworkContinue
                    label={t("lesson5.impossibleSplit.unlockSecond")}
                    onClick={() => {
                      setPhase("c");
                      setAngle(8);
                      setOffset(0);
                      setAngle2(72);
                      setOffset2(0);
                      setNudgeCount(0);
                    }}
                  />
                </div>
              </>
            ) : null}

            {phase === "c" && !result.separated ? (
              <>
                <p className="network-eyebrow mb-2">
                  {t("lesson5.impossibleSplit.sideCTitle")}
                </p>
                <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
                  {t("lesson5.impossibleSplit.sideCBody1")}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                  {t("lesson5.impossibleSplit.sideCBody2")}
                </p>
                <p className="mt-3 text-sm text-[var(--network-dim)]">
                  {t("lesson5.impossibleSplit.twoLineTip")}
                </p>
              </>
            ) : null}

            {phase === "c" && result.separated ? (
              <>
                <p className="network-eyebrow mb-2">
                  {t("lesson5.impossibleSplit.sideCTitle")}
                </p>
                <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
                  {t("lesson5.impossibleSplit.sideCBody1")}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                  {t("lesson5.impossibleSplit.sideCBody2")}
                </p>
                <p className="network-unit-turn-ask mt-4">
                  {t("lesson5.impossibleSplit.sideCFinal")}
                </p>
                <div className="network-split-stage-cta">
                  <NetworkContinue
                    label={t("lesson5.impossibleSplit.cta")}
                    onClick={onContinue}
                  />
                </div>
              </>
            ) : null}
          </aside>
        </div>
      )}

      {phase === "a" ? (
        <p
          className="mt-4 text-sm font-semibold"
          role="status"
          aria-live="polite"
        >
          <span
            className={
              result.separated
                ? "text-[var(--network-ok)]"
                : "text-[var(--network-miss)]"
            }
          >
            {result.separated
              ? t("lesson5.shared.separated")
              : t("lesson5.shared.notSeparated")}
          </span>
          <span className="ml-2 font-normal text-[var(--network-dim)]">
            {t("lesson5.impossibleSplit.counts", {
              redOk: result.redOk,
              redTotal: result.redTotal,
              blueOk: result.blueOk,
              blueTotal: result.blueTotal,
            })}
          </span>
        </p>
      ) : null}

      {phase === "a" ? (
        <div className="network-unit-footer mt-5">
          <p className="network-unit-footer-note">
            {checked && result.separated
              ? t("lesson5.impossibleSplit.solvedNote")
              : checked && !result.separated
                ? t("lesson5.impossibleSplit.notYetNote")
                : t("lesson5.impossibleSplit.footerHint")}
          </p>
          {checked && result.separated ? (
            <NetworkContinue
              label={t("lesson5.impossibleSplit.tryNext")}
              onClick={() => {
                setPhase("b");
                setAngle(25);
                setOffset(0);
                setAcceptedLimit(false);
                setChecked(false);
                setNudgeCount(0);
              }}
            />
          ) : (
            <button
              type="button"
              className="network-btn"
              onClick={() => setChecked(true)}
            >
              {t("lesson5.impossibleSplit.check")}
            </button>
          )}
        </div>
      ) : null}
    </NetworkFrame>
  );
}
