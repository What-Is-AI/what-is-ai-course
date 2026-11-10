"use client";

import { useMemo, useState } from "react";
import {
  DepthContinue,
  DepthFrame,
  DepthLine,
  DepthTitle,
} from "@/components/lesson6/DepthFrame";
import {
  useLesson6Chrome,
  useLesson6StepCopy,
} from "@/lib/useLesson6Copy";
import { PIXEL_SEVEN, TRANSFORMATIONS } from "@/lib/lesson6-data";
import { interpolate } from "@/i18n/translate";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
};

export function Compose({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson6StepCopy();
  const copy = steps.compose;
  const chrome = useLesson6Chrome();
  const composeChrome = chrome.compose ?? {};
  const nested = composeChrome as unknown as {
    transforms?: Record<string, string>;
  };
  const transformLabels = nested.transforms ?? {};
  const [chain, setChain] = useState<string[]>([]);

  const filterCss = useMemo(() => {
    const parts: string[] = [];
    for (const t of chain) {
      if (t === "brighten") parts.push("brightness(1.35)");
      if (t === "blur") parts.push("blur(2px)");
      if (t === "sharpen") parts.push("contrast(1.4)");
      if (t === "contrast") parts.push("contrast(1.6)");
      if (t === "invert") parts.push("invert(1)");
      if (t === "reduce detail") parts.push("blur(3px) contrast(0.7)");
    }
    return parts.join(" ") || "none";
  }, [chain]);

  function labelFor(id: string) {
    return transformLabels[id] ?? id;
  }

  function add(t: (typeof TRANSFORMATIONS)[number]) {
    const next = [...chain, t];
    setChain(next);
    if (next.length >= 2) onGate();
  }

  const chainLabel =
    chain.length === 0
      ? (composeChrome.originalToResult ?? "Original → Result")
      : `${composeChrome.originalArrow ?? "Original → "}${chain
          .map(labelFor)
          .join(" → ")}${composeChrome.arrowResult ?? " → Result"}`;

  return (
    <DepthFrame>
      <div className="depth-layout">
        <div>
          <DepthTitle plaque={copy.plaque}>{copy.title}</DepthTitle>
          <DepthLine>{copy.body}</DepthLine>
          <div className="mt-4 flex flex-wrap gap-2">
            {TRANSFORMATIONS.map((t) => (
              <button
                key={t}
                type="button"
                className="depth-chip"
                onClick={() => add(t)}
              >
                {labelFor(t)}
              </button>
            ))}
          </div>
          <p className="depth-mono mt-4" aria-live="polite">
            {chainLabel}
          </p>
          <p className="depth-mono mt-2">
            {chain.length >= 2
              ? interpolate(
                  composeChrome.stackedChanges ??
                    "{n} changes stacked — each works on the last, not the original.",
                  { n: chain.length },
                )
              : copy.gateHint}
          </p>
          {chain.length >= 2 ? (
            <DepthLine compact>{copy.pivot}</DepthLine>
          ) : null}
          <DepthContinue
            label={copy.cta}
            onClick={onContinue}
            disabled={!gateOpen}
          />
        </div>
        <aside>
          <div
            className="depth-panel overflow-hidden p-4"
            style={{ filter: filterCss }}
          >
            <div className="depth-pixel-grid mx-auto" aria-hidden>
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
          </div>
        </aside>
      </div>
    </DepthFrame>
  );
}
