"use client";

import {
  NetworkContinue,
  NetworkFrame,
  NetworkLine,
  NetworkTitle,
} from "@/components/lesson5/NetworkFrame";
import { NetworkFlowViz } from "@/components/lesson5/NetworkFlowViz";
import { useT } from "@/i18n/LocaleProvider";

type Props = { onContinue: () => void };

export function Arrive({ onContinue }: Props) {
  const t = useT();
  return (
    <NetworkFrame>
      <NetworkTitle plaque={t("lesson5.arrive.plaque")}>
        {t("lesson5.arrive.title")}
      </NetworkTitle>
      <NetworkLine>{t("lesson5.arrive.body1")}</NetworkLine>
      <NetworkLine compact>{t("lesson5.arrive.body2")}</NetworkLine>

      <div className="mt-8">
        <NetworkFlowViz />
      </div>

      <p className="network-support mt-8 max-w-2xl">
        {t("lesson5.arrive.support")}
      </p>

      <NetworkContinue
        label={t("lesson5.arrive.cta")}
        onClick={onContinue}
      />
    </NetworkFrame>
  );
}
