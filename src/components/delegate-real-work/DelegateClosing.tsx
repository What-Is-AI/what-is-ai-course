"use client";

import Link from "next/link";
import {
  CoworkerContinue,
  CoworkerFrame,
  CoworkerTitle,
} from "@/components/delegate-real-work/CoworkerFrame";
import { useDelegateRealWorkCopy } from "@/lib/useDelegateRealWorkCopy";

export const DELEGATE_CLOSING_PHASES = ["shift", "open-door"] as const;
export type DelegateClosingPhase = (typeof DELEGATE_CLOSING_PHASES)[number];

type Props = {
  phase: DelegateClosingPhase;
  onContinue: () => void;
};

export function DelegateClosing({ phase, onContinue }: Props) {
  const { t } = useDelegateRealWorkCopy();

  if (phase === "shift") {
    return (
      <CoworkerFrame className="justify-center">
        <CoworkerTitle plaque={t("delegateRealWork.closing.shift.plaque")}>
          {t("delegateRealWork.closing.shift.title")}
        </CoworkerTitle>
        <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
          <div className="coworker-fence px-4 py-4">
            <p className="coworker-eyebrow">
              {t("delegateRealWork.closing.shift.oldHabitEyebrow")}
            </p>
            <p className="mt-3 text-base font-semibold text-[color:var(--cw-ink-soft)]">
              {t("delegateRealWork.closing.shift.oldHabit")}
            </p>
          </div>
          <div className="coworker-door px-4 py-4">
            <p className="coworker-eyebrow !text-[color:var(--cw-accent)]">
              {t("delegateRealWork.closing.shift.newHabitEyebrow")}
            </p>
            <p className="mt-3 text-base font-semibold text-[color:var(--cw-accent)]">
              {t("delegateRealWork.closing.shift.newHabit")}
            </p>
          </div>
        </div>
        <CoworkerContinue
          label={t("delegateRealWork.closing.shift.cta")}
          onClick={onContinue}
        />
      </CoworkerFrame>
    );
  }

  return (
    <CoworkerFrame className="justify-center">
      <CoworkerTitle plaque={t("delegateRealWork.closing.openDoor.plaque")}>
        {t("delegateRealWork.closing.openDoor.title")}
      </CoworkerTitle>
      <p className="mt-2 max-w-2xl text-lg italic leading-relaxed text-[color:var(--cw-cool)] sm:text-xl">
        {t("delegateRealWork.closing.openDoor.subhead")}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/lessons/just-because-it-can" className="coworker-btn">
          {t("delegateRealWork.closing.openDoor.ctaPrimary")}
        </Link>
        <Link href="/" className="coworker-btn-secondary">
          {t("delegateRealWork.closing.openDoor.ctaSecondary")}
        </Link>
      </div>
    </CoworkerFrame>
  );
}
