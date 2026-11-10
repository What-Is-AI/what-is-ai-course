/**
 * Build Lesson 6 Compress basis (linear AE / PCA) for the shared digit “7”.
 * Run from repo root: node scripts/lesson6/build-compress-assets.mjs
 *
 * Continuity with Arrive/Compose: same glyph, 28×28 for the decoder.
 * S3a: network’s 20 numbers rebuild a recognizable 7.
 * S3b (N=5 break): tuned via soft edges + sample diversity — verify after rebuild.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../../public/lessons/6/compress");
const SIZE = 28;
const PIXELS = SIZE * SIZE;

/** Same 14×14 “7” as PIXEL_SEVEN in lesson6-data (keys "y,x"). */
const SEVEN_14 = new Set([
  "0,2","0,3","0,4","0,5","0,6","0,7","0,8","0,9","0,10",
  "1,10","2,9","3,8","4,7","5,6","6,5","7,5","8,5","9,5","10,5","11,5","12,5","13,5",
]);

function makeTarget() {
  const img = new Float32Array(PIXELS);
  // Upscale 14→28 with a soft brush so PCA has structure beyond a hard mask.
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const y14 = Math.floor(y / 2);
      const x14 = Math.floor(x / 2);
      let v = 0.06;
      if (SEVEN_14.has(`${y14},${x14}`)) v = 0.92;
      // Soft halo from 4-neighborhood in 14-space
      let near = 0;
      for (const [dy, dx] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        if (SEVEN_14.has(`${y14 + dy},${x14 + dx}`)) near += 1;
      }
      if (!SEVEN_14.has(`${y14},${x14}`) && near > 0) v = 0.22 + near * 0.08;
      // Sub-pixel jitter so compression isn’t trivially sparse
      v += Math.sin(x * 0.55 + y * 0.31) * 0.015;
      img[y * SIZE + x] = Math.min(1, Math.max(0, v));
    }
  }
  return img;
}

function makeSamples(target, n) {
  const samples = [Float32Array.from(target)];
  for (let s = 0; s < n - 1; s++) {
    const img = new Float32Array(PIXELS);
    const shiftX = (s % 5) - 2;
    const shiftY = ((s * 3) % 5) - 2;
    const bright = 0.85 + (s % 7) * 0.02;
    const thicken = s % 3 === 0;
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const sx = Math.min(SIZE - 1, Math.max(0, x - shiftX));
        const sy = Math.min(SIZE - 1, Math.max(0, y - shiftY));
        let v = target[sy * SIZE + sx] * bright;
        if (thicken && v > 0.3) {
          const n1 = target[sy * SIZE + Math.min(SIZE - 1, sx + 1)] ?? 0;
          v = Math.max(v, n1 * 0.7);
        }
        v += ((s * 17 + x * 3 + y) % 11) / 220;
        img[y * SIZE + x] = Math.min(1, Math.max(0, v));
      }
    }
    samples.push(img);
  }
  return samples;
}

function hypot(arr) {
  let s = 0;
  for (let i = 0; i < arr.length; i++) s += arr[i] * arr[i];
  return Math.sqrt(s);
}

function pca(samples, k) {
  const n = samples.length;
  const mean = new Float32Array(PIXELS);
  for (const s of samples) {
    for (let i = 0; i < PIXELS; i++) mean[i] += s[i];
  }
  for (let i = 0; i < PIXELS; i++) mean[i] /= n;

  const residual = samples.map((s) => {
    const c = new Float32Array(PIXELS);
    for (let i = 0; i < PIXELS; i++) c[i] = s[i] - mean[i];
    return c;
  });

  const components = [];
  for (let comp = 0; comp < k; comp++) {
    const v = new Float32Array(PIXELS);
    for (let i = 0; i < PIXELS; i++) v[i] = Math.sin(i * 0.17 + comp) * 0.01;
    let norm = hypot(v) || 1;
    for (let i = 0; i < PIXELS; i++) v[i] /= norm;

    for (let iter = 0; iter < 40; iter++) {
      const w = new Float32Array(PIXELS);
      for (const r of residual) {
        let dot = 0;
        for (let i = 0; i < PIXELS; i++) dot += r[i] * v[i];
        for (let i = 0; i < PIXELS; i++) w[i] += dot * r[i];
      }
      norm = hypot(w) || 1;
      for (let i = 0; i < PIXELS; i++) v[i] = w[i] / norm;
    }
    components.push(v);
    for (const r of residual) {
      let dot = 0;
      for (let i = 0; i < PIXELS; i++) dot += r[i] * v[i];
      for (let i = 0; i < PIXELS; i++) r[i] -= dot * v[i];
    }
  }
  return { mean, components };
}

function project(img, mean, components, n) {
  const z = new Float32Array(n);
  for (let k = 0; k < n; k++) {
    let dot = 0;
    for (let i = 0; i < PIXELS; i++) {
      dot += (img[i] - mean[i]) * components[k][i];
    }
    z[k] = dot;
  }
  return z;
}

function reconstruct(z, mean, components) {
  const out = Float32Array.from(mean);
  for (let k = 0; k < z.length; k++) {
    for (let i = 0; i < PIXELS; i++) out[i] += z[k] * components[k][i];
  }
  return out;
}

function mse(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    s += d * d;
  }
  return s / a.length;
}

fs.mkdirSync(OUT, { recursive: true });
const target = makeTarget();
const { mean, components } = pca(makeSamples(target, 80), 100);

const basis = {
  size: SIZE,
  mean: Array.from(mean),
  components: components.map((c) => Array.from(c)),
  licenseNote:
    "Synthetic handwritten 7 matching Lesson 6 Arrive/Compose glyph (course demo).",
};
fs.writeFileSync(path.join(OUT, "basis.json"), JSON.stringify(basis));
fs.writeFileSync(path.join(OUT, "target.json"), JSON.stringify(Array.from(target)));

for (const n of [100, 20, 5]) {
  const z = project(target, mean, components, n);
  fs.writeFileSync(path.join(OUT, `latent-${n}.json`), JSON.stringify(Array.from(z)));
  const recon = reconstruct(z, mean, components);
  console.log(`N=${n} mse vs target:`, mse(recon, target).toFixed(5));
}

console.log("Wrote", OUT);
