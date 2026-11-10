"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DepthContinue,
  DepthFrame,
  DepthLine,
  DepthTitle,
} from "@/components/lesson6/DepthFrame";
import { useLesson6StepCopy } from "@/lib/useLesson6Copy";
import {
  makeConcentricRings,
  ToyMLP,
  hiddenSizesForDepth,
} from "@/lib/lesson6-toy-mlp";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
};

const RES = 48;

function withPct(template: string, pct: number) {
  return template.replace("{pct}", String(pct));
}

export function DeepenInspect({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson6StepCopy();
  const copy = steps.deepenInspect;
  const points = useMemo(() => makeConcentricRings(180, 42), []);
  const [shallowResult, setShallowResult] = useState<string>(copy.training);
  const [deeperResult, setDeeperResult] = useState<string>("");
  const [done, setDone] = useState(false);
  const shallowRef = useRef<HTMLCanvasElement>(null);
  const deepRef = useRef<HTMLCanvasElement>(null);
  const gateRef = useRef(onGate);
  gateRef.current = onGate;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      await new Promise((r) => setTimeout(r, 30));
      if (cancelled) return;
      const shallow = new ToyMLP(hiddenSizesForDepth(1));
      shallow.train(points, 40, 0.1);
      const deep = new ToyMLP(hiddenSizesForDepth(3));
      deep.train(points, 55, 0.08);
      if (cancelled) return;
      paint(shallowRef.current, shallow, points);
      paint(deepRef.current, deep, points);
      const sPct = Math.round(shallow.separationScore(points) * 100);
      const dPct = Math.round(deep.separationScore(points) * 100);
      setShallowResult(withPct(copy.shallowResult, sPct));
      setDeeperResult(withPct(copy.deeperResult, dPct));
      setDone(true);
      gateRef.current();
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [points, copy.shallowResult, copy.deeperResult]);

  return (
    <DepthFrame>
      <div className="depth-layout">
        <div>
          <DepthTitle plaque={copy.plaque}>{copy.title}</DepthTitle>
          <DepthLine>{copy.body}</DepthLine>
          {done ? <DepthLine compact>{copy.takeaway}</DepthLine> : null}
          <DepthContinue
            label={copy.cta}
            onClick={onContinue}
            disabled={!gateOpen || !done}
          />
        </div>
        <aside className="depth-split-panels" aria-live="polite">
          <figure className="depth-split-panel">
            <p className="depth-eyebrow mb-2">{copy.shallowLabel}</p>
            <canvas ref={shallowRef} className="depth-split-canvas" />
            <figcaption className="depth-split-result">{shallowResult}</figcaption>
          </figure>
          <figure className="depth-split-panel">
            <p className="depth-eyebrow mb-2">{copy.deeperLabel}</p>
            <canvas ref={deepRef} className="depth-split-canvas" />
            <figcaption className="depth-split-result">
              {deeperResult || "\u00a0"}
            </figcaption>
          </figure>
        </aside>
      </div>
    </DepthFrame>
  );
}

function paint(
  canvas: HTMLCanvasElement | null,
  net: ToyMLP,
  points: { x: number; y: number; label: 0 | 1 }[],
) {
  if (!canvas) return;
  canvas.width = RES;
  canvas.height = RES;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const grid = net.boundaryGrid(RES);
  const img = ctx.createImageData(RES, RES);
  for (let i = 0; i < RES * RES; i++) {
    const p = grid[i];
    const o = i * 4;
    img.data[o] = Math.round(20 + p * 40);
    img.data[o + 1] = Math.round(30 + p * 120);
    img.data[o + 2] = Math.round(40 + p * 140);
    img.data[o + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  for (const p of points) {
    const x = ((p.x + 1) / 2) * (RES - 1);
    const y = ((p.y + 1) / 2) * (RES - 1);
    ctx.fillStyle = p.label === 1 ? "#3db8c5" : "#e0a04a";
    ctx.fillRect(x - 1, y - 1, 2, 2);
  }
}
