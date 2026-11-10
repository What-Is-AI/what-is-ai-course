import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Serves the standalone presentation HTML (no course chrome / root body wrappers).
 * Source of truth: ../what-is-ai-deck.html — edit that file only inside presentation2026malaga/.
 */
export async function GET() {
  const file = path.join(
    process.cwd(),
    "src/app/presentation2026malaga/what-is-ai-deck.html",
  );
  const html = await readFile(file, "utf8");
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}
