"use client";

import {
  FacilityContinue,
  FacilityFrame,
  FacilityTitle,
} from "@/components/lesson4/FacilityFrame";
import { useLesson4Copy } from "@/lib/useLesson4Copy";

type Props = {
  onContinue: () => void;
};

export function History({ onContinue }: Props) {
  const { t, historyEras } = useLesson4Copy();
  return (
    <FacilityFrame>
      <FacilityTitle plaque={t("lesson4.history.plaque")}>
        {t("lesson4.history.title")}
      </FacilityTitle>

      <ol className="mt-2 max-w-3xl space-y-5">
        {historyEras.map((era) => (
          <li key={era.id} className="facility-panel px-5 py-5">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--fac-accent)]">
              {era.year}
            </p>
            <p className="mt-1 text-lg font-semibold">{era.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--fac-ink-soft)]">
              {era.blurb}
            </p>
          </li>
        ))}
      </ol>

      <p className="facility-line mt-8">{t("lesson4.history.close")}</p>
      <FacilityContinue onClick={onContinue} />
    </FacilityFrame>
  );
}
