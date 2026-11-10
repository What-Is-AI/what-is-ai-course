#!/usr/bin/env python3
"""Download curated CC BY clips into scripts/lesson7/source-clips/."""

from __future__ import annotations

import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MANIFEST = ROOT / "curated_manifest.json"
OUT = ROOT / "source-clips"
UA = "WhatIsAI-Lesson7/0.1 (educational; kevin@local)"


def main() -> int:
    data = json.loads(MANIFEST.read_text())
    base = data["baseUrl"].rstrip("/")
    OUT.mkdir(parents=True, exist_ok=True)

    ok = 0
    for track in data["tracks"]:
        dest = OUT / f"{track['id']}.mp3"
        if dest.exists() and dest.stat().st_size > 50_000:
            print(f"skip {track['id']} (exists)")
            ok += 1
            continue
        url = f"{base}/{urllib.parse.quote(track['file'])}"
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                dest.write_bytes(resp.read())
            print(f"ok   {track['id']} ({dest.stat().st_size} bytes)")
            ok += 1
        except Exception as exc:  # noqa: BLE001
            print(f"FAIL {track['id']}: {exc}", file=sys.stderr)

    print(f"\nDownloaded/present: {ok}/{len(data['tracks'])}")
    return 0 if ok == len(data["tracks"]) else 1


if __name__ == "__main__":
    raise SystemExit(main())
