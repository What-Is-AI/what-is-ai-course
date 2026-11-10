# Lesson principles (theoretical lessons)

These are the **overall** rules already used across the course. New theoretical lessons should follow this arc. They do **not** need to copy the technical architecture of existing lessons (shells, themes, component layouts).

Product line: **ask first, explain later.**

## Required arc

For theoretical lessons, structure the experience in three beats:

1. **Probe** — Test what the learner thinks they know (instinct, prediction, judgment) before teaching.
2. **Interact** — Let them try: choose, operate, sort, compare, break something, watch what happens.
3. **Teach** — Short teaching moments / reveals **after** the try. Name the idea once it has been felt.

Do not open with a lecture. Do not dump the answer before the learner has acted.

Practical / tool lessons can be looser, but when the goal is understanding a concept, keep this arc.

## What “good” feels like

Drawn from how existing lessons are written:

- **Experience before vocabulary** — the learner does or sees the idea; labels come after.
- **Curiosity over condescension** — direct, never talking down.
- **Clear next action** — the learner always knows what to do now, and can tell a *choice* from *continue* from *scenery*.
- **One idea at a time** — each beat has one job; reveals are short.

Each lesson should have its own dedicated visual theme — a distinct look that helps memory. Invent a new presentation for new lessons; you do not need to reuse an existing lesson’s theme or naming.

## Shipping a new lesson (light checklist)

Implementation may differ. Process should stay familiar:

1. Open an issue describing the probe → interact → teach arc (before a large PR).
2. Add a route under `src/app/lessons/…` and register it in `src/lib/lessons.ts`.
3. Keep drafts out of the public nav (`hidden` / non-public paths) until ready.
4. Add English copy under `messages/` and wire the locale merge if needed (see [translations.md](./translations.md)).
5. Run `npm run lint` and `npm run build`.

## Out of scope

Please don’t open PRs for operator-only analytics or admin tooling. Lessons do not need that to work.
