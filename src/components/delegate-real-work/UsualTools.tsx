"use client";

import { useState } from "react";
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

export function UsualTools({ onContinue }: Props) {
  const { t, usualTools } = useDelegateRealWorkCopy();
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const allRevealed = usualTools.every((item) => revealed[item.id]);

  return (
    <CoworkerFrame>
      <CoworkerTitle plaque={t("delegateRealWork.usualTools.plaque")}>
        {t("delegateRealWork.usualTools.title")}
      </CoworkerTitle>
      <CoworkerLine>{t("delegateRealWork.usualTools.subhead")}</CoworkerLine>

      <ul className="mt-8 grid max-w-2xl gap-3">
        {usualTools.map((item, i) => {
          const open = revealed[item.id];
          const mark = String.fromCharCode(65 + i);
          return (
            <li key={item.id}>
              <button
                type="button"
                className={`coworker-choice coworker-choice-marked w-full${
                  open ? " is-selected" : " coworker-choice-invite"
                }`}
                aria-expanded={open}
                onClick={() =>
                  setRevealed((prev) => ({ ...prev, [item.id]: true }))
                }
              >
                <span className="coworker-choice-mark" aria-hidden>
                  {mark}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold">{item.tool}</span>
                  {open ? (
                    <span className="mt-2 block text-sm font-normal leading-relaxed text-[color:var(--cw-ink-soft)]">
                      {item.why}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {allRevealed ? (
        <div className="mt-8 max-w-2xl space-y-4">
          <p className="text-lg font-semibold leading-snug text-[color:var(--cw-accent)] sm:text-xl">
            {t("delegateRealWork.usualTools.punchline")}
          </p>
          <CoworkerContinue
            label={t("delegateRealWork.usualTools.cta")}
            onClick={onContinue}
          />
        </div>
      ) : null}
    </CoworkerFrame>
  );
}
