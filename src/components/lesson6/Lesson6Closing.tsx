"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ClefTreble } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { DepthFrame } from "@/components/lesson6/DepthFrame";
import {
  useLesson6Chrome,
  useLesson6StepCopy,
} from "@/lib/useLesson6Copy";

type Props = {
  onGate: () => void;
  reducedMotion: boolean;
};

const FEATURES = [
  { id: "edges", color: "#657C84", line: 3 },
  { id: "shape", color: "#737B60", line: 2 },
  { id: "pattern", color: "#B36A4C", line: 1 },
] as const;

/**
 * L6 → L7 handoff: script copy + Features → Representation exhibit.
 * Notes land on a staff and inspire each feature row to appear.
 */
export function Lesson6Closing({ onGate, reducedMotion }: Props) {
  const steps = useLesson6StepCopy();
  const copy = steps.closing;
  const preferReduce = useReducedMotion() ?? reducedMotion;

  useEffect(() => {
    if (preferReduce) {
      onGate();
      return;
    }
    const t = window.setTimeout(() => onGate(), 3400);
    return () => window.clearTimeout(t);
  }, [onGate, preferReduce]);

  return (
    <DepthFrame className="depth-closing-frame relative">
      <div className="depth-closing">
        <div className="depth-closing-copy">
          <p className="depth-closing-kicker">{copy.plaque}</p>
          <h2 className="depth-closing-mystery-title">
            {copy.title}
            <span className="depth-closing-mystery-accent">{copy.question}</span>
          </h2>

          <div className="depth-closing-cta">
            <div className="depth-closing-cta-primary">
              <p className="depth-eyebrow">{copy.nextWorld}</p>
              <Link
                href="/lessons/7"
                className="depth-btn depth-closing-next-btn"
                aria-label={copy.nextLabel}
              >
                <span className="depth-closing-next-label">
                  {copy.nextLabel}
                </span>
              </Link>
              <p className="depth-closing-hint">{copy.hint}</p>
            </div>
            <Link
              href="/"
              className="depth-btn-secondary inline-flex depth-closing-home"
            >
              {copy.home}
            </Link>
          </div>
        </div>

        <FeaturesToRepresentation reduce={preferReduce} />
      </div>
    </DepthFrame>
  );
}

function FeaturesToRepresentation({ reduce }: { reduce: boolean }) {
  const chrome = useLesson6Chrome();
  const ui = chrome.closing ?? {};
  const linePct = [18, 34, 50, 66, 82];
  // Soft settle — less snappy than the default expo ease
  const ease = [0.33, 1, 0.32, 1] as const;
  const landEase = [0.22, 0.9, 0.28, 1] as const;

  return (
    <motion.figure
      aria-hidden
      className={`depth-closing-hint-viz${reduce ? " is-static" : ""}`}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.7, ease }}
    >
      {/* Staff: notes land and inspire the feature rows below */}
      <div className="depth-n2f">
        <ClefTreble
          className="depth-n2f-clef"
          absoluteStrokeWidth
          strokeWidth={1.35}
          aria-hidden
        />
        <svg
          className="depth-n2f-svg"
          viewBox="0 0 280 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {linePct.map((y, i) => (
            <motion.line
              key={y}
              x1="48"
              y1={y}
              x2="272"
              y2={y}
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ delay: 0.12 + i * 0.1, duration: 0.9, ease }}
            />
          ))}
        </svg>
        <ol className="depth-n2f-beats">
          {FEATURES.map((f, i) => {
            const landDelay = reduce ? 0 : 0.85 + i * 0.42;
            return (
              <li
                key={f.id}
                className="depth-n2f-beat"
                style={{
                  left: `${34 + i * 18}%`,
                  top: `${linePct[f.line]}%`,
                  ["--beat" as string]: f.color,
                }}
              >
                <motion.span
                  className="depth-n2f-note"
                  initial={
                    reduce ? false : { opacity: 0, y: -14, scale: 0.82 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: landDelay,
                    duration: 0.65,
                    ease: landEase,
                  }}
                />
                <motion.span
                  className="depth-n2f-inspire"
                  initial={reduce ? false : { opacity: 0, scaleY: 0.25 }}
                  animate={
                    reduce
                      ? { opacity: 0, scaleY: 1 }
                      : { opacity: [0, 0.55, 0.35, 0], scaleY: [0.25, 1, 1, 1] }
                  }
                  transition={{
                    delay: landDelay + 0.28,
                    duration: 0.85,
                    times: [0, 0.35, 0.7, 1],
                    ease,
                  }}
                />
              </li>
            );
          })}
        </ol>
      </div>

      {/* Original Features → Representation exhibit */}
      <div className="depth-f2r">
        <div className="depth-f2r-col">
          <motion.p
            className="depth-f2r-label"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 0.55, duration: 0.5, ease }}
          >
            {ui.features}
          </motion.p>
          <ul className="depth-f2r-features">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f.id}
                className="depth-f2r-feature"
                style={{ ["--feat" as string]: f.color }}
                initial={reduce ? false : { opacity: 0, y: 6, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: reduce ? 0 : 1.15 + i * 0.42,
                  duration: 0.55,
                  ease,
                }}
              >
                <span className="depth-f2r-tick" />
                {ui[f.id]}
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          className="depth-f2r-bridge"
          initial={reduce ? false : { opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: reduce ? 0 : 2.45, duration: 0.55, ease }}
        >
          <span className="depth-f2r-bridge-mark">→</span>
        </motion.div>

        <div className="depth-f2r-col">
          <motion.p
            className="depth-f2r-label"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 2.55, duration: 0.45, ease }}
          >
            {ui.representation}
          </motion.p>
          <motion.div
            className="depth-f2r-repr"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 2.6, duration: 0.4, ease }}
          >
            {(
              [
                { h: "72%", c: "#657C84" },
                { h: "100%", c: "#737B60" },
                { h: "58%", c: "#B36A4C" },
                { h: "28%", c: null },
                { h: "18%", c: null },
              ] as const
            ).map((bar, i) => (
              <motion.span
                key={i}
                className={`depth-f2r-mark${bar.c ? "" : " is-dim"}`}
                style={
                  bar.c
                    ? { height: bar.h, background: bar.c }
                    : { height: bar.h }
                }
                initial={reduce ? false : { scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{
                  delay: reduce ? 0 : 2.7 + i * 0.08,
                  duration: 0.5,
                  ease,
                }}
              />
            ))}
          </motion.div>
          <motion.p
            className="depth-f2r-caption"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 3.15, duration: 0.5, ease }}
          >
            {ui.usefulStructure}
          </motion.p>
        </div>
      </div>
    </motion.figure>
  );
}
