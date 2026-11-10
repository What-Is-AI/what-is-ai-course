"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  NetworkContinue,
  NetworkFrame,
  NetworkTitle,
} from "@/components/lesson5/NetworkFrame";
import { useT } from "@/i18n/LocaleProvider";

type Props = { onContinue: () => void };

const ACC_FROM = 41;
const ACC_TO = 68;
const TOTAL = 1000;

const NODES = [
  { id: "i0", x: 18, y: 22 },
  { id: "i1", x: 18, y: 50 },
  { id: "i2", x: 18, y: 78 },
  { id: "h0", x: 55, y: 28 },
  { id: "h1", x: 55, y: 50 },
  { id: "h2", x: 55, y: 72 },
  { id: "o0", x: 90, y: 40 },
  { id: "o1", x: 90, y: 62 },
] as const;

const EDGES: { a: (typeof NODES)[number]["id"]; b: (typeof NODES)[number]["id"] }[] =
  [
    { a: "i0", b: "h0" },
    { a: "i0", b: "h1" },
    { a: "i1", b: "h0" },
    { a: "i1", b: "h1" },
    { a: "i1", b: "h2" },
    { a: "i2", b: "h1" },
    { a: "i2", b: "h2" },
    { a: "h0", b: "o0" },
    { a: "h1", b: "o0" },
    { a: "h1", b: "o1" },
    { a: "h2", b: "o1" },
  ];

function node(id: string) {
  return NODES.find((n) => n.id === id)!;
}

function curvePoints(ticks: number) {
  const steps = Math.max(2, Math.floor(ticks / 20));
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / Math.max(1, steps);
    const examples = t * Math.min(ticks, TOTAL);
    const progress = examples / TOTAL;
    // Ease then slight plateau — typical training curve shape
    const eased = 1 - Math.pow(1 - progress, 1.55);
    const acc = ACC_FROM + eased * (ACC_TO - ACC_FROM);
    const x = 12 + (examples / TOTAL) * 96;
    const y = 58 - ((acc - ACC_FROM) / (ACC_TO - ACC_FROM)) * 42;
    pts.push({ x, y });
  }
  return pts;
}

