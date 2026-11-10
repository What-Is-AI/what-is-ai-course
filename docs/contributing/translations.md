# Translations

UI copy lives under `messages/`. Locales are selected in the app (not via URL). Missing keys fall back to English at lookup time.

## Current layout

| Location | Contents |
|---|---|
| `messages/en.json`, `es.json`, `lt.json` | Shared UI + early lessons (1–4) |
| `messages/<lesson-slug>/<locale>.json` | Later lessons and practices (e.g. `lesson5/`, `working-with-llms/`) |

Supported locale codes are listed in `src/i18n/config.ts` (`LOCALES`). Catalogs are merged in `src/i18n/translate.ts`. Every locale that is registered must have its own JSON packs — do not wire English files into another locale’s merge slot.

## Translator workflow (JSON only)

1. Scaffold missing files from English:

   ```bash
   node scripts/i18n/scaffold-locale.mjs lt
   ```

   This copies each `messages/**/en.json` to `<locale>.json` when the target is missing. Use `--force` only if you intentionally want to reset a locale file to English.

2. Edit only the target locale JSON. Keep keys and nesting identical to English.
3. Keep placeholders like `{name}` unchanged.
4. Keep rich-text markers the English file uses (e.g. tags consumed by `RichText`) intact.
5. Prefer a PR that finishes one lesson (or shared UI) completely over scattered partial files.

Partial locales are OK while work is in progress: untranslated keys still show English via runtime fallback when a key is absent. Prefer leaving a key out over pasting English into a “translated” file once real translation work starts.

## Adding a brand-new language

1. Run the scaffold script for the new code (e.g. `de`):

   ```bash
   npm run i18n:scaffold -- de
   ```

2. Add the code to `LOCALES` in `src/i18n/config.ts`.
3. Import and merge the new packs in `src/i18n/translate.ts` (same pattern as `es` / `lt`).
4. Add a switcher label in every core locale file you ship, e.g. `"deShort": "DE"` under `common` in `messages/en.json` (and the other locale cores).
5. Translate the JSON files (or leave English scaffolding until a full pass).

Translating an **existing** locale (e.g. finishing `lt`) is JSON-only: edit `messages/**/lt.json`. No TypeScript changes.

## Style

- Match the tone: curious, direct, short lines on stage.
- Prefer natural phrasing in the target language over word-for-word calques.
- Do not invent new keys in a translation-only PR; ask in an issue if copy structure must change.
