"use client";

/**
 * Lesson 6 Compress decoder — linear AE (PCA) via TensorFlow.js matmul.
 * Same decoder for learner vector and network latents (Beat 2 build spec).
 */
import * as tf from "@tensorflow/tfjs";
import type { BottleneckSize } from "@/lib/lesson6-data";

export type CompressBasis = {
  size: number;
  mean: number[];
  components: number[][];
};

let basisPromise: Promise<CompressBasis> | null = null;
const latentCache = new Map<BottleneckSize, Promise<number[]>>();

export function loadBasis(): Promise<CompressBasis> {
  if (!basisPromise) {
    basisPromise = fetch("/lessons/6/compress/basis.json").then((r) => {
      if (!r.ok) throw new Error("Failed to load compress basis");
      return r.json();
    });
  }
  return basisPromise;
}

export function loadNetworkLatent(n: BottleneckSize): Promise<number[]> {
  let p = latentCache.get(n);
  if (!p) {
    p = fetch(`/lessons/6/compress/latent-${n}.json`).then((r) => {
      if (!r.ok) throw new Error(`Failed to load latent-${n}`);
      return r.json();
    });
    latentCache.set(n, p);
  }
  return p;
}

let targetPromise: Promise<number[]> | null = null;

export function loadTarget(): Promise<number[]> {
  if (!targetPromise) {
    targetPromise = fetch("/lessons/6/compress/target.json").then((r) => {
      if (!r.ok) throw new Error("Failed to load compress target");
      return r.json();
    });
  }
  return targetPromise;
}

/** Decode latent z (length N) → flat grayscale [0,1] of size^2. */
export async function decodeLatent(
  z: number[],
  basis?: CompressBasis,
): Promise<Float32Array> {
  const b = basis ?? (await loadBasis());
  const n = z.length;
  const pixels = b.size * b.size;
  return tf.tidy(() => {
    const mean = tf.tensor1d(b.mean);
    const comps = b.components.slice(0, n);
    const kernel = tf.tensor2d(comps, [n, pixels]); // z @ kernel
    const zt = tf.tensor2d([z], [1, n]);
    const delta = tf.matMul(zt, kernel).reshape([pixels]);
    const out = tf.clipByValue(mean.add(delta), 0, 1);
    return out.dataSync() as Float32Array;
  });
}

export function pixelsToImageData(
  pixels: ArrayLike<number>,
  size: number,
): ImageData {
  const data = new Uint8ClampedArray(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const v = Math.round(pixels[i] * 255);
    const o = i * 4;
    data[o] = v;
    data[o + 1] = v;
    data[o + 2] = v;
    data[o + 3] = 255;
  }
  return new ImageData(data, size, size);
}

export function verdictForReconstruction(
  pixels: ArrayLike<number>,
  target: ArrayLike<number>,
): "unrecognizable" | "recognizable" | "broken" {
  let mse = 0;
  const n = target.length;
  for (let i = 0; i < n; i++) {
    const d = pixels[i] - target[i];
    mse += d * d;
  }
  mse /= n;
  if (mse > 0.08) return "unrecognizable";
  if (mse > 0.035) return "broken";
  return "recognizable";
}
