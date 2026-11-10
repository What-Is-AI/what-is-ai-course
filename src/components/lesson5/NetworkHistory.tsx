"use client";

import {
  NetworkContinue,
  NetworkFrame,
  NetworkTitle,
} from "@/components/lesson5/NetworkFrame";
import { useT } from "@/i18n/LocaleProvider";

type Props = { onContinue: () => void };

const BEATS = [
  "1940s",
  "1957",
  "1969",
  "1980s",
  "2000s",
  "2010s",
  "2020s",
] as const;

export function NetworkHistory({ onContinue }: Props) {
  const t = useT();
  return (
    <NetworkFrame className="network-history">
      <NetworkTitle plaque={t("lesson5.history.plaque")} compact>
        {t("lesson5.history.title")}
      </NetworkTitle>

      <div className="network-history-layout">
        <ol className="network-history-beats">
          {BEATS.map((year) => (
            <li key={year} className="network-history-beat">
              <p className="network-history-year">{year}</p>
              <p className="network-history-text">
                {t(`lesson5.history.beats.${year}`)}
              </p>
            </li>
          ))}
        </ol>

        <aside className="network-history-side">
          <p className="network-history-point">
            {t("lesson5.history.point")}
          </p>
          <NetworkContinue
            label={t("lesson5.history.cta")}
            onClick={onContinue}
            className="network-history-cta"
          />
        </aside>
      </div>
    </NetworkFrame>
  );
}
