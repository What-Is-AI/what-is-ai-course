"use client";

import {
  MuseumContinue,
  MuseumFrame,
  MuseumTitle,
} from "@/components/lesson1/MuseumFrame";
import { RichText } from "@/i18n/RichText";
import { useT } from "@/i18n/LocaleProvider";

type Props = {
  onContinue: () => void;
};

export function Consolidation({ onContinue }: Props) {
  const t = useT();
  return (
    <MuseumFrame>
      <MuseumTitle
        plaque={t("lesson1.consolidation.plaque")}
        focusKey="consolidation"
      >
        {t("lesson1.consolidation.title")}
      </MuseumTitle>
      <div className="museum-line -mt-4 max-w-2xl space-y-4">
        <p>{t("lesson1.consolidation.p1")}</p>
        <RichText as="p" text={t("lesson1.consolidation.p2")} />
        <RichText as="p" text={t("lesson1.consolidation.p3")} />
        <RichText as="p" text={t("lesson1.consolidation.p4")} />
      </div>
      <MuseumContinue
        label={t("lesson1.consolidation.cta")}
        onClick={onContinue}
      />
    </MuseumFrame>
  );
}
