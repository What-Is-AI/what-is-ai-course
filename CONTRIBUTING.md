# Contributing

Thanks for helping with **What is AI**.

All contributions to lessons and translations are submitted through **pull requests** on this repository. A signed **[Contributor License Agreement (CLA)](./CLA.md)** is required before we merge.

## CLA (required)

1. Read [CLA.md](./CLA.md).
2. On your pull request, comment exactly:

   ```text
   I have read the CLA Document and I hereby sign the CLA
   ```

3. Wait for the CLA check to pass. Comment `recheck` if it does not update.

If your employer owns the work, do **not** use the comment sign-off — email **info@proaiassistant.com** for the Entity CLA (details in [CLA.md](./CLA.md)).

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
4. Sign the CLA on the PR (see above).

## Submitting a lesson PR

1. Open an **issue** first with the learning goal and the probe → interact → teach outline.
2. Implement the lesson (route + registration in `src/lib/lessons.ts`; keep drafts out of the public nav until ready).
3. Open a pull request that links the issue and states the three-beat arc.
4. Sign the CLA on the PR (see above).

## Before you open a PR

- `npm run lint` and `npm run build`
- Keep the PR focused on one lesson or one translation area when you can
