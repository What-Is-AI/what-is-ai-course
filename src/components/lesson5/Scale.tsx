"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  NetworkContinue,
  NetworkFrame,
  NetworkTitle,
} from "@/components/lesson5/NetworkFrame";
import { useT } from "@/i18n/LocaleProvider";

type Props = { onContinue: () => void };

const LEVELS = ["10", "100", "10000", "1000000", "billion"] as const;

/** Approximate log10 marker positions for an academic scale ruler. */
const LOG_MARKS = [
  { id: "10", log: 1 },
  { id: "100", log: 2 },
  { id: "10000", log: 4 },
  { id: "1000000", log: 6 },
  { id: "billion", log: 9 },
] as const;

function densityFor(idx: number) {
  // Node counts grow, but we cap drawn nodes for performance.
  return [10, 24, 48, 72, 110][idx] ?? 110;
}

function layerWidths(idx: number) {
  if (idx === 0) return [3, 4, 2];
  if (idx === 1) return [4, 6, 4, 2];
  if (idx === 2) return [5, 8, 8, 5, 3];
  if (idx === 3) return [6, 10, 12, 10, 6, 3];
  return [8, 14, 16, 16, 14, 8, 4];
}

function buildGraph(idx: number) {
  const widths = layerWidths(idx);
  const nodes: { x: number; y: number; r: number }[] = [];
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const padX = 10;
  const usable = 100 - padX * 2;
  const layerGap = usable / Math.max(1, widths.length - 1);

  widths.forEach((count, li) => {
    const x = padX + li * layerGap;
    for (let ni = 0; ni < count; ni++) {
      const t = count === 1 ? 0.5 : ni / (count - 1);
      const y = 12 + t * 76;
      const r = idx >= 3 ? 1.1 : idx >= 2 ? 1.45 : 2.1;
      nodes.push({ x, y, r });
    }
  });

  // Sparse edges between adjacent layers (sampled for clarity at high scale)
  let offset = 0;
  for (let li = 0; li < widths.length - 1; li++) {
    const leftStart = offset;
    const leftCount = widths[li];
    const rightStart = offset + leftCount;
    const rightCount = widths[li + 1];
    const step = idx >= 3 ? 2 : 1;
    for (let i = 0; i < leftCount; i += step) {
      for (let j = 0; j < rightCount; j += step + (idx >= 4 ? 1 : 0)) {
        if ((i + j) % (idx >= 2 ? 2 : 1) !== 0 && idx >= 2) continue;
        const a = nodes[leftStart + i];
        const b = nodes[rightStart + j];
        edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
      }
    }
    offset += leftCount;
  }

  return { nodes, edges };
}

export function Scale({ onContinue }: Props) {
  const t = useT();
  const reduceMotion = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const atEnd = idx >= LEVELS.length - 1;
  const level = LEVELS[idx];
  const graph = useMemo(() => buildGraph(idx), [idx]);
  const dots = densityFor(idx);

  const logMin = 1;
  const logMax = 9;
  const markerY = (log: number) =>
    8 + ((logMax - log) / (logMax - logMin)) * 84;

  return (
    <NetworkFrame className="network-scale">
      <NetworkTitle plaque={t("lesson5.scale.plaque")} compact>
        {t("lesson5.scale.title")}
      </NetworkTitle>

      <div className="network-scale-layout">
        <div className="network-scale-viz">
          <div className="network-scale-stage">
            <svg
              viewBox="0 0 140 100"
              className="network-scale-svg"
              role="img"
              aria-live="polite"
              aria-label={t(`lesson5.scale.levels.${level}`)}
            >
              {/* Log-scale ruler (academic parameter axis) */}
              <line
                x1="8"
                y1="8"
                x2="8"
                y2="92"
                className="network-scale-axis"
              />
              {LOG_MARKS.map((m, i) => {
                const y = markerY(m.log);
                const active = i === idx;
                const passed = i < idx;
                const exp =
                  m.log === 1
                    ? "¹"
                    : m.log === 2
                      ? "²"
                      : m.log === 4
                        ? "⁴"
                        : m.log === 6
                          ? "⁶"
                          : "⁹⁺";
                return (
                  <g key={m.id}>
                    <line
                      x1="6"
                      y1={y}
                      x2="10"
                      y2={y}
                      className={`network-scale-tick${
                        active ? " is-active" : passed ? " is-passed" : ""
                      }`}
                    />
                    <text
                      x="14"
                      y={y + 1.4}
                      className={`network-scale-tick-label${
                        active ? " is-active" : passed ? " is-passed" : ""
                      }`}
                    >
                      {`10${exp}`}
                    </text>
                  </g>
                );
              })}

              {/* Network density field */}
              <g transform="translate(28 0)">
                {graph.edges.map((e, i) => (
                  <line
                    key={`e-${i}`}
                    x1={e.x1}
                    y1={e.y1}
                    x2={e.x2}
                    y2={e.y2}
                    className="network-scale-edge"
                    opacity={idx >= 3 ? 0.18 : idx >= 2 ? 0.28 : 0.4}
                  />
                ))}
                <AnimatePresence mode="sync">
                  {graph.nodes.map((n, i) => (
                    <motion.circle
                      key={`${idx}-${i}`}
                      cx={n.x}
                      cy={n.y}
                      r={n.r}
                      className="network-scale-node"
                      initial={
                        reduceMotion ? false : { opacity: 0, scale: 0.6 }
                      }
                      animate={{ opacity: idx >= 4 ? 0.55 : 0.9, scale: 1 }}
                      exit={reduceMotion ? undefined : { opacity: 0 }}
                      transition={{ duration: 0.35, delay: (i % 12) * 0.01 }}
                    />
                  ))}
                </AnimatePresence>
              </g>
            </svg>

            <div className="network-scale-readout">
              <AnimatePresence mode="wait">
                <motion.p
                  key={level}
                  className="network-scale-number"
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  aria-live="polite"
                >
                  {t(`lesson5.scale.levels.${level}`)}
                </motion.p>
              </AnimatePresence>
              <div className="network-scale-dots" aria-hidden>
                {Array.from({ length: dots }, (_, i) => (
                  <span
                    key={`${level}-${i}`}
                    className="network-scale-dot"
                    style={{
                      opacity: 0.35 + (i % 5) * 0.12,
                      transform: `scale(${idx >= 3 ? 0.7 : 1})`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <ol className="network-scale-ladder" aria-hidden>
            {LEVELS.map((id, i) => (
              <li
                key={id}
                className={`network-scale-ladder-item${
                  i === idx ? " is-active" : i < idx ? " is-passed" : ""
                }`}
              >
                {t(`lesson5.scale.levels.${id}`)}
              </li>
            ))}
          </ol>
        </div>

        <aside className="network-scale-side">
          {atEnd ? (
            <>
              <p className="network-scale-body">{t("lesson5.scale.body")}</p>
              <NetworkContinue
                label={t("lesson5.scale.cta")}
                onClick={onContinue}
                className="network-scale-cta"
              />
            </>
          ) : (
            <NetworkContinue
              label={t("lesson5.scale.ctaZoom")}
              onClick={() => setIdx((v) => v + 1)}
              className="network-scale-cta network-scale-zoom is-invite"
            />
          )}
        </aside>
      </div>
    </NetworkFrame>
  );
}
