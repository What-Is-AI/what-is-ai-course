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

export function MeetCoworker({ onContinue }: Props) {
  const { t, meetBody } = useDelegateRealWorkCopy();
  return (
    <CoworkerFrame>
      <CoworkerTitle plaque={t("delegateRealWork.meet.plaque")}>
        {t("delegateRealWork.meet.title")}
      </CoworkerTitle>
      <CoworkerLine>{t("delegateRealWork.meet.subhead")}</CoworkerLine>

      <ul className="mt-8 max-w-2xl space-y-3">
        {meetBody.map((line) => (
          <li
            key={line}
            className="coworker-panel px-4 py-3 text-sm leading-relaxed text-[color:var(--cw-ink-soft)] sm:text-base"
          >
            {line}
          </li>
        ))}
      </ul>

      <p className="coworker-line mt-8">
        {t("delegateRealWork.meet.honestMechanic")}
      </p>
      <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-[color:var(--cw-accent)]">
        {t("delegateRealWork.meet.framing")}
      </p>

      <CoworkerContinue
        label={t("delegateRealWork.meet.cta")}
        onClick={onContinue}
      />
    </CoworkerFrame>
  );
}
