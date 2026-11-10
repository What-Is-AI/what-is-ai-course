"use client";

import { useEffect, useState } from "react";
import {
  LESSON7_AUDIO_PATHS,
  type ClipRecord,
  type Lesson7AudioBundle,
} from "@/lib/lesson7-audio";

export type MusicCreditsCopy = {
  title: string;
  body: string;
  licenseLabel: string;
  artistLine: string;
};

type Props = {
  copy: MusicCreditsCopy;
  className?: string;
  /** denser list for About; compact for in-lesson closing */
  variant?: "compact" | "full";
};

type CreditRow = {
  title: string;
  attribution: string;
  license: string;
  licenseUrl: string;
};

/**
 * Visible CC BY 3.0 attribution for Kevin MacLeod clips used in Lesson 7.
 * Titles/attributions come from the shipped audio bundle.
 */
export function MusicCredits({
  copy,
  className = "",
  variant = "compact",
}: Props) {
  const [rows, setRows] = useState<CreditRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch(LESSON7_AUDIO_PATHS.bundle)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<Lesson7AudioBundle>;
      })
      .then((bundle) => {
        if (cancelled) return;
        const byTitle = new Map<string, CreditRow>();
        for (const clip of bundle.clips as ClipRecord[]) {
          if (byTitle.has(clip.title)) continue;
          byTitle.set(clip.title, {
            title: clip.title,
            attribution: clip.attribution,
            license: clip.license,
            licenseUrl: clip.licenseUrl,
          });
        }
        setRows(
          [...byTitle.values()].sort((a, b) =>
            a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
          ),
        );
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const licenseHref =
    rows?.[0]?.licenseUrl ?? "https://creativecommons.org/licenses/by/3.0/";
  const licenseName = rows?.[0]?.license ?? "CC BY 3.0";

  return (
    <section
      className={`lr-music-credits lr-music-credits-${variant} ${className}`.trim()}
      aria-labelledby="lr-music-credits-title"
    >
      <h2 id="lr-music-credits-title" className="lr-music-credits-title">
        {copy.title}
      </h2>
      <p className="lr-music-credits-body">{copy.body}</p>
      <p className="lr-music-credits-artist">{copy.artistLine}</p>
      <p className="lr-music-credits-license">
        {copy.licenseLabel}{" "}
        <a href={licenseHref} target="_blank" rel="noopener noreferrer">
          {licenseName}
        </a>
        {" · "}
        <a
          href="https://incompetech.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          incompetech.com
        </a>
      </p>
      {rows && rows.length > 0 ? (
        <ul className="lr-music-credits-list">
          {rows.map((row) => (
            <li key={row.title}>
              <span className="lr-music-credits-track">{row.title}</span>
              {variant === "full" ? (
                <span className="lr-music-credits-attr">
                  {" "}
                  — {row.attribution}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
