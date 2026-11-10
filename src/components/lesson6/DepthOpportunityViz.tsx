"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useLesson6Chrome } from "@/lib/useLesson6Copy";
import { PIXEL_SEVEN } from "@/lib/lesson6-data";

type BeatId = "l1" | "l2" | "l4" | "l8" | "l16" | "alex";

type BeatBase = {
  id: BeatId;
  layers: number;
  quality: number;
  stability: number;
  alexnet?: boolean;
  titleKey:
    | "fewLayers"
    | "moreLayers"
    | "tooMuch"
    | "alexNet";
  noteKey:
    | "fewLayersNote"
    | "moreLayersNote"
    | "tooMuchNote"
    | "alexNetNote";
};

const BEAT_BASE: BeatBase[] = [
  {
    id: "l1",
    layers: 1,
    quality: 0.28,
    stability: 1,
    titleKey: "fewLayers",
    noteKey: "fewLayersNote",
  },
  {
    id: "l2",
    layers: 2,
    quality: 0.48,
    stability: 0.92,
    titleKey: "moreLayers",
    noteKey: "moreLayersNote",
  },
  {
    id: "l4",
    layers: 4,
    quality: 0.78,
    stability: 0.78,
    titleKey: "moreLayers",
    noteKey: "moreLayersNote",
  },
  {
    id: "l8",
    layers: 8,
    quality: 0.9,
    stability: 0.45,
    titleKey: "tooMuch",
    noteKey: "tooMuchNote",
  },
  {
    id: "l16",
    layers: 16,
    quality: 0.32,
    stability: 0.15,
    titleKey: "tooMuch",
    noteKey: "tooMuchNote",
  },
  {
    id: "alex",
    layers: 8,
    quality: 0.96,
    stability: 1,
    alexnet: true,
    titleKey: "alexNet",
    noteKey: "alexNetNote",
  },
];

const OVERVIEW_BASE = [
  {
    id: "few",
    titleKey: "fewLayers" as const,
    noteKey: "fewLayersNote" as const,
  },
  {
    id: "more",
    titleKey: "moreLayers" as const,
    noteKey: "moreLayersNote" as const,
  },
  {
    id: "too",
    titleKey: "tooMuch" as const,
    noteKey: "tooMuchNote" as const,
  },
  {
    id: "alex",
    titleKey: "alexNet" as const,
    noteKey: "alexNetNote" as const,
    alexnet: true,
  },
];

const BEAT_MS = 2400;
const ALEX_MS = 2800;
const OVERVIEW_STAGGER_MS = 420;
const EASE = [0.22, 1, 0.36, 1] as const;

function fillTemplate(
  template: string,
  vars: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] == null ? `{${key}}` : String(vars[key]),
  );
}

function PixelGlyph({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={["depth-opp-glyph", className].filter(Boolean).join(" ")} style={style}>
      {Array.from({ length: 196 }, (_, i) => {
        const y = Math.floor(i / 14);
        const x = i % 14;
        return (
          <span
            key={i}
            className={PIXEL_SEVEN.has(`${y},${x}`) ? "is-on" : undefined}
          />
        );
      })}
    </div>
  );
}

function outputStyle(quality: number): CSSProperties {
  const blur = (1 - quality) * 2.4;
  const contrast = 0.55 + quality * 0.55;
  const brightness = 0.7 + quality * 0.35;
  const opacity = 0.35 + quality * 0.65;
  return {
    filter: `blur(${blur.toFixed(2)}px) contrast(${contrast.toFixed(2)}) brightness(${brightness.toFixed(2)})`,
    opacity,
  };
}

