"use client";

import { useState } from "react";
import {
  MuseumContinue,
  MuseumFrame,
  MuseumLine,
  MuseumTitle,
} from "@/components/lesson1/MuseumFrame";
import { useT } from "@/i18n/LocaleProvider";
import { saveLocal } from "@/lib/storage";

type Props = {
  onContinue: () => void;
};

export function Reflection({ onContinue }: Props) {
  const t = useT();
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");

  function save() {
    saveLocal("lesson1-reflection", {
      before: before.trim(),
      after: after.trim(),
      savedAt: new Date().toISOString(),
    });
    onContinue();
  }

  return (
    <MuseumFrame>
      <MuseumTitle plaque={t("lesson1.reflection.plaque")}>
        {t("lesson1.reflection.title")}
      </MuseumTitle>
      <MuseumLine>{t("lesson1.reflection.sub")}</MuseumLine>

      <div className="mt-10 grid max-w-2xl gap-6">
        <label className="museum-glass block px-5 py-5">
          <span className="museum-eyebrow mb-3 block">
            {t("lesson1.reflection.beforeLabel")}
          </span>
          <textarea
            value={before}
            onChange={(e) => setBefore(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border-0 bg-transparent px-0 py-1 font-[family-name:var(--font-museum)] text-xl tracking-tight text-ink outline-none placeholder:text-ink-soft/50"
            placeholder={t("lesson1.reflection.beforePlaceholder")}
          />
        </label>

        <label className="museum-glass museum-float block px-5 py-5">
          <span className="museum-eyebrow mb-3 block">
            {t("lesson1.reflection.afterLabel")}
          </span>
          <textarea
            value={after}
            onChange={(e) => setAfter(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border-0 bg-transparent px-0 py-1 font-[family-name:var(--font-museum)] text-xl tracking-tight text-ink outline-none placeholder:text-ink-soft/50"
            placeholder={t("lesson1.reflection.afterPlaceholder")}
          />
        </label>
      </div>

      <MuseumContinue
        label={t("lesson1.reflection.cta")}
        disabled={!before.trim() || !after.trim()}
        onClick={save}
      />
    </MuseumFrame>
  );
}
