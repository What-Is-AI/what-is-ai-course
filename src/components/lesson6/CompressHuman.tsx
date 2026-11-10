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
  useLesson6DataCopy,
  useLesson6StepCopy,
} from "@/lib/useLesson6Copy";
import { HUMAN_ATTEMPT_N, LATENT_CONTROL } from "@/lib/lesson6-data";
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

function initVector() {
  if (LATENT_CONTROL.init === "random") {
    return Array.from({ length: HUMAN_ATTEMPT_N }, () =>
      LATENT_CONTROL.min +
        Math.random() * (LATENT_CONTROL.max - LATENT_CONTROL.min),
    );
  }
  return Array.from({ length: HUMAN_ATTEMPT_N }, () => 0);
}

function snapLatent(z: number[]) {
  return z.map((raw) => {
    const stepped = Math.round(raw / LATENT_CONTROL.step) * LATENT_CONTROL.step;
    return Math.min(
      LATENT_CONTROL.max,
      Math.max(LATENT_CONTROL.min, Number(stepped.toFixed(1))),
    );
  });
}

export function CompressHuman({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson6StepCopy();
  const copy = steps.compressHuman;
  const chrome = useLesson6Chrome();
  const ui = chrome.compressHuman ?? {};
  const dataCopy = useLesson6DataCopy();
  const reconstructionVerdicts = dataCopy.reconstructionVerdicts as Record<
    string,
    { network: string; humanGarbage: string }
  >;
  const [values, setValues] = useState(initVector);
  const [status, setStatus] = useState<string>(copy.liveHelper);
  const [basis, setBasis] = useState<CompressBasis | null>(null);
  const [networkShown, setNetworkShown] = useState(false);
  const [touched, setTouched] = useState(false);
  const targetRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const netCanvasRef = useRef<HTMLCanvasElement>(null);
  const targetPixelsRef = useRef<number[] | null>(null);
  const frozenYoursRef = useRef<Float32Array | null>(null);
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const gateRef = useRef(onGate);
  gateRef.current = onGate;
  const networkShownRef = useRef(false);
  const paintGen = useRef(0);

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

  function paintTarget(size: number) {
    const pixels = targetPixelsRef.current;
    if (!pixels) return;
    paint(targetRef.current, pixels, size);
  }

  function paintFrozenYours(size: number) {
    const pixels = frozenYoursRef.current;
    if (!pixels) return;
    paint(canvasRef.current, pixels, size);
  }

  async function paintLearner(b: CompressBasis, z: number[]) {
    if (networkShownRef.current) return;
    const gen = ++paintGen.current;
    const pixels = await decodeLatent(z, b);
    if (gen !== paintGen.current || networkShownRef.current) return;
    paint(canvasRef.current, pixels, b.size);
    if (touched) {
      setStatus(reconstructionVerdicts["20"].humanGarbage);
    }
  }

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadBasis(), loadTarget()])
      .then(async ([b, target]) => {
        if (cancelled) return;
        targetPixelsRef.current = target;
        setBasis(b);
        requestAnimationFrame(() => {
          if (cancelled) return;
          paintTarget(b.size);
          void paintLearner(b, valuesRef.current);
        });
      })
      .catch(() => setStatus(ui.couldNotLoadTools ?? ""));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!basis) return;
    paintTarget(basis.size);
    if (networkShownRef.current) paintFrozenYours(basis.size);
  }, [basis]);

  useEffect(() => {
    if (!basis || !touched || networkShown) return;
    const handle = window.setTimeout(() => {
      void paintLearner(basis, values);
    }, 40);
    return () => window.clearTimeout(handle);
  }, [values, basis, touched, networkShown]);

  function setValueAt(i: number, raw: string) {
    if (networkShownRef.current) return;
    setTouched(true);
    const next = values.slice();
    next[i] = Number(raw);
    setValues(next);
  }

  async function showNetwork() {
    if (!basis || !touched || networkShownRef.current) return;
    try {
      // Freeze the learner drawing before swapping slider values.
      const yours = await decodeLatent(valuesRef.current, basis);
      frozenYoursRef.current = yours;
      paint(canvasRef.current, yours, basis.size);

      const snapped = snapLatent(await loadNetworkLatent(20));
      const pixels = await decodeLatent(snapped, basis);
      paint(netCanvasRef.current, pixels, basis.size);

      networkShownRef.current = true;
      setNetworkShown(true);
      setValues(snapped);
      setStatus(reconstructionVerdicts["20"].network);
      gateRef.current();
    } catch {
      setStatus(ui.couldNotLoadNetwork ?? "");
    }
  }

  function tryAgain() {
    if (!basis) return;
    networkShownRef.current = false;
    frozenYoursRef.current = null;
    setNetworkShown(false);
    setTouched(false);
    setValues(initVector());
    setStatus(copy.liveHelper);
    const net = netCanvasRef.current;
    if (net) {
      const ctx = net.getContext("2d");
      ctx?.clearRect(0, 0, net.width, net.height);
    }
    void paintLearner(basis, initVector());
  }

  return (
    <DepthFrame>
      <DepthTitle plaque={copy.plaque} compact>
        {copy.title}
      </DepthTitle>
      <DepthLine compact>{copy.body}</DepthLine>

      <section
        className="depth-clue-board mt-4"
        aria-label={networkShown ? ui.networkValues : ui.yourValues}
      >
        <p className="depth-eyebrow mb-2">
          {networkShown ? ui.networkValues : ui.yourValues}
        </p>
        <div className="depth-clue-layout">
          <div className="depth-clue-grid">
            {values.map((v, i) => {
              const clue = copy.clueLabel
                .replace("{n}", String(i + 1))
                .replace("{total}", String(HUMAN_ATTEMPT_N));
              return (
                <label key={i} className="depth-clue">
                  <span className="depth-clue-num">{clue}</span>
                  <input
                    className="depth-slider"
                    type="range"
                    min={LATENT_CONTROL.min}
                    max={LATENT_CONTROL.max}
                    step={LATENT_CONTROL.step}
                    value={v}
                    disabled={networkShown}
                    aria-valuenow={v}
                    aria-label={`${clue}, currently ${v.toFixed(1)}`}
                    onInput={(e) => setValueAt(i, e.currentTarget.value)}
                    onChange={(e) => setValueAt(i, e.target.value)}
                  />
                  <span className="depth-mono depth-clue-val">{v.toFixed(1)}</span>
                </label>
              );
            })}
          </div>
          <aside className="depth-clue-help" aria-live="polite">
            {status}
          </aside>
        </div>
      </section>

      <div className="depth-recon-board">
        <figure className="depth-recon">
          <div
            className="depth-recon-strip"
            role="group"
            aria-label={ui.originalAndDrawings}
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
                <span className="depth-recon-detail">{copy.panelTarget}</span>
              </figcaption>
            </div>

            <div className="depth-recon-cell">
              <div className="depth-recon-well">
                <canvas ref={canvasRef} className="depth-recon-canvas" />
              </div>
              <figcaption className="depth-recon-cap">
                <span className="depth-recon-role">
                  {networkShown ? ui.yourAttemptLocked : ui.fromYourValues}
                </span>
                <span className="depth-recon-detail">{copy.panelYours}</span>
              </figcaption>
            </div>

            <div
              className={`depth-recon-cell${networkShown ? " is-revealed" : " is-pending"}`}
            >
              <div className="depth-recon-well">
                <canvas
                  ref={netCanvasRef}
                  className="depth-recon-canvas"
                  aria-hidden={!networkShown}
                />
                {!networkShown ? (
                  <div className="depth-recon-pending" aria-hidden>
                    ?
                  </div>
                ) : null}
              </div>
              <figcaption className="depth-recon-cap">
                <span className="depth-recon-role">{ui.fromNetwork20}</span>
                <span className="depth-recon-detail">{copy.panelNetwork}</span>
              </figcaption>
            </div>
          </div>
        </figure>

        {networkShown ? (
          <aside className="depth-recon-finding" role="note">
            <p className="depth-eyebrow mb-2">{ui.finding}</p>
            <p className="depth-recon-finding-body">{copy.takeaway}</p>
          </aside>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!networkShown ? (
          <button
            type="button"
            className="depth-btn"
            disabled={!basis || !touched}
            onClick={() => void showNetwork()}
          >
            {copy.showNetwork}
          </button>
        ) : (
          <>
            <DepthContinue
              label={copy.cta}
              onClick={onContinue}
              disabled={!gateOpen}
              className="mt-0"
            />
            <button
              type="button"
              className="depth-btn-secondary"
              onClick={tryAgain}
            >
              {copy.tryAgain}
            </button>
          </>
        )}
      </div>
    </DepthFrame>
  );
}
