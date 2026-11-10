"use client";

import {
  CoworkerContinue,
  CoworkerFrame,
  CoworkerLine,
  CoworkerTitle,
} from "@/components/delegate-real-work/CoworkerFrame";
import { useDelegateRealWorkCopy } from "@/lib/useDelegateRealWorkCopy";

type Props = {
  onContinue: () => void;
};

export function ThePile({ onContinue }: Props) {
  const { t } = useDelegateRealWorkCopy();
  return (
    <CoworkerFrame className="justify-center">
      <CoworkerTitle plaque={t("delegateRealWork.pile.plaque")}>
        {t("delegateRealWork.pile.title")}
      </CoworkerTitle>
      <CoworkerLine>{t("delegateRealWork.pile.subhead")}</CoworkerLine>
      <CoworkerLine>{t("delegateRealWork.pile.body")}</CoworkerLine>
      <CoworkerContinue
        label={t("delegateRealWork.pile.cta")}
        onClick={onContinue}
      />
    </CoworkerFrame>
  );
}
