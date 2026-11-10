/**
 * Client-side logistic regression over frozen embeddings (Step 4 TRAIN).
 * Honest path from docs/lesson7-script.md Build feasibility:
 * frozen embedder + tiny head that reacts to the learner's labels.
 */

export type TrainExample = {
  embedding: number[];
  label: 0 | 1;
};

export type LogisticModel = {
  weights: number[];
  bias: number;
  dim: number;
};

function sigmoid(z: number): number {
  if (z >= 0) {
    const e = Math.exp(-z);
    return 1 / (1 + e);
  }
  const e = Math.exp(z);
  return e / (1 + e);
}

export function createZeroModel(dim: number): LogisticModel {
  return { weights: Array(dim).fill(0), bias: 0, dim };
}

/** Score in [0, 1] — P(belongs). */
export function predictProba(model: LogisticModel, embedding: number[]): number {
  let z = model.bias;
  const n = Math.min(model.dim, embedding.length);
  for (let i = 0; i < n; i++) z += model.weights[i]! * embedding[i]!;
  return sigmoid(z);
}

export function predictLabel(
  model: LogisticModel,
  embedding: number[],
  threshold = 0.5,
): 0 | 1 {
  return predictProba(model, embedding) >= threshold ? 1 : 0;
}

/**
 * Mini-batch GD logistic regression. Fast for dozens of songs × ~512-D.
 */
export function trainLogistic(
  examples: TrainExample[],
  opts: {
    epochs?: number;
    lr?: number;
    l2?: number;
  } = {},
): LogisticModel {
  if (examples.length === 0) {
    throw new Error("trainLogistic: need at least one example");
  }
  const dim = examples[0]!.embedding.length;
  const epochs = opts.epochs ?? 80;
  const lr = opts.lr ?? 0.15;
  const l2 = opts.l2 ?? 0.001;

  const weights = Array(dim).fill(0) as number[];
  let bias = 0;

  for (let epoch = 0; epoch < epochs; epoch++) {
    for (const ex of examples) {
      const x = ex.embedding;
      let z = bias;
      for (let i = 0; i < dim; i++) z += weights[i]! * (x[i] ?? 0);
      const p = sigmoid(z);
      const err = p - ex.label;
      for (let i = 0; i < dim; i++) {
        const g = err * (x[i] ?? 0) + l2 * weights[i]!;
        weights[i]! -= lr * g;
      }
      bias -= lr * err;
    }
  }

  return { weights, bias, dim };
}

/**
 * Project points into 2-D for the “our drawing” board after TRAIN.
 * Uses the logistic direction as x, and a PCA-ish residual as y when possible;
 * falls back to first two embedding dims.
 */
export function layoutFromModel(
  ids: string[],
  embeddings: Record<string, number[]>,
  model: LogisticModel,
): { id: string; x: number; y: number }[] {
  const scored = ids.map((id) => {
    const emb = embeddings[id];
    if (!emb) return { id, x: 0, y: 0, raw: 0 };
    const x = predictProba(model, emb);
    // Orthogonal-ish: first dim residual after projecting onto weights
    let y = 0;
    const wNorm = Math.hypot(...model.weights) || 1;
    for (let i = 0; i < Math.min(emb.length, model.weights.length); i++) {
      const wi = model.weights[i]! / wNorm;
      y += emb[i]! * (i === 0 ? 1 - wi : -wi * 0.15);
    }
    return { id, x, y, raw: y };
  });

  const ys = scored.map((s) => s.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const span = maxY - minY || 1;

  return scored.map((s) => ({
    id: s.id,
    x: s.x,
    y: (s.y - minY) / span,
  }));
}

/** Accuracy of model on a labeled set (for Step 5 head-to-head). */
export function scoreAccuracy(
  model: LogisticModel,
  items: { embedding: number[]; label: 0 | 1 }[],
): { correct: number; total: number } {
  let correct = 0;
  for (const item of items) {
    if (predictLabel(model, item.embedding) === item.label) correct += 1;
  }
  return { correct, total: items.length };
}

/** Hand detector: all selected feature thresholds must clear (AND). */
export function handDetectorSaysYes(
  features: Record<string, number>,
  thresholds: Record<string, number>,
): boolean {
  for (const [key, thr] of Object.entries(thresholds)) {
    const v = features[key];
    if (v == null) continue;
    if (v < thr) return false;
  }
  return Object.keys(thresholds).length > 0;
}
