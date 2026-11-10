"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  NetworkContinue,
  NetworkFrame,
  NetworkLine,
  NetworkTitle,
} from "@/components/lesson5/NetworkFrame";
import { useT } from "@/i18n/LocaleProvider";

type Props = { onContinue: () => void };

const FLOW_IDS = [
  "inputs",
  "weights",
  "combined",
  "activation",
  "output",
] as const;

const INPUTS = [
  { x: 8, y: 18, w: "+0.6", xv: "x₁" },
  { x: 8, y: 40, w: "−0.2", xv: "x₂" },
  { x: 8, y: 62, w: "+0.4", xv: "x₃" },
] as const;

/** Sigmoid schematic: stays above the x-axis (y≤48), lower→upper asymptote. */
const SIGMOID =
  "M 14 44 C 34 44, 44 44, 58 28 S 82 10, 106 10";

/** Pulse waypoints along SIGMOID (SVG viewBox coords — not CSS offset-path). */
const SIGMOID_PULSE = {
  cx: [14, 34, 48, 58, 72, 90, 106],
  cy: [44, 44, 40, 28, 16, 11, 10],
} as const;

function UnitAnatomy({ reduceMotion }: { reduceMotion: boolean | null }) {
  const t = useT();
  return (
    <div
      className="network-unit-anatomy"
      role="img"
      aria-label={t("lesson5.oneUnit.anatomyAria")}
    >
      <svg viewBox="0 0 200 80" className="network-unit-anatomy-svg" aria-hidden>
        {INPUTS.map((inp, i) => (
          <g key={inp.xv}>
            <text x={inp.x} y={inp.y + 1} className="network-anatomy-label">
              {inp.xv}
            </text>
            <line
              x1={18}
              y1={inp.y}
              x2={72}
              y2={40}
              className="network-anatomy-edge"
            />
            <text
              x={38}
              y={inp.y < 40 ? inp.y - 2 : inp.y + 8}
              className="network-anatomy-weight"
            >
              {inp.w}
            </text>
            {!reduceMotion ? (
              <motion.circle
                r={1.4}
                className="network-anatomy-pulse"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  cx: [18, 72],
                  cy: [inp.y, 40],
                }}
                transition={{
                  duration: 1.8,
                  delay: i * 0.25,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 0.6,
                }}
              />
            ) : null}
          </g>
        ))}

        <motion.circle
          cx={78}
          cy={40}
          r={8}
          className="network-anatomy-node"
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.7, 1, 0.7] }
          }
          transition={{ duration: 2.2, repeat: Infinity }}
        />
        <text x={78} y={41.5} textAnchor="middle" className="network-anatomy-node-text">
          Σ
        </text>
        <text x={78} y={56} textAnchor="middle" className="network-anatomy-caption">
          {t("lesson5.oneUnit.anatomySum")}
        </text>

        <line x1={86} y1={40} x2={118} y2={40} className="network-anatomy-edge" />
        {!reduceMotion ? (
          <motion.circle
            r={1.4}
            className="network-anatomy-pulse"
            animate={{ opacity: [0, 1, 0], cx: [86, 118], cy: [40, 40] }}
            transition={{
              duration: 1.4,
              delay: 0.9,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.8,
            }}
          />
        ) : null}

        <rect
          x={118}
          y={28}
          width={28}
          height={24}
          rx={4}
          className="network-anatomy-act"
        />
        <path d="M122 44 C128 44, 130 44, 134 36 S142 30, 144 30" className="network-anatomy-mini-curve" />
        <text x={132} y={62} textAnchor="middle" className="network-anatomy-caption">
          {t("lesson5.oneUnit.anatomyAct")}
        </text>

        <line x1={146} y1={40} x2={172} y2={40} className="network-anatomy-edge" />
        {!reduceMotion ? (
          <motion.circle
            r={1.4}
            className="network-anatomy-pulse"
            animate={{ opacity: [0, 1, 0], cx: [146, 172], cy: [40, 40] }}
            transition={{
              duration: 1.2,
              delay: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1,
            }}
          />
        ) : null}

        <motion.circle
          cx={180}
          cy={40}
          r={6}
          className="network-anatomy-out"
          animate={
            reduceMotion ? undefined : { opacity: [0.65, 1, 0.65] }
          }
          transition={{ duration: 2.2, delay: 1.6, repeat: Infinity }}
        />
        <text x={180} y={56} textAnchor="middle" className="network-anatomy-caption">
          {t("lesson5.oneUnit.anatomyOut")}
        </text>
      </svg>
      <div className="network-anatomy-eqs" aria-hidden>
        <code>{t("lesson5.oneUnit.anatomyEq")}</code>
        <code>{t("lesson5.oneUnit.anatomyEq2")}</code>
      </div>
    </div>
  );
}

