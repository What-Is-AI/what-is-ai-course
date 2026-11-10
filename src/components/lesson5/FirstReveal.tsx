"use client";

import {
  NetworkContinue,
  NetworkFrame,
  NetworkTitle,
} from "@/components/lesson5/NetworkFrame";
import { useT } from "@/i18n/LocaleProvider";

type Props = { onContinue: () => void };

export function FirstReveal({ onContinue }: Props) {
  const t = useT();
  return (
    <NetworkFrame className="network-reveal">
      <NetworkTitle plaque={t("lesson5.firstReveal.plaque")}>
        {t("lesson5.firstReveal.title")}
      </NetworkTitle>

      <div className="network-reveal-reading">
        <ol className="network-reveal-points">
          <li>{t("lesson5.firstReveal.body1")}</li>
          <li>{t("lesson5.firstReveal.body2")}</li>
          <li>{t("lesson5.firstReveal.body3")}</li>
        </ol>

        <p className="network-reveal-clarify">
          {t("lesson5.firstReveal.clarify")}
        </p>

        <p className="network-reveal-takeaway">
          {t("lesson5.firstReveal.takeaway")}
        </p>
      </div>

      <NetworkContinue
        label={t("lesson5.firstReveal.cta")}
        onClick={onContinue}
      />
    </NetworkFrame>
  );
}
