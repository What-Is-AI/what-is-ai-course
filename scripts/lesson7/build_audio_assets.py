#!/usr/bin/env python3
"""
Build Lesson 7 Listening Room audio bundle.

Inputs:  scripts/lesson7/source-clips/*.mp3 + curated_manifest.json
Outputs: public/lessons/7/bundle.json + public/lessons/7/audio/*.wav

Embedder preference: CLAP (transformers) → OpenL3 → mel-PCA (dev only; fails ship check).
"""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[1]
MANIFEST = ROOT / "curated_manifest.json"
SOURCE = ROOT / "source-clips"
OUT_DIR = REPO / "public" / "lessons" / "7"
AUDIO_OUT = OUT_DIR / "audio"
BUNDLE_OUT = OUT_DIR / "bundle.json"

SR = 22050
CLIP_SEC = 10
TRACE_BINS = 56

# Allow importing sibling verify module
sys.path.insert(0, str(ROOT))


def load_audio(path: Path, clip_sec: int) -> tuple[np.ndarray, int]:
    """Decode mp3/wav to mono float32 at SR without requiring system ffmpeg."""
    import miniaudio

    decoded = miniaudio.decode_file(str(path))
    # decoded.samples is interleaved int/float depending on format
    samples = np.asarray(decoded.samples, dtype=np.float32)
    channels = int(decoded.nchannels)
    src_sr = int(decoded.sample_rate)
    if channels > 1:
        samples = samples.reshape(-1, channels).mean(axis=1)
    # normalize if int-like peak
    peak = np.max(np.abs(samples)) + 1e-9
    if peak > 1.5:
        samples = samples / 32768.0

    if src_sr != SR:
        import librosa

        samples = librosa.resample(samples, orig_sr=src_sr, target_sr=SR)

    need = int(clip_sec * SR)
    if samples.size > need:
        start = max(0, (samples.size - need) // 3)
        samples = samples[start : start + need]
    elif samples.size < need:
        samples = np.pad(samples, (0, need - samples.size))
    return samples.astype(np.float32), SR


def energy_trace(y: np.ndarray, bins: int = TRACE_BINS) -> list[float]:
    frame = max(1, len(y) // bins)
    vals = []
    for i in range(bins):
        chunk = y[i * frame : (i + 1) * frame]
        vals.append(float(np.sqrt(np.mean(chunk**2) + 1e-12)))
    arr = np.asarray(vals)
    mx = float(arr.max()) or 1.0
    return (arr / mx).clip(0, 1).round(4).tolist()


def hand_features_raw(y: np.ndarray, sr: int) -> dict[str, float]:
    """Raw acoustic measurements (not yet corpus-normalized)."""
    import librosa

    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    tempo = float(librosa.feature.tempo(onset_envelope=onset_env, sr=sr)[0])

    # Beat: crest of onset envelope (peaky vs flat)
    beat = float(onset_env.max() / (onset_env.mean() + 1e-6))

    rms = librosa.feature.rms(y=y)[0]
    loud = float(rms.mean())

    # Bass: ratio of energy below 180 Hz to total
    S = np.abs(librosa.stft(y)) ** 2
    freqs = librosa.fft_frequencies(sr=sr)
    total = float(S.mean()) + 1e-12
    bass = float(S[freqs <= 180].mean() / total)

    # Rhythm regularity — normalized autocorr peak
    oe = onset_env - onset_env.mean()
    if oe.std() > 1e-6:
        corr = np.correlate(oe, oe, mode="full")
        corr = corr[corr.size // 2 :]
        corr = corr / (corr[0] + 1e-9)
        rhythm = float(corr[8 : min(180, corr.size)].max()) if corr.size > 8 else 0.0
    else:
        rhythm = 0.0

    # Vocals proxy: mid-band harmonic energy
    harm, _perc = librosa.effects.hpss(y)
    S_h = np.abs(librosa.stft(harm))
    mid = S_h[(freqs >= 300) & (freqs <= 3400)].mean() if np.any(freqs >= 300) else 0.0
    vocals = float(mid)

    return {
        "tempo": tempo,
        "beat": beat,
        "loud": loud,
        "bass": bass,
        "rhythm": rhythm,
        "vocals": vocals,
    }


def normalize_features(raw_rows: list[dict[str, float]]) -> list[dict[str, float]]:
    """Rank-normalize each feature to [0,1] across the corpus (honest, comparable)."""
    keys = list(raw_rows[0].keys())
    cols = {k: np.array([r[k] for r in raw_rows], dtype=np.float64) for k in keys}
    ranks: dict[str, np.ndarray] = {}
    for k, arr in cols.items():
        order = arr.argsort().argsort().astype(np.float64)
        ranks[k] = order / max(len(arr) - 1, 1)
    return [{k: round(float(ranks[k][i]), 4) for k in keys} for i in range(len(raw_rows))]


def clap_text_scores(
    waves: list[np.ndarray],
    sr: int,
    queries: list[str],
) -> tuple[np.ndarray, np.ndarray, str]:
    """Audio embeddings + cosine similarity to each text query (CLAP)."""
    import librosa
    import torch
    from transformers import ClapModel, ClapProcessor

    model_id = "laion/clap-htsat-unfused"
    target_sr = 48000
    processor = ClapProcessor.from_pretrained(model_id)
    model = ClapModel.from_pretrained(model_id)
    model.eval()

    audio_vecs = []
    with torch.no_grad():
        text_inputs = processor(text=queries, return_tensors="pt", padding=True)
        text_emb = model.get_text_features(**text_inputs)
        text_emb = torch.nn.functional.normalize(text_emb, dim=-1)

        for y in waves:
            audio = y
            if sr != target_sr:
                audio = librosa.resample(y, orig_sr=sr, target_sr=target_sr)
            inputs = processor(
                audio=audio,
                sampling_rate=target_sr,
                return_tensors="pt",
                padding=True,
            )
            emb = model.get_audio_features(**inputs)
            emb = torch.nn.functional.normalize(emb, dim=-1)
            audio_vecs.append(emb[0].cpu().numpy().astype(np.float32))

    audio_mat = np.stack(audio_vecs)
    text_np = text_emb.cpu().numpy().astype(np.float32)
    sims = audio_mat @ text_np.T  # [n_clips, n_queries]
    return audio_mat, sims, f"clap:{model_id}"


def embed_clap(waves: list[np.ndarray], sr: int) -> tuple[np.ndarray, str]:
    emb, _sims, name = clap_text_scores(waves, sr, ["music"])
    return emb, name


def embed_openl3(waves: list[np.ndarray], sr: int) -> tuple[np.ndarray, str]:
    import openl3

    vecs = []
    for y in waves:
        emb, _ = openl3.get_audio_embedding(
            y,
            sr,
            content_type="music",
            embedding_size=512,
            center=True,
        )
        v = emb.mean(axis=0).astype(np.float32)
        v = v / (np.linalg.norm(v) + 1e-9)
        vecs.append(v)
    return np.stack(vecs), "openl3:music-512"


def embed_mel_pca(waves: list[np.ndarray], sr: int, dim: int = 64) -> tuple[np.ndarray, str]:
    import librosa
    from sklearn.decomposition import PCA

    mats = []
    for y in waves:
        mel = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=64)
        logmel = librosa.power_to_db(mel, ref=np.max)
        mats.append(logmel.mean(axis=1))
    X = np.stack(mats)
    k = min(dim, X.shape[0] - 1, X.shape[1])
    pca = PCA(n_components=k, random_state=42)
    Z = pca.fit_transform(X).astype(np.float32)
    if Z.shape[1] < dim:
        Z = np.pad(Z, ((0, 0), (0, dim - Z.shape[1])))
    norms = np.linalg.norm(Z, axis=1, keepdims=True) + 1e-9
    return Z / norms, f"dev-mel-pca-{k}"


def project_2d(embeddings: np.ndarray) -> np.ndarray:
    from sklearn.decomposition import PCA

    k = min(2, embeddings.shape[0], embeddings.shape[1])
    pca = PCA(n_components=k, random_state=42)
    xy = pca.fit_transform(embeddings)
    if xy.shape[1] == 1:
        xy = np.column_stack([xy[:, 0], np.zeros(len(xy))])
    for c in range(2):
        lo, hi = xy[:, c].min(), xy[:, c].max()
        span = hi - lo or 1.0
        xy[:, c] = (xy[:, c] - lo) / span
    return xy.astype(np.float32)


def task_layout(
    embeddings: np.ndarray,
    ids: list[str],
    labels: list[str],
    positive: set[str],
) -> list[dict]:
    from sklearn.decomposition import PCA
    from sklearn.linear_model import LogisticRegression
    from sklearn.preprocessing import StandardScaler

    y = np.array([1 if lab in positive else 0 for lab in labels], dtype=np.int32)
    if len(set(y.tolist())) < 2:
        xy = project_2d(embeddings)
    else:
        X = StandardScaler().fit_transform(embeddings)
        clf = LogisticRegression(max_iter=800, random_state=42, C=0.5)
        clf.fit(X, y)
        x = clf.predict_proba(X)[:, 1]
        residual = X - x[:, None] * clf.coef_
        y2 = PCA(n_components=1, random_state=42).fit_transform(residual)[:, 0]
        y2 = (y2 - y2.min()) / ((y2.max() - y2.min()) or 1.0)
        xy = np.column_stack([x, y2])
    return [
        {"id": i, "x": round(float(a), 4), "y": round(float(b), 4)}
        for i, (a, b) in zip(ids, xy)
    ]


def cosine(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / ((np.linalg.norm(a) * np.linalg.norm(b)) + 1e-9))


def write_wav(path: Path, y: np.ndarray, sr: int) -> None:
    import soundfile as sf

    path.parent.mkdir(parents=True, exist_ok=True)
    sf.write(str(path), y, sr, subtype="PCM_16")


def main() -> int:
    if not SOURCE.exists():
        print("Missing source-clips/. Run download_clips.py first.", file=sys.stderr)
        return 1

    from verify_unwinnable import sweep_ceiling

    manifest = json.loads(MANIFEST.read_text())
    clip_sec = int(manifest.get("clipSeconds", CLIP_SEC))
    tracks = manifest["tracks"]

    waves: list[np.ndarray] = []
    ids: list[str] = []
    raw_feats: list[dict[str, float]] = []
    traces: list[list[float]] = []

    for t in tracks:
        src = SOURCE / f"{t['id']}.mp3"
        if not src.exists():
            print(f"missing {src}", file=sys.stderr)
            return 1
        y, sr = load_audio(src, clip_sec)
        waves.append(y)
        ids.append(t["id"])
        raw_feats.append(hand_features_raw(y, sr))
        traces.append(energy_trace(y))
        wav_name = f"{t['id']}.wav"
        write_wav(AUDIO_OUT / wav_name, y, sr)

    feats_norm = normalize_features(raw_feats)
    meta_rows = []
    for t, feats, trace in zip(tracks, feats_norm, traces):
        wav_name = f"{t['id']}.wav"
        meta_rows.append(
            {
                "id": t["id"],
                "title": Path(t["file"]).stem,
                "artist": "Kevin MacLeod",
                "src": f"/lessons/7/audio/{wav_name}",
                "durationSec": clip_sec,
                "license": manifest["licenseDefault"],
                "licenseUrl": manifest["licenseUrlDefault"],
                "attribution": manifest["attributionTemplate"].format(
                    title=Path(t["file"]).stem
                ),
                "tag": t["tag"],
                "energyTrace": trace,
                "features": feats,
                "roles": t["roles"],
                "workoutBelongs": t.get("workoutBelongs"),
                "labels": t.get("labels"),
            }
        )
        print(f"features {t['id']}: {feats}")

    # Embeddings + CLAP text probes (labels come from the representation, not hand tags)
    queries = [
        "energetic workout gym training music",
        "calm relaxing sleep ambient music",
        "solo acoustic piano",
        "electronic dance beat",
    ]
    try:
        emb, sims, embedder = clap_text_scores(waves, SR, queries)
        print(f"embedder: {embedder}")
        workout_sim = sims[:, 0]
        sleep_sim = sims[:, 1]
        # Soft label: workout if closer to workout query than sleep, with margin cases
        for i, row in enumerate(meta_rows):
            w, s = float(workout_sim[i]), float(sleep_sim[i])
            row["clapScores"] = {
                "workout": round(w, 4),
                "sleep": round(s, 4),
            }
            # Keep curated pedagogical workoutBelongs from the manifest (edge-case set).
            # CLAP scores are stored for Step 7 / debugging — not as the hand-detector labels.
            seed = next(
                (t.get("workoutBelongs") for t in tracks if t["id"] == row["id"]),
                None,
            )
            if seed is not None:
                row["workoutBelongs"] = bool(seed)
            elif w > s + 0.02:
                row["workoutBelongs"] = True
            elif s > w + 0.02:
                row["workoutBelongs"] = False
        print(
            "workoutBelongs:",
            {r["id"]: r["workoutBelongs"] for r in meta_rows if "hand-test" in r["roles"]},
        )
    except Exception as exc:  # noqa: BLE001
        print(f"CLAP unavailable ({exc}); trying OpenL3…")
        try:
            emb, embedder = embed_openl3(waves, SR)
            print(f"embedder: {embedder}")
        except Exception as exc2:  # noqa: BLE001
            print(f"OpenL3 unavailable ({exc2}); using DEV mel-PCA fallback")
            emb, embedder = embed_mel_pca(waves, SR)
            print(f"embedder: {embedder}  ← not for ship")

    layout_xy = project_2d(emb)
    layout_default = [
        {"id": i, "x": round(float(x), 4), "y": round(float(y), 4)}
        for i, (x, y) in zip(ids, layout_xy)
    ]

    moods = [r.get("labels", {}).get("mood", "neutral") for r in meta_rows]
    instruments = [r.get("labels", {}).get("instrument", "other") for r in meta_rows]

    layouts_by_task = {
        "sweat": task_layout(emb, ids, moods, {"sweat"}),
        "sleep": task_layout(emb, ids, moods, {"sleep"}),
        "instrument": task_layout(
            emb,
            ids,
            instruments,
            {"piano", "strings", "pads", "keys", "acoustic"},
        ),
    }

    id_to_idx = {i: n for n, i in enumerate(ids)}
    hidden_pairs = []
    for pair in manifest["hiddenPairs"]:
        a, b = pair["clipA"], pair["clipB"]
        dist = 1.0 - cosine(emb[id_to_idx[a]], emb[id_to_idx[b]])
        hidden_pairs.append({**pair, "embedDistance": round(float(dist), 4)})

    held = set(manifest["heldOutIds"])
    held_rows = [
        r for r in meta_rows if r["id"] in held and r.get("workoutBelongs") is not None
    ]
    ceiling = sweep_ceiling(held_rows) if held_rows else 1.0

    embeddings_map = {
        i: [round(float(v), 6) for v in emb[n]] for n, i in enumerate(ids)
    }

    bundle = {
        "version": 1,
        "embedder": embedder,
        "embedDim": int(emb.shape[1]),
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "notes": (
            "2-D layouts are our drawing of frozen embeddings — not inside the model. "
            "Hand features from librosa. Clips: Kevin MacLeod / Incompetech, CC BY 3.0."
        ),
        "clips": meta_rows,
        "embeddings": embeddings_map,
        "layoutDefault": layout_default,
        "layoutsByTask": layouts_by_task,
        "hiddenPairs": hidden_pairs,
        "heldOutIds": manifest["heldOutIds"],
        "handDetectorCeiling": round(float(ceiling), 4),
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    BUNDLE_OUT.write_text(json.dumps(bundle, indent=2))
    print(f"\nWrote {BUNDLE_OUT} ({BUNDLE_OUT.stat().st_size} bytes)")
    print(f"handDetectorCeiling={ceiling:.3f} (want ≤ 0.60)")
    if embedder.startswith("dev-"):
        print("WARNING: dev embedder — install torch+transformers (CLAP) before ship.")
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
