"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
  NetworkContinue,
  NetworkFrame,
  NetworkTitle,
} from "@/components/lesson5/NetworkFrame";
import { useT } from "@/i18n/LocaleProvider";

type Props = { onContinue: () => void };

const TERM_IDS = [
  "input",
  "neuron",
  "weight",
  "activation",
  "layer",
  "output",
  "parameters",
] as const;

type TermId = (typeof TERM_IDS)[number];

const SIGMOID = "M 12 44 C 28 44, 36 44, 48 28 S 70 10, 88 10";

function TermPreview({
  id,
  reduceMotion,
}: {
  id: TermId;
  reduceMotion: boolean | null;
}) {
  const t = useT();

  return (
    <div
      className="network-vocab-preview"
      role="img"
      aria-label={t(`lesson5.vocabulary.previews.${id}`)}
    >
      {id === "input" ? (
        <svg viewBox="0 0 120 80" className="network-vocab-svg" aria-hidden>
          <rect
            x="8"
            y="22"
            width="28"
            height="36"
            rx="3"
            className="network-vocab-panel"
          />
          <text x="22" y="44" textAnchor="middle" className="network-vocab-mini">
            IMG
          </text>
          {!reduceMotion ? (
            <motion.circle
              r={2}
              className="network-anatomy-pulse"
              animate={{ cx: [40, 78], cy: [40, 40], opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}
          <line x1="40" y1="40" x2="78" y2="40" className="network-vocab-edge" />
          <circle cx="88" cy="40" r="8" className="network-vocab-node is-hot" />
        </svg>
      ) : null}

      {id === "neuron" ? (
        <svg viewBox="0 0 120 80" className="network-vocab-svg" aria-hidden>
          {[22, 40, 58].map((y, i) => (
            <g key={y}>
              <circle cx="16" cy={y} r="4" className="network-vocab-node" />
              <line
                x1="22"
                y1={y}
                x2="52"
                y2="40"
                className="network-vocab-edge"
              />
              {!reduceMotion ? (
                <motion.circle
                  r={1.3}
                  className="network-anatomy-pulse"
                  animate={{
                    cx: [22, 52],
                    cy: [y, 40],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 0.5,
                  }}
                />
              ) : null}
            </g>
          ))}
          <circle cx="62" cy="40" r="11" className="network-vocab-node is-hot" />
          <text x="62" y="44" textAnchor="middle" className="network-vocab-sigma">
            Σ
          </text>
          <line x1="74" y1="40" x2="96" y2="40" className="network-vocab-edge" />
          <circle cx="104" cy="40" r="5" className="network-vocab-node is-out" />
        </svg>
      ) : null}

      {id === "weight" ? (
        <svg viewBox="0 0 120 80" className="network-vocab-svg" aria-hidden>
          <circle cx="22" cy="40" r="7" className="network-vocab-node" />
          <motion.line
            x1="32"
            y1="40"
            x2="88"
            y2="40"
            className="network-vocab-edge is-weight"
            animate={
              reduceMotion
                ? undefined
                : { strokeWidth: [1.2, 4.2, 1.2] }
            }
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.text
            x="60"
            y="30"
            textAnchor="middle"
            className="network-vocab-weight"
            animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            +0.62
          </motion.text>
          <circle cx="98" cy="40" r="7" className="network-vocab-node is-hot" />
        </svg>
      ) : null}

      {id === "activation" ? (
        <svg viewBox="0 0 120 80" className="network-vocab-svg" aria-hidden>
          <line x1="14" y1="58" x2="106" y2="58" className="network-plot-guide" />
          <line x1="14" y1="58" x2="14" y2="12" className="network-plot-guide" />
          <line
            x1="18"
            y1="52"
            x2="100"
            y2="18"
            className="network-vocab-edge is-dim"
          />
          <motion.path
            d={SIGMOID}
            className="network-activation-curve"
            fill="none"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: "easeOut", repeat: Infinity, repeatDelay: 1.1 }}
          />
        </svg>
      ) : null}

      {id === "layer" ? (
        <svg viewBox="0 0 120 80" className="network-vocab-svg" aria-hidden>
          {(() => {
            const layers = [
              { x: 22, ys: [22, 40, 58] },
              { x: 60, ys: [16, 32, 48, 64] },
              { x: 98, ys: [28, 52] },
            ];
            return (
              <>
                {layers.slice(0, -1).map((layer, li) =>
                  layer.ys.flatMap((y1) =>
                    layers[li + 1].ys.map((y2) => (
                      <line
                        key={`${li}-${y1}-${y2}`}
                        x1={layer.x + 5}
                        y1={y1}
                        x2={layers[li + 1].x - 5}
                        y2={y2}
                        className="network-vocab-edge is-thin"
                      />
                    )),
                  ),
                )}
                {layers.map((layer, li) =>
                  layer.ys.map((y, ni) => (
                    <motion.circle
                      key={`${layer.x}-${y}`}
                      cx={layer.x}
                      cy={y}
                      r={4.2}
                      className="network-vocab-node is-hot"
                      animate={
                        reduceMotion
                          ? undefined
                          : { opacity: [0.35, 1, 0.35] }
                      }
                      transition={{
                        duration: 1.6,
                        delay: li * 0.35 + ni * 0.08,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )),
                )}
              </>
            );
          })()}
        </svg>
      ) : null}

      {id === "output" ? (
        <svg viewBox="0 0 120 80" className="network-vocab-svg" aria-hidden>
          <circle cx="28" cy="28" r="5" className="network-vocab-node" />
          <circle cx="28" cy="52" r="5" className="network-vocab-node" />
          <line x1="36" y1="28" x2="68" y2="40" className="network-vocab-edge" />
          <line x1="36" y1="52" x2="68" y2="40" className="network-vocab-edge" />
          {!reduceMotion ? (
            <motion.circle
              r={1.5}
              className="network-anatomy-pulse"
              animate={{ cx: [36, 68], cy: [40, 40], opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          ) : null}
          <motion.g
            animate={
              reduceMotion
                ? undefined
                : { opacity: [0.55, 1, 0.55], scale: [0.96, 1.04, 0.96] }
            }
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ transformOrigin: "92px 40px" }}
          >
            <circle cx="92" cy="40" r="14" className="network-vocab-node is-out" />
            <text
              x="92"
              y="44"
              textAnchor="middle"
              className="network-vocab-out-label"
            >
              CAT
            </text>
          </motion.g>
        </svg>
      ) : null}

      {id === "parameters" ? (
        <svg viewBox="0 0 120 80" className="network-vocab-svg" aria-hidden>
          {[
            { x: 18, y: 24, d: "+0.02" },
            { x: 48, y: 18, d: "−0.01" },
            { x: 78, y: 26, d: "+0.03" },
            { x: 28, y: 52, d: "−0.02" },
            { x: 58, y: 48, d: "+0.01" },
            { x: 88, y: 54, d: "−0.01" },
          ].map((p, i) => (
            <motion.g
              key={p.x + p.y}
              animate={
                reduceMotion
                  ? undefined
                  : { opacity: [0.35, 1, 0.35], y: [0, -1.5, 0] }
              }
              transition={{
                duration: 1.4,
                delay: i * 0.12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r="3.2"
                className="network-vocab-node is-hot"
              />
              <text
                x={p.x}
                y={p.y + 12}
                textAnchor="middle"
                className="network-vocab-delta"
              >
                {p.d}
              </text>
            </motion.g>
          ))}
        </svg>
      ) : null}
    </div>
  );
}

export function Vocabulary({ onContinue }: Props) {
  const t = useT();
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<TermId>("input");

  return (
    <NetworkFrame className="network-vocab">
      <NetworkTitle plaque={t("lesson5.vocabulary.plaque")} compact>
        {t("lesson5.vocabulary.title")}
      </NetworkTitle>
      <p className="network-vocab-hint">{t("lesson5.vocabulary.hint")}</p>

      <div className="network-vocab-layout">
        <aside className="network-vocab-stage" aria-live="polite">
          <p className="network-vocab-stage-label">
            {t(`lesson5.vocabulary.terms.${active}.label`)}
          </p>
          <TermPreview id={active} reduceMotion={reduceMotion} />
          <p className="network-vocab-stage-body">
            {t(`lesson5.vocabulary.terms.${active}.body`)}
          </p>
        </aside>

        <div
          className="network-vocab-list"
          role="listbox"
          aria-label={t("lesson5.vocabulary.listAria")}
        >
          {TERM_IDS.map((id) => {
            const selected = id === active;
            return (
              <button
                key={id}
                type="button"
                role="option"
                aria-selected={selected}
                className={`network-vocab-tab${selected ? " is-active" : ""}`}
                onMouseEnter={() => setActive(id)}
                onFocus={() => setActive(id)}
                onClick={() => setActive(id)}
              >
                <span className="network-vocab-tab-label">
                  {t(`lesson5.vocabulary.terms.${id}.label`)}
                </span>
                <span className="network-vocab-tab-body">
                  {t(`lesson5.vocabulary.terms.${id}.body`)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <NetworkContinue
        label={t("lesson5.vocabulary.cta")}
        onClick={onContinue}
        className="network-vocab-cta"
      />
    </NetworkFrame>
  );
}
