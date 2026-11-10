"use client";

import { useEffect, useRef, useState } from "react";
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
import { interpolate } from "@/i18n/translate";
import {
  BOTTLENECK_SIZES,
  BREAK_POINT,
  type BottleneckSize,
} from "@/lib/lesson6-data";
import {
  decodeLatent,
  loadBasis,
  loadNetworkLatent,
  loadTarget,
  pixelsToImageData,
  type CompressBasis,
} from "@/lib/lesson6-compress-decoder";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
};

export function CompressBottleneck({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson6StepCopy();
  const copy = steps.compressBottleneck;
  const chrome = useLesson6Chrome();
  const ui = chrome.compressBottleneck ?? {};
  const [n, setN] = useState<BottleneckSize>(20);
  const [status, setStatus] = useState<string>(copy.readout[20]);
  const [sawBreak, setSawBreak] = useState(false);
  const [basis, setBasis] = useState<CompressBasis | null>(null);
  const targetRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetPixelsRef = useRef<number[] | null>(null);
  const gateRef = useRef(onGate);
  gateRef.current = onGate;

  function paint(
    canvas: HTMLCanvasElement | null,
    pixels: ArrayLike<number>,
    size: number,
  ) {
    if (!canvas) return;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(pixelsToImageData(pixels, size), 0, 0);
  }

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadBasis(), loadTarget()])
      .then(([b, target]) => {
        if (cancelled) return;
        targetPixelsRef.current = target;
        setBasis(b);
        requestAnimationFrame(() => {
          if (cancelled) return;
          paint(targetRef.current, target, b.size);
        });
      })
      .catch(() => setStatus(ui.couldNotLoadDrawings ?? ""));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!basis) return;
    if (targetPixelsRef.current) {
      paint(targetRef.current, targetPixelsRef.current, basis.size);
    }
    let cancelled = false;
    (async () => {
      const z = await loadNetworkLatent(n);
      const pixels = await decodeLatent(z, basis);
      if (cancelled) return;
      paint(canvasRef.current, pixels, basis.size);
      setStatus(copy.readout[n]);
      if (n <= BREAK_POINT) {
        setSawBreak(true);
        gateRef.current();
      }
    })().catch(() => setStatus(ui.drawingFailed ?? ""));
    return () => {
      cancelled = true;
    };
  }, [n, basis, copy.readout, ui.drawingFailed]);

  function onSliderChange(raw: string) {
    const idx = Number(raw);
    const size = BOTTLENECK_SIZES[idx];
    if (size != null) setN(size);
  }

  const sliderIndex = BOTTLENECK_SIZES.indexOf(n);

  return (
    <DepthFrame>
      <DepthTitle plaque={copy.plaque} compact>
        {copy.title}
      </DepthTitle>
      <DepthLine compact>{copy.body}</DepthLine>

      <div className="depth-size-board mt-5">
        <div className="depth-size-controls">
          <p id="rep-size-label" className="depth-eyebrow">
            {copy.controlLabel}
          </p>

          <div
            className="mt-3 flex flex-wrap gap-2"
            role="group"
            aria-labelledby="rep-size-label"
          >
            {BOTTLENECK_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                className={`depth-chip ${n === size ? "is-active" : ""}`}
                aria-pressed={n === size}
                onClick={() => setN(size)}
              >
                {size}
              </button>
            ))}
          </div>

          <input
            id="rep-size-slider"
            className="depth-slider mt-4"
            type="range"
            min={0}
            max={BOTTLENECK_SIZES.length - 1}
            step={1}
            value={sliderIndex < 0 ? 1 : sliderIndex}
            aria-labelledby="rep-size-label"
            aria-valuemin={0}
            aria-valuemax={BOTTLENECK_SIZES.length - 1}
            aria-valuenow={sliderIndex}
            aria-valuetext={`${n} numbers`}
            onInput={(e) => onSliderChange(e.currentTarget.value)}
            onChange={(e) => onSliderChange(e.currentTarget.value)}
          />
          <div className="mt-1 flex justify-between depth-mono" aria-hidden>
            {BOTTLENECK_SIZES.map((size) => (
              <span key={size}>{size}</span>
            ))}
          </div>
          <p className="depth-mono mt-2">{copy.scaleHint}</p>
          <p className="depth-mono mt-4" aria-live="polite">
            {status}
          </p>
          {sawBreak ? <DepthLine compact>{copy.takeaway}</DepthLine> : null}
          <DepthContinue
            label={copy.cta}
            onClick={onContinue}
            disabled={!gateOpen}
          />
        </div>

        <figure className="depth-recon depth-recon-pair">
          <div
            className="depth-recon-strip"
            role="group"
            aria-label={ui.originalAndDrawing}
          >
            <div className="depth-recon-cell">
              <div className="depth-recon-well">
                <canvas
                  ref={targetRef}
                  className="depth-recon-canvas"
                  aria-label={ui.originalHandwritten7}
                />
              </div>
              <figcaption className="depth-recon-cap">
                <span className="depth-recon-role">{ui.original}</span>
                <span className="depth-recon-detail">{ui.the7}</span>
              </figcaption>
            </div>
            <div className="depth-recon-cell">
              <div className="depth-recon-well">
                <canvas ref={canvasRef} className="depth-recon-canvas" />
              </div>
              <figcaption className="depth-recon-cap">
                <span className="depth-recon-role">
                  {interpolate(ui.fromNNumbers ?? "From {n} numbers", { n })}
                </span>
                <span className="depth-recon-detail">{ui.whatComesBack}</span>
              </figcaption>
            </div>
          </div>
        </figure>
      </div>
    </DepthFrame>
  );
}