function LayerStack({
  layers,
  stability,
  alexnet,
}: {
  layers: number;
  stability: number;
  alexnet?: boolean;
}) {
  const visible = Math.min(layers, 8);
  const unstable = stability < 0.55;
  const veryUnstable = stability < 0.3;

  return (
    <div
      className={[
        "depth-opp-layers",
        unstable ? "is-unstable" : "",
        veryUnstable ? "is-very-unstable" : "",
        alexnet ? "is-locked" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {Array.from({ length: 8 }, (_, i) => {
        const on = i < visible;
        return (
          <motion.span
            key={i}
            className="depth-opp-step"
            initial={false}
            animate={{
              opacity: on
                ? alexnet
                  ? 0.95
                  : 0.45 + (i / Math.max(1, visible - 1)) * 0.45
                : 0,
              height: on ? "0.38rem" : 0,
              marginBottom: on && i < visible - 1 ? 3 : 0,
              scaleY: on ? 1 : 0.4,
              x: on && unstable
                ? [0, (i % 2 === 0 ? 1 : -1) * (1 - stability) * 3, 0]
                : 0,
            }}
            transition={{
              height: { duration: 0.55, ease: EASE },
              opacity: { duration: 0.45, ease: EASE },
              scaleY: { duration: 0.45, ease: EASE },
              marginBottom: { duration: 0.45, ease: EASE },
              x: unstable
                ? {
                    duration: 0.55 + i * 0.04,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }
                : { duration: 0.45, ease: EASE },
            }}
          />
        );
      })}
      <motion.span
        className="depth-opp-more"
        initial={false}
        animate={{
          opacity: layers > 8 ? 1 : 0,
          height: layers > 8 ? "auto" : 0,
        }}
        transition={{ duration: 0.35 }}
      >
        {layers > 8 ? `+${layers - 8}` : "\u00a0"}
      </motion.span>
    </div>
  );
}

/**
 * S4d story viz: Input → stacked transforms → Output plays once smoothly,
 * then opens a full overview list one item at a time.
 */
export function DepthOpportunityViz() {
  const reduce = useReducedMotion();
  const chrome = useLesson6Chrome();
  const ui = chrome.depthOpportunity ?? {};
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"play" | "overview">("play");
  const [openCount, setOpenCount] = useState(0);

  const beats = useMemo(
    () =>
      BEAT_BASE.map((b) => ({
        ...b,
        title: ui[b.titleKey] ?? "",
        note: ui[b.noteKey] ?? "",
      })),
    [ui],
  );

  const overview = useMemo(
    () =>
      OVERVIEW_BASE.map((item) => ({
        ...item,
        title: ui[item.titleKey] ?? "",
        note: ui[item.noteKey] ?? "",
      })),
    [ui],
  );

  const beat = beats[index] ?? beats[0];

  useEffect(() => {
    if (reduce) {
      setPhase("overview");
      setOpenCount(OVERVIEW_BASE.length);
      return;
    }
    if (phase !== "play") return;
    const ms = beat.alexnet ? ALEX_MS : BEAT_MS;
    const t = window.setTimeout(() => {
      if (index >= BEAT_BASE.length - 1) {
        setPhase("overview");
      } else {
        setIndex((i) => i + 1);
      }
    }, ms);
    return () => window.clearTimeout(t);
  }, [index, beat.alexnet, phase, reduce]);

  useEffect(() => {
    if (reduce || phase !== "overview") return;
    if (openCount >= OVERVIEW_BASE.length) return;
    const t = window.setTimeout(() => {
      setOpenCount((c) => c + 1);
    }, openCount === 0 ? 280 : OVERVIEW_STAGGER_MS);
    return () => window.clearTimeout(t);
  }, [phase, openCount, reduce]);

  const unstable = beat.stability < 0.55;

  const depthLabel = beat.alexnet
    ? (ui.deepTrainable ?? "")
    : fillTemplate(
        beat.layers === 1
          ? (ui.layerOne ?? "{n} layer")
          : (ui.layerMany ?? "{n} layers"),
        { n: beat.layers },
      );

  if (reduce) {
    return (
      <div className="depth-opp-viz" aria-hidden>
        <StaticStory overview={overview} arcLabel={ui.theArc ?? ""} />
      </div>
    );
  }

  return (
    <div className="depth-opp-viz" aria-hidden>
      <AnimatePresence mode="popLayout" initial={false}>
        {phase === "play" ? (
          <motion.div
            key="play"
            className="depth-opp-play"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="depth-opp-flow">
              <div className="depth-opp-end">
                <p className="depth-opp-end-label">{ui.input}</p>
                <div className="depth-opp-tile">
                  <PixelGlyph />
                </div>
              </div>

              <div className="depth-opp-mid">
                <LayerStack
                  layers={beat.layers}
                  stability={beat.stability}
                  alexnet={beat.alexnet}
                />
                <p className="depth-opp-depth-label">{depthLabel}</p>
              </div>

              <div className="depth-opp-end">
                <p className="depth-opp-end-label">{ui.output}</p>
                <div
                  className={[
                    "depth-opp-tile",
                    unstable ? "is-shaky" : "",
                    beat.alexnet ? "is-success" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <PixelGlyph
                    className="depth-opp-glyph-live"
                    style={outputStyle(beat.quality)}
                  />
                </div>
              </div>
            </div>

            <div className="depth-opp-caption-stage">
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={beat.title + beat.id}
                  className={`depth-opp-caption-block${beat.alexnet ? " is-alex" : ""}`}
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -28, position: "absolute", insetInline: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <p className="depth-opp-title">{beat.title}</p>
                  <p className="depth-opp-note">{beat.note}</p>
                  {beat.id === "l16" || beat.id === "l8" ? (
                    <p className="depth-opp-aside">{ui.asideTooMuch}</p>
                  ) : null}
                  {beat.alexnet ? (
                    <p className="depth-opp-aside">{ui.asideAlexNet}</p>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="depth-opp-progress">
              {beats.map((b, i) => (
                <motion.span
                  key={b.id}
                  className={`depth-opp-dot${b.alexnet ? " is-alex" : ""}`}
                  initial={false}
                  animate={{
                    backgroundColor:
                      i === index
                        ? b.alexnet
                          ? "var(--depth-signal)"
                          : "var(--depth-ink)"
                        : "var(--depth-line)",
                    scale: i === index ? 1.25 : 1,
                  }}
                  transition={{ duration: 0.35, ease: EASE }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="overview"
            className="depth-opp-overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="depth-opp-overview-label">{ui.theArc}</p>
            <ul className="depth-opp-overview-list">
              {overview.map((item, i) => {
                const open = i < openCount;
                return (
                  <motion.li
                    key={item.id}
                    className={`depth-opp-overview-item${"alexnet" in item && item.alexnet ? " is-alex" : ""}`}
                    initial={false}
                    animate={
                      open
                        ? { opacity: 1, height: "auto", y: 0 }
                        : { opacity: 0, height: 0, y: 8 }
                    }
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <span className="depth-opp-overview-title">{item.title}</span>
                    <span className="depth-opp-overview-note">{item.note}</span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StaticStory({
  overview,
  arcLabel,
}: {
  overview: { id: string; title: string; note: string; alexnet?: boolean }[];
  arcLabel: string;
}) {
  return (
    <div className="depth-opp-static">
      <p className="depth-opp-overview-label">{arcLabel}</p>
      <ul className="depth-opp-overview-list">
        {overview.map((item) => (
          <li
            key={item.id}
            className={`depth-opp-overview-item${item.alexnet ? " is-alex" : ""}`}
          >
            <span className="depth-opp-overview-title">{item.title}</span>
            <span className="depth-opp-overview-note">{item.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
