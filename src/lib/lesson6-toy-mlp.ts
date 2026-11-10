/**
 * Tiny 2-D MLP trainer for Lesson 6 Deepen (S4b/S4c).
 * Pure TypeScript — trains in-browser in seconds.
 */

export type Point = { x: number; y: number; label: 0 | 1 };

export function makeConcentricRings(n = 200, seed = 42): Point[] {
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  const pts: Point[] = [];
  for (let i = 0; i < n; i++) {
    const label = (i % 2) as 0 | 1;
    const ang = rand() * Math.PI * 2;
    const r =
      label === 0 ? 0.25 + rand() * 0.12 : 0.55 + rand() * 0.15;
    pts.push({
      x: Math.cos(ang) * r,
      y: Math.sin(ang) * r,
      label,
    });
  }
  return pts;
}

function relu(x: number) {
  return x > 0 ? x : 0;
}
function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, x))));
}

type Layer = { w: number[][]; b: number[] };

export class ToyMLP {
  layers: Layer[];
  history: { epoch: number; loss: number; acc: number }[] = [];
  private rng: () => number;

  constructor(hiddenSizes: number[], input = 2, output = 1, seed = 42) {
    let s = seed >>> 0;
    this.rng = () => {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 0x100000000;
    };
    const sizes = [input, ...hiddenSizes, output];
    this.layers = [];
    for (let l = 0; l < sizes.length - 1; l++) {
      const fanIn = sizes[l];
      const fanOut = sizes[l + 1];
      const scale = Math.sqrt(2 / fanIn);
      const w = Array.from({ length: fanOut }, () =>
        Array.from({ length: fanIn }, () => (this.rng() * 2 - 1) * scale),
      );
      const b = Array.from({ length: fanOut }, () => 0);
      this.layers.push({ w, b });
    }
  }

  forward(x: number[]): { acts: number[][]; zs: number[][] } {
    const acts: number[][] = [x];
    const zs: number[][] = [];
    let cur = x;
    for (let li = 0; li < this.layers.length; li++) {
      const { w, b } = this.layers[li];
      const z = b.map((bi, j) => {
        let s = bi;
        for (let i = 0; i < cur.length; i++) s += w[j][i] * cur[i];
        return s;
      });
      zs.push(z);
      const last = li === this.layers.length - 1;
      cur = last ? z.map(sigmoid) : z.map(relu);
      acts.push(cur);
    }
    return { acts, zs };
  }

  predict(x: number, y: number): number {
    return this.forward([x, y]).acts.at(-1)![0];
  }

  train(points: Point[], epochs: number, lr = 0.08) {
    this.history = [];
    for (let e = 0; e < epochs; e++) {
      let loss = 0;
      let correct = 0;
      const order = points.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(this.rng() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      for (const idx of order) {
        const p = points[idx];
        const x = [p.x, p.y];
        const y = p.label;
        const { acts, zs } = this.forward(x);
        const pred = acts.at(-1)![0];
        const err = pred - y;
        loss += err * err;
        if ((pred >= 0.5 ? 1 : 0) === y) correct++;

        // backprop
        let delta = [err * pred * (1 - pred)];
        for (let li = this.layers.length - 1; li >= 0; li--) {
          const layer = this.layers[li];
          const aPrev = acts[li];
          const gradW = layer.w.map((row, j) =>
            row.map((_, i) => delta[j] * aPrev[i]),
          );
          const gradB = delta.slice();
          const newDelta: number[] = Array.from({ length: aPrev.length }, () => 0);
          for (let j = 0; j < layer.w.length; j++) {
            for (let i = 0; i < aPrev.length; i++) {
              newDelta[i] += layer.w[j][i] * delta[j];
            }
          }
          for (let j = 0; j < layer.w.length; j++) {
            for (let i = 0; i < aPrev.length; i++) {
              layer.w[j][i] -= lr * gradW[j][i];
            }
            layer.b[j] -= lr * gradB[j];
          }
          if (li > 0) {
            delta = newDelta.map((d, i) => (zs[li - 1][i] > 0 ? d : 0));
          }
        }
      }
      this.history.push({
        epoch: e,
        loss: loss / points.length,
        acc: correct / points.length,
      });
    }
    return this.history;
  }

  /** Grid of predictions for decision boundary viz (−1..1). */
  boundaryGrid(res = 40): Float32Array {
    const g = new Float32Array(res * res);
    for (let yi = 0; yi < res; yi++) {
      for (let xi = 0; xi < res; xi++) {
        const x = (xi / (res - 1)) * 2 - 1;
        const y = (yi / (res - 1)) * 2 - 1;
        g[yi * res + xi] = this.predict(x, y);
      }
    }
    return g;
  }

  separationScore(points: Point[]): number {
    let ok = 0;
    for (const p of points) {
      const pred = this.predict(p.x, p.y) >= 0.5 ? 1 : 0;
      if (pred === p.label) ok++;
    }
    return ok / points.length;
  }
}

export function makePlateauRings(n = 200, seed = 11): Point[] {
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  const pts: Point[] = [];
  for (let i = 0; i < n; i++) {
    const label = (i % 2) as 0 | 1;
    const ang = rand() * Math.PI * 2;
    const r = label === 0 ? 0.32 + rand() * 0.08 : 0.58 + rand() * 0.1;
    pts.push({
      x: Math.cos(ang) * r + (rand() - 0.5) * 0.08,
      y: Math.sin(ang) * r + (rand() - 0.5) * 0.08,
      label,
    });
  }
  return pts;
}

export function hiddenSizesForDepth(depthLevel: number): number[] {
  if (depthLevel <= 1) return [3];
  if (depthLevel === 2) return [8, 6];
  if (depthLevel === 3) return [12, 12, 8];
  if (depthLevel === 4) return [10, 10, 8, 6];
  if (depthLevel === 5) return [16, 16, 12, 8, 8];
  if (depthLevel === 8) return [6, 6, 6, 6, 6, 6, 6, 6];
  if (depthLevel >= 16) return Array.from({ length: 16 }, () => 4);
  return [20, 20, 16, 12, 8, 8, 4, 4];
}

/** Equal hidden-unit budget: one wide layer vs three stacked layers. */
export function wideVsDeepLayouts(totalUnits: number): {
  wide: number[];
  deep: number[];
} {
  const n = Math.max(3, Math.floor(totalUnits));
  const per = Math.floor(n / 3);
  const rem = n - per * 3;
  return {
    wide: [n],
    deep: [per + (rem > 0 ? 1 : 0), per + (rem > 1 ? 1 : 0), per],
  };
}
