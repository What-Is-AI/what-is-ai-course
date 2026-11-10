"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useT } from "@/i18n/LocaleProvider";

/** Layered network: IMAGE → hidden layers → CAT, with signal pulses. */
export function NetworkFlowViz() {
  const t = useT();
  const reduceMotion = useReducedMotion();

  const layers = [
    { x: 18, nodes: [22, 40, 60, 78] },
    { x: 42, nodes: [14, 32, 50, 68, 86] },
    { x: 66, nodes: [34, 66] },
  ] as const;

  const edges: { x1: number; y1: number; x2: number; y2: number; d: number }[] =
    [];
  let delay = 0;
  for (let li = 0; li < layers.length - 1; li++) {
    const a = layers[li];
    const b = layers[li + 1];
    for (const y1 of a.nodes) {
      for (const y2 of b.nodes) {
        edges.push({ x1: a.x, y1, x2: b.x, y2, d: delay });
        delay += 0.035;
      }
    }
  }
  // input → first layer
  for (const y of layers[0].nodes) {
    edges.unshift({ x1: 4, y1: 50, x2: layers[0].x, y2: y, d: 0 });
  }
  // last → output
  for (const y of layers[2].nodes) {
    edges.push({ x1: layers[2].x, y1: y, x2: 92, y2: 50, d: delay });
    delay += 0.05;
  }

  return (
    <div
      className="network-flow-viz"
      role="img"
      aria-label={t("lesson5.arrive.visualAria")}
    >
      <svg viewBox="0 0 100 100" className="network-flow-svg" aria-hidden>
        {edges.map((e, i) => (
          <g key={i}>
            <line
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              className="network-flow-edge"
            />
            {!reduceMotion ? (
              <motion.circle
                r={0.9}
                className="network-flow-pulse"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  cx: [e.x1, e.x2],
                  cy: [e.y1, e.y2],
                }}
                transition={{
                  duration: 1.6,
                  delay: (e.d % 1.2) + (i % 7) * 0.08,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 0.4,
                }}
              />
            ) : null}
          </g>
        ))}

        {layers.map((layer, li) =>
          layer.nodes.map((y, ni) => (
            <motion.circle
              key={`${li}-${ni}`}
              cx={layer.x}
              cy={y}
              r={2.4}
              className="network-flow-unit"
              animate={
                reduceMotion
                  ? { opacity: 0.9 }
                  : { opacity: [0.4, 1, 0.5] }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 2.2,
                      delay: li * 0.25 + ni * 0.08,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            />
          )),
        )}

        <motion.circle
          cx={4}
          cy={50}
          r={3.2}
          className="network-flow-io"
          animate={
            reduceMotion ? undefined : { opacity: [0.65, 1, 0.65] }
          }
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        <motion.circle
          cx={92}
          cy={50}
          r={3.2}
          className="network-flow-io is-out"
          animate={
            reduceMotion ? undefined : { opacity: [0.65, 1, 0.65] }
          }
          transition={{ duration: 2.4, delay: 1.1, repeat: Infinity }}
        />
      </svg>

      <div className="network-flow-captions" aria-hidden>
        <span>{t("lesson5.arrive.image")}</span>
        <span className="is-out">{t("lesson5.arrive.cat")}</span>
      </div>
    </div>
  );
}
