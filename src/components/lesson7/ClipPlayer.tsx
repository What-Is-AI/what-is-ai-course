"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { ClipRecord } from "@/lib/lesson7-audio";
import { useLesson7Chrome } from "@/lib/useLesson7Copy";

type Props = {
  clip: ClipRecord;
  /** When true, only one clip in a group should play (parent stops siblings). */
  playingId?: string | null;
  onPlayingChange?: (id: string | null) => void;
  /** Optional choose-role selection chrome. */
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
  /** Clip index label for a11y, e.g. "Clip 1 of 6". */
  indexLabel?: string;
  compact?: boolean;
  reducedMotion?: boolean;
  className?: string;
};

/**
 * Shared Listening Room clip strip: transport + energy/rhythm trace + text tag.
 * The trace is the core judgment channel (not an a11y afterthought).
 */
export function ClipPlayer({
  clip,
  playingId,
  onPlayingChange,
  selectable = false,
  selected = false,
  onSelect,
  indexLabel,
  compact = false,
  reducedMotion = false,
  className = "",
}: Props) {
  const chrome = useLesson7Chrome();
  const ui = chrome.clipPlayer ?? {};
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [localPlaying, setLocalPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const reactId = useId();
  const labelId = `${reactId}-label`;

  const isActive =
    playingId != null ? playingId === clip.id : localPlaying;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playingId != null && playingId !== clip.id) {
      audio.pause();
      audio.currentTime = 0;
      setLocalPlaying(false);
      setProgress(0);
    }
  }, [playingId, clip.id]);

  // Autoplay when parent selects this clip on the board (playingId flips to us).
  const prevPlayingRef = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const prev = prevPlayingRef.current;
    prevPlayingRef.current = playingId;
    if (playingId !== clip.id || prev === clip.id) return;
    const audio = audioRef.current;
    if (!audio) return;
    void audio
      .play()
      .then(() => setLocalPlaying(true))
      .catch(() => {
        setLocalPlaying(false);
        onPlayingChange?.(null);
      });
  }, [playingId, clip.id, onPlayingChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      const dur = audio.duration || clip.durationSec || 1;
      setProgress(Math.min(1, audio.currentTime / dur));
    };
    const onEnded = () => {
      setLocalPlaying(false);
      setProgress(0);
      onPlayingChange?.(null);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [clip.durationSec, onPlayingChange]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isActive) {
      audio.pause();
      setLocalPlaying(false);
      onPlayingChange?.(null);
      return;
    }
    try {
      await audio.play();
      setLocalPlaying(true);
      onPlayingChange?.(clip.id);
    } catch {
      setLocalPlaying(false);
      onPlayingChange?.(null);
    }
  }, [clip.id, isActive, onPlayingChange]);

  const trace = clip.energyTrace.length > 0 ? clip.energyTrace : [0.2, 0.4, 0.3];
  const playheadIndex = Math.min(
    trace.length - 1,
    Math.floor(progress * trace.length),
  );

  const title = (
    <span id={labelId} className="lr-clip-title">
      {clip.title}
      {indexLabel ? (
        <span className="lr-clip-index"> · {indexLabel}</span>
      ) : null}
    </span>
  );

  const toggleSelect = useCallback(() => {
    onSelect?.(clip.id);
  }, [clip.id, onSelect]);

  const body = (
    <>
      <audio ref={audioRef} src={clip.src} preload="metadata" />
      <div className="lr-clip-row">
        <button
          type="button"
          className="lr-clip-play"
          onClick={(e) => {
            e.stopPropagation();
            void togglePlay();
          }}
          aria-pressed={isActive}
          aria-labelledby={labelId}
          aria-label={
            isActive
              ? `${ui.pause ?? "Pause"} ${clip.title}`
              : `${ui.play ?? "Play"} ${clip.title}`
          }
        >
          {isActive ? ui.pause : ui.play}
        </button>

        <div className="lr-clip-main">
          <div className="lr-clip-meta">
            {title}
            <span className="lr-clip-tag">{clip.tag}</span>
          </div>

          <div
            className={[
              "lr-energy-trace",
              reducedMotion ? "is-static" : "",
              isActive ? "is-playing" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            role="img"
            aria-label={(ui.energyTrace ?? "Energy and rhythm trace for {title}. Tag: {tag}.")
              .replace("{title}", clip.title)
              .replace("{tag}", clip.tag)}
          >
            {trace.map((v, i) => (
              <span
                key={i}
                className={[
                  "lr-energy-bar",
                  i <= playheadIndex && isActive ? "is-passed" : "",
                  i === playheadIndex && isActive ? "is-head" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{ height: `${Math.max(12, v * 100)}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );

  if (selectable) {
    return (
      <div
        className={[
          "lr-clip",
          "is-selectable",
          compact ? "is-compact" : "",
          selected ? "is-selected" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={toggleSelect}
      >
        <label
          className="lr-clip-choose"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            className="lr-clip-checkbox"
            checked={selected}
            onChange={toggleSelect}
            aria-labelledby={labelId}
          />
          <span className="lr-clip-box" aria-hidden>
            <span className="lr-clip-box-mark">✓</span>
          </span>
          <span className="lr-clip-choose-label">
            {selected ? ui.picked : ui.add}
          </span>
        </label>
        {body}
      </div>
    );
  }

  return (
    <div
      className={["lr-clip", compact ? "is-compact" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {body}
    </div>
  );
}
