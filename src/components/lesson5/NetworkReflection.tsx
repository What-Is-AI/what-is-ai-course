"use client";

import { useState } from "react";
import {
  NetworkContinue,
  NetworkFrame,
  NetworkLine,
  NetworkTitle,
} from "@/components/lesson5/NetworkFrame";
import { saveLocal } from "@/lib/storage";
import { useT } from "@/i18n/LocaleProvider";

type Props = { onContinue: () => void };

export function NetworkReflection({ onContinue }: Props) {
  const t = useT();
  const [before, setBefore] = useState("");
  const [sentence, setSentence] = useState("");
  const ready = before.trim().length > 0 && sentence.trim().length > 0;

  return (
    <NetworkFrame>
      <NetworkTitle plaque={t("lesson5.reflection.plaque")}>
        {t("lesson5.reflection.ask")}
      </NetworkTitle>
      <textarea
        className="network-input mt-2 min-h-[5rem] w-full max-w-xl"
        value={before}
        onChange={(e) => setBefore(e.target.value)}
        placeholder={t("lesson5.reflection.beforePlaceholder")}
        aria-label={t("lesson5.reflection.ask")}
      />
      <NetworkLine>{t("lesson5.reflection.prompt")}</NetworkLine>
      <textarea
        className="network-input mt-2 min-h-[5rem] w-full max-w-xl"
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        placeholder={t("lesson5.reflection.placeholder")}
        aria-label={t("lesson5.reflection.prompt")}
      />
      <NetworkContinue
        label={t("lesson5.reflection.cta")}
        disabled={!ready}
        onClick={() => {
          if (!ready) return;
          saveLocal("lesson5-reflection", { before, sentence });
          onContinue();
        }}
      />
    </NetworkFrame>
  );
}
