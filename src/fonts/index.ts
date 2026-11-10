import localFont from "next/font/local";
import type { CSSProperties } from "react";

/**
 * Self-hosted fonts via next/font/local.
 * Avoid next/font/google: Turbopack builds flake when Google returns
 * extensionless /l/font?kit=…&skey=… URLs (vercel/next.js#99114).
 *
 * Latin + latin-ext faces use unicode-range. adjustFontFallback is off so
 * Next’s Arial metric fallback does not steal LT glyphs before latin-ext.
 */

function pack(
  variable: `--${string}`,
  latin: { style: { fontFamily: string }; variable: string },
  ext: { style: { fontFamily: string }; variable: string },
) {
  return {
    variable: `${latin.variable} ${ext.variable}`,
    style: {
      [variable]: `${ext.style.fontFamily}, ${latin.style.fontFamily}`,
    } as CSSProperties,
  };
}

const syneLatin = localFont({
  src: [{ path: "./syne-latin-normal.woff2", weight: "500 800", style: "normal" }],
  variable: "--font-syne",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});
const syneExt = localFont({
  src: [{ path: "./syne-latin-ext-normal.woff2", weight: "500 800", style: "normal" }],
  variable: "--font-syne-ext",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
});
export const syne = pack("--font-syne", syneLatin, syneExt);

const interLatin = localFont({
  src: [{ path: "./inter-latin-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});
const interExt = localFont({
  src: [{ path: "./inter-latin-ext-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-inter-ext",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
});
export const inter = pack("--font-inter", interLatin, interExt);

const figtreeLatin = localFont({
  src: [{ path: "./figtree-latin-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-figtree",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});
const figtreeExt = localFont({
  src: [{ path: "./figtree-latin-ext-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-figtree-ext",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
});
export const figtree = pack("--font-figtree", figtreeLatin, figtreeExt);

const instrumentSerifLatin = localFont({
  src: [{ path: "./instrument-serif-latin-normal.woff2", weight: "400", style: "normal" }, { path: "./instrument-serif-latin-italic.woff2", weight: "400", style: "italic" }],
  variable: "--font-museum",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});
const instrumentSerifExt = localFont({
  src: [{ path: "./instrument-serif-latin-ext-normal.woff2", weight: "400", style: "normal" }, { path: "./instrument-serif-latin-ext-italic.woff2", weight: "400", style: "italic" }],
  variable: "--font-museum-ext",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
});
export const instrumentSerif = pack("--font-museum", instrumentSerifLatin, instrumentSerifExt);

const ibmPlexMonoLatin = localFont({
  src: [{ path: "./ibm-plex-mono-latin-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-lab",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});
const ibmPlexMonoExt = localFont({
  src: [{ path: "./ibm-plex-mono-latin-ext-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-lab-ext",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
});
export const ibmPlexMono = pack("--font-lab", ibmPlexMonoLatin, ibmPlexMonoExt);

const literataLatin = localFont({
  src: [{ path: "./literata-latin-normal.woff2", weight: "400 700", style: "normal" }, { path: "./literata-latin-italic.woff2", weight: "400 700", style: "italic" }],
  variable: "--font-library",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});
const literataExt = localFont({
  src: [{ path: "./literata-latin-ext-normal.woff2", weight: "400 700", style: "normal" }, { path: "./literata-latin-ext-italic.woff2", weight: "400 700", style: "italic" }],
  variable: "--font-library-ext",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
});
export const literata = pack("--font-library", literataLatin, literataExt);

const spaceGroteskLatin = localFont({
  src: [{ path: "./space-grotesk-latin-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-facility",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});
const spaceGroteskExt = localFont({
  src: [{ path: "./space-grotesk-latin-ext-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-facility-ext",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
});
export const spaceGrotesk = pack("--font-facility", spaceGroteskLatin, spaceGroteskExt);

const plusJakartaLatin = localFont({
  src: [{ path: "./plus-jakarta-sans-latin-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-studio",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});
const plusJakartaExt = localFont({
  src: [{ path: "./plus-jakarta-sans-latin-ext-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-studio-ext",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
});
export const plusJakarta = pack("--font-studio", plusJakartaLatin, plusJakartaExt);

const sourceSansLatin = localFont({
  src: [{ path: "./source-sans-3-latin-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-workshop",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});
const sourceSansExt = localFont({
  src: [{ path: "./source-sans-3-latin-ext-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-workshop-ext",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
});
export const sourceSans = pack("--font-workshop", sourceSansLatin, sourceSansExt);

const sourceSerifLatin = localFont({
  src: [{ path: "./source-serif-4-latin-normal.woff2", weight: "400 700", style: "normal" }, { path: "./source-serif-4-latin-italic.woff2", weight: "400 700", style: "italic" }],
  variable: "--font-reading",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});
const sourceSerifExt = localFont({
  src: [{ path: "./source-serif-4-latin-ext-normal.woff2", weight: "400 700", style: "normal" }, { path: "./source-serif-4-latin-ext-italic.woff2", weight: "400 700", style: "italic" }],
  variable: "--font-reading-ext",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
});
export const sourceSerif = pack("--font-reading", sourceSerifLatin, sourceSerifExt);

const jetbrainsMonoLatin = localFont({
  src: [{ path: "./jetbrains-mono-latin-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-workshop-mono",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});
const jetbrainsMonoExt = localFont({
  src: [{ path: "./jetbrains-mono-latin-ext-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-workshop-mono-ext",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
});
export const jetbrainsMono = pack("--font-workshop-mono", jetbrainsMonoLatin, jetbrainsMonoExt);

const robotoLatin = localFont({
  src: [{ path: "./roboto-latin-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-connected",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
});
const robotoExt = localFont({
  src: [{ path: "./roboto-latin-ext-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-connected-ext",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
});
export const roboto = pack("--font-connected", robotoLatin, robotoExt);
