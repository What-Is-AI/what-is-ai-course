"use client";

import { DrawingCaption } from "@/components/lesson7/DrawingCaption";
import type { ClipRecord } from "@/lib/lesson7-audio";
import { useLesson7Chrome } from "@/lib/useLesson7Copy";

export type BoardPoint = {
  id: string;
  x: number;
  y: number;
};

type Props = {
  clips: ClipRecord[];
  points: BoardPoint[];
  labels?: Record<string, "belongs" | "doesnt">;
  activeId?: string | null;
  onSelect?: (id: string) => void;
  reducedMotion?: boolean;
  /** Longer caption from label-train step. */
  caption?: string;
  summary?: string;
  className?: string;
  /** Show ●/■/▲ legend – only when belongs/doesn't tagging is in play. */
  showLabelLegend?: boolean;
};

/**
 * 2-D “our drawing” of song placements – never something inside the model.
 * Shape encodes label; click plays (via parent).
 */
export function SongBoard({
  clips,
  points,
  labels = {},
  activeId,
  onSelect,
  reducedMotion = false,
  caption,
  summary,
  className = "",
  showLabelLegend,
}: Props) {
  const chrome = useLesson7Chrome();
  const ui = chrome.songBoard ?? {};
  const labelUi = chrome.labelTrain ?? {};
  const byId = new Map(clips.map((c) => [c.id, c]));
  const dense = points.length > 4;
  /** Keep markers inside the frame (coords are 0–1). */
  const inset = (v: number) => 0.1 + Math.min(1, Math.max(0, v)) * 0.8;
  const legendOn =
    showLabelLegend ?? Object.keys(labels).length > 0;

  return (
    <figure className={`lr-song-board ${className}`.trim()}>
      <div
        className={`lr-board-plot${reducedMotion ? " is-static" : ""}${dense ? " is-dense" : ""}`}
        role="list"
        aria-label={ui.aria}
      >
        {points.map((p) => {
          const clip = byId.get(p.id);
          if (!clip) return null;
          const label = labels[p.id];
          const shape =
            label === "belongs"
              ? "is-belongs"
              : label === "doesnt"
                ? "is-doesnt"
                : "is-open";
          const marked =
            label === "belongs"
              ? ui.markedBelongs
              : label === "doesnt"
                ? ui.markedDoesnt
                : "";
          return (
            <button
              key={p.id}
              type="button"
              role="listitem"
              className={`lr-board-point ${shape}${activeId === p.id ? " is-active" : ""}`}
              style={{
                left: `${inset(p.x) * 100}%`,
                top: `${(1 - inset(p.y)) * 100}%`,
                transition: reducedMotion
                  ? "none"
                  : "left 0.7s ease, top 0.7s ease",
              }}
              onClick={() => onSelect?.(p.id)}
              aria-label={`${clip.title}. ${clip.tag}.${marked ? ` ${marked}` : ""}`}
              title={clip.title}
            >
              <span className="lr-board-mark" aria-hidden />
              <span className="lr-board-name">{clip.title}</span>
            </button>
          );
        })}
      </div>
      <DrawingCaption>{caption}</DrawingCaption>
      {summary ? (
        <figcaption className="lr-board-summary">{summary}</figcaption>
      ) : null}
      {legendOn ? (
        <p className="lr-board-legend lr-mono" aria-hidden>
          {ui.legend ??
            `● ${labelUi.belongs} · ■ ${labelUi.doesnt}`}
        </p>
      ) : null}
    </figure>
  );
}
