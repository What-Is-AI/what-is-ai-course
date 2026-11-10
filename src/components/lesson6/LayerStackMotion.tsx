"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLesson6Chrome } from "@/lib/useLesson6Copy";

const PANE_KEYS = [
  "inputRepresentation",
  "nextLayerTransforms",
  "deeperRepresentation",
] as const;

/** Vertical gap between stacked panes so all three labels stay readable. */
const PANE_STEP_PX = 56;

/**
 * Short Depth-world motion for S4a — translucent panes stacking,
 * not a neuron-graph library (those fight The Depth anti-patterns).
 */
export function LayerStackMotion() {
  const reduce = useReducedMotion();
  const chrome = useLesson6Chrome();
  const ui = chrome.layerStack ?? {};

  return (
    <div className="depth-layer-stack" aria-hidden>
      <div className="depth-layer-stack-stage">
        {PANE_KEYS.map((key, i) => (
          <motion.div
            key={key}
            className="depth-layer-pane"
            initial={reduce ? false : { opacity: 0, y: -18 }}
            animate={{ opacity: 1 - i * 0.08, y: i * PANE_STEP_PX }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    delay: 0.15 + i * 0.45,
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }
            }
            style={{ zIndex: PANE_KEYS.length - i }}
          >
            <span className="depth-layer-pane-label">{ui[key]}</span>
            <span className="depth-layer-pane-glass" />
          </motion.div>
        ))}
        {!reduce ? (
          <motion.span
            className="depth-layer-signal"
            initial={{ top: "8%", opacity: 0 }}
            animate={{ top: ["8%", "88%"], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 2.4,
              delay: 0.35,
              repeat: Infinity,
              repeatDelay: 1.1,
              ease: "easeInOut",
            }}
          />
        ) : null}
      </div>
      <p className="depth-mono depth-layer-stack-caption">{ui.caption}</p>
    </div>
  );
}
