# Lesson 7 — offline audio assets

Builds real embeddings + hand features + energy traces for The Listening Room.

```bash
# from repo root
python3 -m venv .venv-l7
source .venv-l7/bin/activate
pip install -r scripts/lesson7/requirements.txt
pip install torch transformers   # CLAP (required for ship)

python scripts/lesson7/download_clips.py
python scripts/lesson7/build_audio_assets.py
python scripts/lesson7/verify_unwinnable.py
```

Outputs → `public/lessons/7/bundle.json` + `public/lessons/7/audio/*.wav`

Clips: Kevin MacLeod / Incompetech, **CC BY 3.0** (attribution stored per clip in the bundle).

**Honesty gates** (must pass before shipping Steps 3–6):

1. `handDetectorCeiling` ≤ 0.60 (min precision/recall over threshold grids)
2. Embeddings from CLAP — never hand-placed 2-D points / never `dev-*` embedder
3. Step 5 scores computed live from learner thresholds + trained head (`lesson7-train.ts`)

Raw `source-clips/` and `.venv-l7/` are gitignored; ship the built `public/lessons/7/` artifacts.
