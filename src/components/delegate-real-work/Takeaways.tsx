"use client";

import {
  CoworkerContinue,
  CoworkerFrame,
  CoworkerTitle,
} from "@/components/delegate-real-work/CoworkerFrame";
import { useDelegateRealWorkCopy } from "@/lib/useDelegateRealWorkCopy";

type Props = {
  onContinue: () => void;
};

export function Takeaways({ onContinue }: Props) {
  const { t, takeaways } = useDelegateRealWorkCopy();
  return (
    <CoworkerFrame>
      <CoworkerTitle plaque={t("delegateRealWork.takeaways.plaque")}>
        {t("delegateRealWork.takeaways.title")}
      </CoworkerTitle>
      <ol className="mt-6 max-w-2xl list-decimal space-y-3 pl-5">
        {takeaways.map((item) => (
          <li
            key={item}
            className="pl-1 text-sm leading-relaxed text-[color:var(--cw-ink-soft)] sm:text-base"
          >
            {item}
          </li>
        ))}
      </ol>
      <CoworkerContinue onClick={onContinue} />
    </CoworkerFrame>
  );
}
