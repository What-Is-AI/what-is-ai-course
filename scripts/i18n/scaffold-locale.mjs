#!/usr/bin/env node
/**
 * Scaffold a locale from English message files.
 *
 * Usage:
 *   node scripts/i18n/scaffold-locale.mjs <locale>
 *   node scripts/i18n/scaffold-locale.mjs lt --force
 *
 * Copies each messages/.../en.json to <locale>.json when missing.
 * With --force, overwrites existing locale files (destructive).
 * Does not edit src/i18n/config.ts or translate.ts — register new locales there.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const MESSAGES = path.join(ROOT, "messages");

const args = process.argv.slice(2).filter((a) => a !== "--");
const force = args.includes("--force");
const locale = args.find((a) => !a.startsWith("-"));

if (!locale || !/^[a-z]{2}(-[A-Z]{2})?$/.test(locale)) {
  console.error(
    "Usage: node scripts/i18n/scaffold-locale.mjs <locale> [--force]\n" +
      "  locale: two-letter code (e.g. lt, de) or regional (e.g. pt-BR)",
  );
  process.exit(1);
}

if (locale === "en") {
  console.error("Refusing to scaffold locale 'en' (source of truth).");
  process.exit(1);
}

/** @returns {string[]} absolute paths to en.json under messages/ */
function findEnglishPacks() {
  const out = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === "en.json") out.push(full);
    }
  }
  walk(MESSAGES);
  return out.sort();
}

const packs = findEnglishPacks();
let created = 0;
let skipped = 0;
let overwritten = 0;

for (const enPath of packs) {
  const targetPath = path.join(path.dirname(enPath), `${locale}.json`);
  const rel = path.relative(ROOT, targetPath);
  const exists = fs.existsSync(targetPath);

  if (exists && !force) {
    console.log(`skip  ${rel} (exists; pass --force to overwrite)`);
    skipped += 1;
    continue;
  }

  fs.copyFileSync(enPath, targetPath);
  if (exists) {
    console.log(`force ${rel}`);
    overwritten += 1;
  } else {
    console.log(`add   ${rel}`);
    created += 1;
  }
}

console.log(
  `\nDone: ${created} created, ${overwritten} overwritten, ${skipped} skipped.`,
);
console.log(
  "Next: translate the new JSON files, then register the locale in\n" +
    "  src/i18n/config.ts and src/i18n/translate.ts if it is new.",
);