export function WatchLearning({ onContinue }: Props) {
  const t = useT();
  const reduceMotion = useReducedMotion();
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [accuracy, setAccuracy] = useState(ACC_FROM);
  const [ticks, setTicks] = useState(0);
  const [phase, setPhase] = useState(0);

  const phases = useMemo(
    () =>
      t("lesson5.watchLearning.loop")
        .split("→")
        .map((s) => s.trim())
        .filter(Boolean),
    [t],
  );

  useEffect(() => {
    if (!running || paused) return;
    if (reduceMotion) {
      setAccuracy(ACC_TO);
      setTicks(TOTAL);
      setRunning(false);
      setPhase(phases.length - 1);
      return;
    }
    const id = window.setInterval(() => {
      setPhase((p) => (p + 1) % Math.max(1, phases.length));
      setTicks((n) => {
        const next = n + 40;
        if (next >= TOTAL) {
          setRunning(false);
          setAccuracy(ACC_TO);
          return TOTAL;
        }
        const progress = next / TOTAL;
        const eased = 1 - Math.pow(1 - progress, 1.55);
        setAccuracy(ACC_FROM + Math.round(eased * (ACC_TO - ACC_FROM)));
        return next;
      });
    }, 80);
    return () => window.clearInterval(id);
  }, [running, paused, reduceMotion, phases.length]);

  const done = ticks >= TOTAL || (!running && accuracy >= ACC_TO && ticks > 0);
  const active = running && !paused;
  const pts = curvePoints(Math.max(ticks, done ? TOTAL : ticks));
  const pathD = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const tip = pts[pts.length - 1];

  const startTrain = () => {
    setRunning(true);
    setPaused(false);
    setTicks(0);
    setAccuracy(ACC_FROM);
    setPhase(0);
  };

  return (
    <NetworkFrame className="network-watch">
      <NetworkTitle plaque={t("lesson5.watchLearning.plaque")} compact>
        {t("lesson5.watchLearning.title")}
      </NetworkTitle>

      <div className="network-watch-layout">
        <aside className="network-watch-copy">
          <ol className="network-watch-points">
            <li>{t("lesson5.watchLearning.body1")}</li>
            <li>{t("lesson5.watchLearning.body2")}</li>
            <li>{t("lesson5.watchLearning.body3")}</li>
            <li>{t("lesson5.watchLearning.body4")}</li>
          </ol>
          <p className="network-watch-punchline">
            {t("lesson5.watchLearning.punchline")}
          </p>
          {done ? (
            <NetworkContinue
              label={t("lesson5.watchLearning.cta")}
              onClick={onContinue}
              className="network-watch-cta"
            />
          ) : null}
        </aside>

        <div className="network-watch-viz">
          <div className="network-watch-phases" aria-hidden={!active}>
            {phases.map((label, i) => (
              <span
                key={label}
                className={`network-watch-phase${
                  active && phase === i ? " is-live" : ""
                }${done ? " is-done" : ""}`}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="network-watch-panels">
            <figure className="network-watch-chart">
              <figcaption className="network-watch-chart-cap">
                {t("lesson5.watchLearning.summary", {
                  from: ACC_FROM,
                  to: accuracy,
                })}
              </figcaption>
              <svg
                viewBox="0 0 120 70"
                className="network-watch-chart-svg"
                role="img"
                aria-label={t("lesson5.watchLearning.summary", {
                  from: ACC_FROM,
                  to: accuracy,
                })}
              >
                {[18, 32, 46, 58].map((y) => (
                  <line
                    key={y}
                    x1="12"
                    y1={y}
                    x2="108"
                    y2={y}
                    className="network-watch-grid"
                  />
                ))}
                <line x1="12" y1="58" x2="108" y2="58" className="network-watch-axis" />
                <line x1="12" y1="14" x2="12" y2="58" className="network-watch-axis" />
                <text x="4" y="18" className="network-watch-tick">
                  {ACC_TO}
                </text>
                <text x="4" y="58" className="network-watch-tick">
                  {ACC_FROM}
                </text>
                {ticks > 0 || done ? (
                  <>
                    <path d={pathD} className="network-watch-curve" fill="none" />
                    <circle
                      cx={tip.x}
                      cy={tip.y}
                      r={2.2}
                      className="network-watch-curve-tip"
                    />
                  </>
                ) : (
                  <circle
                    cx="12"
                    cy="58"
                    r={2}
                    className="network-watch-curve-tip is-idle"
                  />
                )}
              </svg>
            </figure>

            <figure className="network-watch-net">
              <svg
                viewBox="0 0 110 100"
                className="network-watch-net-svg"
                aria-hidden
              >
                {EDGES.map((e, i) => {
                  const a = node(e.a);
                  const b = node(e.b);
                  const w =
                    0.7 +
                    ((Math.sin(ticks / 90 + i) + 1) / 2) *
                      (active || done ? 2.4 : 0.8);
                  return (
                    <g key={`${e.a}-${e.b}`}>
                      <line
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        className="network-watch-edge"
                        strokeWidth={w}
                      />
                      {active && !reduceMotion && phase % 2 === 0 ? (
                        <motion.circle
                          r={1.2}
                          className="network-watch-pulse is-forward"
                          animate={{
                            cx: [a.x, b.x],
                            cy: [a.y, b.y],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 0.9,
                            delay: (i % 5) * 0.06,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      ) : null}
                      {active && !reduceMotion && phase % 2 === 1 ? (
                        <motion.circle
                          r={1.2}
                          className="network-watch-pulse is-back"
                          animate={{
                            cx: [b.x, a.x],
                            cy: [b.y, a.y],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 0.9,
                            delay: (i % 5) * 0.06,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      ) : null}
                    </g>
                  );
                })}
                {NODES.map((n) => (
                  <circle
                    key={n.id}
                    cx={n.x}
                    cy={n.y}
                    r={n.id.startsWith("o") ? 5.2 : 4.4}
                    className={`network-watch-node${
                      n.id.startsWith("o") ? " is-out" : ""
                    }${active ? " is-live" : ""}`}
                  />
                ))}
                {(active || done) && !reduceMotion
                  ? EDGES.slice(0, 4).map((e, i) => {
                      const a = node(e.a);
                      const b = node(e.b);
                      const mx = (a.x + b.x) / 2;
                      const my = (a.y + b.y) / 2 - 3;
                      const sign = i % 2 === 0 ? "+" : "−";
                      const val = (0.01 + (i % 3) * 0.01).toFixed(2);
                      return (
                        <motion.text
                          key={`d-${i}`}
                          x={mx}
                          y={my}
                          textAnchor="middle"
                          className="network-watch-delta"
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{
                            duration: 1.2,
                            delay: i * 0.15,
                            repeat: Infinity,
                          }}
                        >
                          {sign}
                          {val}
                        </motion.text>
                      );
                    })
                  : null}
              </svg>
            </figure>
          </div>

          <div className="network-watch-controls">
            {!running && !done ? (
              <button
                type="button"
                className="network-btn network-watch-train is-invite"
                onClick={startTrain}
              >
                {t("lesson5.watchLearning.train")}
              </button>
            ) : null}
            {running ? (
              <button
                type="button"
                className="network-btn-secondary"
                onClick={() => setPaused((p) => !p)}
              >
                {paused
                  ? t("lesson5.watchLearning.resume")
                  : t("lesson5.watchLearning.pause")}
              </button>
            ) : null}
            {done && !running ? (
              <p className="network-watch-done-note" aria-live="polite">
                {t("lesson5.watchLearning.summary", {
                  from: ACC_FROM,
                  to: ACC_TO,
                })}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </NetworkFrame>
  );
}
