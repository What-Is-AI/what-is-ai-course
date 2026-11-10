"use client";

import { useState } from "react";
import Link from "next/link";
import {
  NetworkContinue,
  NetworkFrame,
  NetworkLine,
  NetworkTitle,
} from "@/components/lesson5/NetworkFrame";
import { useT } from "@/i18n/LocaleProvider";

type Props = { onContinue?: () => void };

export function Lesson5Closing({ onContinue }: Props) {
  const t = useT();
  const [phase, setPhase] = useState<"takeaways" | "final">("takeaways");

  if (phase === "takeaways") {
    return (
      <NetworkFrame className="network-keep">
        <NetworkTitle plaque={t("lesson5.closing.takeawaysPlaque")} compact>
          {t("lesson5.closing.takeawaysTitle")}
        </NetworkTitle>

        <div className="network-keep-layout">
          <ol className="network-keep-points">
            {(["1", "2", "3", "4", "5", "6"] as const).map((id) => (
              <li key={id}>{t(`lesson5.closing.takeaways.${id}`)}</li>
            ))}
          </ol>
          <aside className="network-keep-side">
            <NetworkContinue
              label={t("lesson5.closing.ctaTakeaways")}
              onClick={() => setPhase("final")}
              className="network-keep-cta"
            />
          </aside>
        </div>
      </NetworkFrame>
    );
  }

  return (
    <NetworkFrame>
      <NetworkTitle plaque={t("lesson5.closing.finalPlaque")}>
        {t("lesson5.closing.finalTitle")}
      </NetworkTitle>
      <NetworkLine>{t("lesson5.closing.finalBody1")}</NetworkLine>
      <NetworkLine compact>{t("lesson5.closing.finalBody2")}</NetworkLine>
      <p className="network-sequence mt-8" aria-hidden>
        {t("lesson5.closing.sequence")}
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <div className="flex flex-col items-start gap-1.5">
          <p className="network-eyebrow">{t("lesson5.closing.nextWorld")}</p>
          <Link href="/lessons/6" className="network-btn inline-flex">
            {t("lesson5.closing.nextLabel")}
          </Link>
        </div>
        <Link href="/" className="network-btn-secondary inline-flex self-end">
          {t("lesson5.closing.home")}
        </Link>
      </div>
      <p className="mt-3 max-w-md text-sm text-[var(--network-dim)]">
        {t("lesson5.closing.nextHint")}
      </p>
      {onContinue ? null : null}
    </NetworkFrame>
  );
}