function ActivationCompare({ reduceMotion }: { reduceMotion: boolean | null }) {
  const t = useT();
  return (
    <div className="network-activation-compare">
      <div className="network-activation-card">
        <p className="network-eyebrow mb-2">
          {t("lesson5.oneUnit.beforeLabel")}
        </p>
        <p className="network-activation-flow">
          {t("lesson5.oneUnit.beforeFlow")}
        </p>
        <svg
          viewBox="0 0 120 56"
          className="network-activation-spark"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <line x1="10" y1="48" x2="110" y2="48" className="network-plot-guide" />
          <line x1="10" y1="48" x2="10" y2="8" className="network-plot-guide" />
          <motion.line
            x1="14"
            y1="44"
            x2="106"
            y2="12"
            className="network-activation-line"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
          {!reduceMotion ? (
            <motion.circle
              r={2}
              className="network-anatomy-pulse"
              animate={{ cx: [14, 106], cy: [44, 12], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            />
          ) : null}
        </svg>
      </div>
      <div className="network-activation-card is-active">
        <p className="network-eyebrow mb-2">
          {t("lesson5.oneUnit.afterLabel")}
        </p>
        <p className="network-activation-flow">
          {t("lesson5.oneUnit.afterFlow")}
        </p>
        <svg
          viewBox="0 0 120 56"
          className="network-activation-spark"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <line x1="10" y1="48" x2="110" y2="48" className="network-plot-guide" />
          <line x1="10" y1="48" x2="10" y2="8" className="network-plot-guide" />
          <motion.path
            d={SIGMOID}
            className="network-activation-curve"
            fill="none"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.25, ease: "easeOut", delay: 0.15 }}
          />
          {!reduceMotion ? (
            <motion.circle
              r={2}
              className="network-anatomy-pulse"
              animate={{
                cx: [...SIGMOID_PULSE.cx],
                cy: [...SIGMOID_PULSE.cy],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}
        </svg>
      </div>
    </div>
  );
}

export function OneUnit({ onContinue }: Props) {
  const t = useT();
  const reduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setActiveStep((s) => (s + 1) % FLOW_IDS.length);
    }, 900);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <NetworkFrame className="network-one-unit">
      <NetworkTitle plaque={t("lesson5.oneUnit.plaque")}>
        {t("lesson5.oneUnit.title")}
      </NetworkTitle>
      <NetworkLine>{t("lesson5.oneUnit.body1")}</NetworkLine>
      <NetworkLine compact>{t("lesson5.oneUnit.body2")}</NetworkLine>

      <div
        className="network-unit-flow mt-6"
        role="img"
        aria-label={t("lesson5.oneUnit.flowAria")}
      >
        {FLOW_IDS.map((id, i) => (
          <div key={id} className="network-unit-flow-item">
            {i > 0 ? (
              <span className="network-unit-flow-arrow" aria-hidden>
                →
              </span>
            ) : null}
            <motion.span
              className={`network-unit-flow-chip${
                activeStep === i ? " is-live" : ""
              }`}
              animate={
                reduceMotion
                  ? undefined
                  : activeStep === i
                    ? { scale: 1.04, opacity: 1 }
                    : { scale: 1, opacity: 0.55 }
              }
              transition={{ duration: 0.25 }}
            >
              {t(`lesson5.oneUnit.flow.${id}`)}
            </motion.span>
          </div>
        ))}
      </div>

      <div className="network-one-unit-grid mt-6">
        <div className="network-one-unit-viz">
          <UnitAnatomy reduceMotion={reduceMotion} />
        </div>
        <aside className="network-one-unit-side">
          <p className="network-one-unit-side-lead">
            {t("lesson5.oneUnit.buildingBlock")}
          </p>
          <p className="network-support mt-3">
            {t("lesson5.oneUnit.terms")}
          </p>
        </aside>
      </div>

      <div className="network-one-unit-grid network-one-unit-grid-bottom mt-6">
        <div className="network-one-unit-viz">
          <ActivationCompare reduceMotion={reduceMotion} />
        </div>
        <aside className="network-one-unit-side network-one-unit-side-cta">
          <p className="network-support">
            {t("lesson5.oneUnit.activationCaption")}
          </p>
          <NetworkContinue
            label={t("lesson5.oneUnit.cta")}
            onClick={onContinue}
            className="network-one-unit-cta"
          />
        </aside>
      </div>
    </NetworkFrame>
  );
}
