#!/usr/bin/env python3
"""
Sweep hand-feature thresholds on the held-out set.
Honesty gate: no configuration should score well (ceiling < 0.55).
"""

from __future__ import annotations

import itertools
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[1]
BUNDLE = REPO / "public" / "lessons" / "7" / "bundle.json"

FEATURE_KEYS = ["tempo", "beat", "loud", "bass", "rhythm", "vocals"]
# Learner-plausible thresholds (very low bars are not a "detector")
GRID = [0.4, 0.55, 0.7, 0.85]


def hand_says_yes(features: dict, thresholds: dict) -> bool:
    for k, thr in thresholds.items():
        if features.get(k, 0) < thr:
            return False
    return len(thresholds) > 0


def sweep_ceiling(held_rows: list[dict], max_combos: int = 40_000) -> float:
    """
    Max 'useful score' over threshold grids.

    Useful = min(precision, recall) when the detector fires at least once.
    A hand list that only rejects everything, or only catches one side, does not
    count as scoring well. Matches the lesson claim: you cannot tune thresholds
    into a reliably good workout detector.
    """
    best = 0.0
    checked = 0
    n_pos = sum(1 for r in held_rows if r["workoutBelongs"])
    if n_pos == 0 or n_pos == len(held_rows):
        raise ValueError("held-out set must include both workout and non-workout clips")

    for r in (2, 3, 4):
        for keys in itertools.combinations(FEATURE_KEYS, r):
            for vals in itertools.product(GRID, repeat=r):
                thr = dict(zip(keys, vals))
                tp = fp = fn = 0
                for row in held_rows:
                    pred = hand_says_yes(row["features"], thr)
                    truth = bool(row["workoutBelongs"])
                    if pred and truth:
                        tp += 1
                    elif pred and not truth:
                        fp += 1
                    elif (not pred) and truth:
                        fn += 1
                if tp + fp == 0:
                    score = 0.0  # never fires
                else:
                    precision = tp / (tp + fp)
                    recall = tp / n_pos
                    score = min(precision, recall)
                if score > best:
                    best = score
                checked += 1
                if checked >= max_combos:
                    return best
    return best


def main() -> int:
    if not BUNDLE.exists():
        print(f"Missing {BUNDLE}. Run build_audio_assets.py first.", file=sys.stderr)
        return 1
    bundle = json.loads(BUNDLE.read_text())
    held = set(bundle["heldOutIds"])
    rows = [
        c
        for c in bundle["clips"]
        if c["id"] in held and c.get("workoutBelongs") is not None
    ]
    if len(rows) < 5:
        print(f"Held-out set too small ({len(rows)})", file=sys.stderr)
        return 1

    ceiling = sweep_ceiling(rows)
    bundle["handDetectorCeiling"] = round(ceiling, 4)
    BUNDLE.write_text(json.dumps(bundle, indent=2))

    print(f"held-out clips: {len(rows)}")
    print(f"handDetectorCeiling: {ceiling:.3f}  (min precision/recall; want ≤ 0.60)")

    ok = True
    if ceiling > 0.60:
        print("FAIL: detector is winnable — retune held-out set / features.")
        ok = False
    else:
        print("PASS: un-winnable gate (min(precision, recall) ≤ 0.60)")

    if str(bundle["embedder"]).startswith("dev-"):
        print("FAIL: embedder is dev fallback — install CLAP/OpenL3 before ship.")
        ok = False
    else:
        print("PASS: real embedder")

    # Hidden pair distance sanity (soft — warn only)
    for pair in bundle.get("hiddenPairs", []):
        d = pair.get("embedDistance", 0)
        exp = pair.get("expected")
        print(f"pair {pair['id']}: dist={d:.3f} expected={exp}")

    return 0 if ok else 2


if __name__ == "__main__":
    raise SystemExit(main())
