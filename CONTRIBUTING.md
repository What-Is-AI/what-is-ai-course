# Contributing

Thanks for helping with **What is AI**.

All contributions to lessons and translations are submitted through **pull requests** on this repository. By opening a PR, you agree a **Contributor License Agreement (CLA)** is required before we can merge — we will send CLA details when you open your first contribution (or reply on the PR if you have not signed yet).

## Ways to help

| Area | How |
|---|---|
| Translations | Follow [docs/contributing/translations.md](docs/contributing/translations.md), then open a PR |
| New theoretical lessons | Follow [docs/contributing/lesson-principles.md](docs/contributing/lesson-principles.md), then open a PR |
| Bugs / UX fixes | Open an issue, then a PR for the lesson or shared UI |

**Theoretical lessons:** probe → interact → teach. You do not need to build them like the existing ones in code.

**Please don’t open PRs** for operator-only analytics or admin tooling.

## Setup

```bash
npm install
npm run dev
```

No `.env` needed for local lesson or translation work.

## Submitting a translation PR

1. Add or update locale files under `messages/` (same keys as English; keep `{placeholders}`).
2. Register a new locale in `src/i18n/config.ts` and `src/i18n/translate.ts` if needed.
3. Open a pull request describing the language and which lessons you covered.
4. Complete the CLA when asked.

## Submitting a lesson PR

1. Open an **issue** first with the learning goal and the probe → interact → teach outline.
2. Implement the lesson (route + registration in `src/lib/lessons.ts`; keep drafts out of the public nav until ready).
3. Open a pull request that links the issue and states the three-beat arc.
4. Complete the CLA when asked.

## Before you open a PR

- `npm run lint` and `npm run build`
- Keep the PR focused on one lesson or one translation area when you can
