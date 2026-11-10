"use client";

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AttentionTextSummary } from "@/components/lesson8/AttentionTextSummary";
import type { AttentionLink, WordToken } from "@/lib/lesson8-data";

export type LivingSentenceMode = "exhibit" | "choose" | "operate";

type Props = {
  words: readonly WordToken[];
  /** exhibit = look only; choose/operate = words are activatable. */
  mode?: LivingSentenceMode;
  focusWordId?: string | null;
  selectedWordId?: string | null;
  links?: readonly AttentionLink[];
  showStrengthLabels?: boolean;
  /** When true, only draw links involving focusWordId (default). */
  focusOnly?: boolean;
  reducedMotion?: boolean;
  onWordActivate?: (wordId: string) => void;
  className?: string;
  /** Live region announcements for connection changes (optional parent). */
  liveMessage?: string;
};

type PathGeom = {
  key: string;
  d: string;
  midX: number;
  midY: number;
  strength: number;
  label: string;
};

function pathsEqual(a: PathGeom[], b: PathGeom[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const x = a[i]!;
    const y = b[i]!;
    if (
      x.key !== y.key ||
      x.d !== y.d ||
      x.midX !== y.midX ||
      x.midY !== y.midY ||
      x.strength !== y.strength
    ) {
      return false;
    }
  }
  return true;
}

/**
 * The living page sentence: words as objects, optional attention arcs.
 * Default view is one focus word at a time — never a dense all-pairs field.
 */
export function LivingSentence({
  words,
  mode = "exhibit",
  focusWordId = null,
  selectedWordId = null,
  links = [],
  showStrengthLabels = true,
  focusOnly = true,
  reducedMotion = false,
  onWordActivate,
  className = "",
  liveMessage,
}: Props) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [paths, setPaths] = useState<PathGeom[]>([]);

  const setWordRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) wordRefs.current.set(id, el);
    else wordRefs.current.delete(id);
  }, []);

  const visibleLinks = useMemo(() => {
    if (focusOnly && focusWordId) {
      return links.filter(
        (l) => l.fromId === focusWordId || l.toId === focusWordId,
      );
    }
    return links;
  }, [links, focusOnly, focusWordId]);

  const linksKey = useMemo(
    () =>
      visibleLinks
        .map((l) => `${l.fromId}:${l.toId}:${l.strength}`)
        .join("|"),
    [visibleLinks],
  );

  const wordsKey = useMemo(
    () => words.map((w) => `${w.id}:${w.text}`).join("|"),
    [words],
  );

  useLayoutEffect(() => {
    const measure = () => {
      const surface = surfaceRef.current;
      if (!surface || visibleLinks.length === 0) {
        setPaths((prev) => (prev.length === 0 ? prev : []));
        return;
      }

      const sRect = surface.getBoundingClientRect();
      const next: PathGeom[] = [];

      for (const link of visibleLinks) {
        const fromEl = wordRefs.current.get(link.fromId);
        const toEl = wordRefs.current.get(link.toId);
        if (!fromEl || !toEl) continue;

        const a = fromEl.getBoundingClientRect();
        const b = toEl.getBoundingClientRect();
        const round = (n: number) => Math.round(n * 10) / 10;
        const x1 = round(a.left + a.width / 2 - sRect.left);
        const y1 = round(a.top - sRect.top - 4);
        const x2 = round(b.left + b.width / 2 - sRect.left);
        const y2 = round(b.top - sRect.top - 4);
        const lift = reducedMotion ? 10 : 18 + link.strength * 14;
        const cx = round((x1 + x2) / 2);
        const cy = round(Math.min(y1, y2) - lift);
        const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
        const fromText =
          words.find((w) => w.id === link.fromId)?.text ?? link.fromId;
        const toText =
          words.find((w) => w.id === link.toId)?.text ?? link.toId;

        next.push({
          key: `${link.fromId}-${link.toId}`,
          d,
          midX: cx,
          midY: round(cy + 6),
          strength: link.strength,
          label: `${fromText} → ${toText}, ${link.strength.toFixed(2)}`,
        });
      }

      setPaths((prev) => (pathsEqual(prev, next) ? prev : next));
    };

    measure();
    const surface = surfaceRef.current;
    if (!surface) return;

    const ro = new ResizeObserver(() => {
      measure();
    });
    ro.observe(surface);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [visibleLinks, words, reducedMotion, linksKey, wordsKey]);

  const interactive = mode === "choose" || mode === "operate";
  const needsArcSpace = visibleLinks.length > 0;

  return (
    <div className={`rr-living ${className}`.trim()}>
      <div
        ref={surfaceRef}
        className={`rr-living-surface${needsArcSpace ? "" : " is-flat"}`}
      >
        {paths.length > 0 ? (
          <svg
            className="rr-living-arcs"
            aria-hidden
            width="100%"
            height="100%"
          >
            {paths.map((p) => (
              <g key={p.key}>
                <path
                  d={p.d}
                  className="rr-living-arc"
                  style={{
                    strokeWidth: 1.25 + p.strength * 4.5,
                  }}
                />
                {showStrengthLabels ? (
                  <text
                    x={p.midX}
                    y={p.midY}
                    className="rr-living-arc-label"
                    textAnchor="middle"
                  >
                    {p.strength.toFixed(2)}
                  </text>
                ) : null}
              </g>
            ))}
          </svg>
        ) : null}

        <p className="rr-living-sentence">
          {words.map((word, i) => {
            const isFocus = word.id === focusWordId;
            const isSelected = word.id === selectedWordId;
            const isLinked = visibleLinks.some(
              (l) => l.fromId === word.id || l.toId === word.id,
            );
            const classNameWord = [
              "rr-word",
              interactive ? "rr-word-operable" : "rr-word-exhibit",
              isFocus ? "is-focus" : "",
              isSelected ? "is-selected" : "",
              isLinked ? "is-linked" : "",
            ]
              .filter(Boolean)
              .join(" ");

            if (!interactive) {
              return (
                <span key={word.id}>
                  {i > 0 ? " " : null}
                  <span
                    ref={(el) => setWordRef(word.id, el)}
                    className={classNameWord}
                  >
                    {word.text}
                  </span>
                </span>
              );
            }

            return (
              <span key={word.id}>
                {i > 0 ? " " : null}
                <button
                  type="button"
                  ref={(el) => setWordRef(word.id, el)}
                  className={classNameWord}
                  onClick={() => onWordActivate?.(word.id)}
                  aria-pressed={isSelected || isFocus}
                >
                  {word.text}
                </button>
              </span>
            );
          })}
        </p>
      </div>

      {visibleLinks.length > 0 ? (
        <AttentionTextSummary
          words={words}
          links={visibleLinks}
          focusWordId={focusWordId}
        />
      ) : null}

      {liveMessage ? (
        <p className="sr-only" role="status" aria-live="polite">
          {liveMessage}
        </p>
      ) : null}
    </div>
  );
}
