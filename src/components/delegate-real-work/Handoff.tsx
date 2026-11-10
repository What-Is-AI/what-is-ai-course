"use client";

import { useState } from "react";
import {
  CoworkerContinue,
  CoworkerFrame,
  CoworkerLine,
  CoworkerTitle,
} from "@/components/delegate-real-work/CoworkerFrame";
import { COWORK_HREF } from "@/lib/delegate-real-work-data";
import { useDelegateRealWorkCopy } from "@/lib/useDelegateRealWorkCopy";

type Props = {
  onContinue: () => void;
};

export function Handoff({ onContinue }: Props) {
  const { t, handoffSetup } = useDelegateRealWorkCopy();
  const [copied, setCopied] = useState(false);
  const instruction = t("delegateRealWork.handoff.instruction");

  async function copyInstruction() {
    try {
      await navigator.clipboard.writeText(instruction);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <CoworkerFrame>
      <CoworkerTitle plaque={t("delegateRealWork.handoff.plaque")}>
        {t("delegateRealWork.handoff.title")}
      </CoworkerTitle>
      <CoworkerLine>{t("delegateRealWork.handoff.subhead")}</CoworkerLine>

      <ol className="mt-8 max-w-2xl list-decimal space-y-3 pl-5">
        {handoffSetup.map((step) => (
          <li
            key={step}
            className="pl-1 text-sm leading-relaxed text-[color:var(--cw-ink-soft)] sm:text-base"
          >
            {step}
          </li>
        ))}
      </ol>

      <div className="coworker-panel mt-8 max-w-3xl p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="coworker-eyebrow">
            {t("delegateRealWork.handoff.instructionLabel")}
          </p>
          <button
            type="button"
            className="coworker-btn-secondary !px-3 !py-2 text-sm"
            onClick={copyInstruction}
            aria-label={
              copied
                ? t("delegateRealWork.handoff.copiedLabel")
                : t("delegateRealWork.handoff.copyLabel")
            }
          >
            {copied
              ? t("delegateRealWork.handoff.copiedLabel")
              : t("delegateRealWork.handoff.copyLabel")}
          </button>
        </div>
        <pre className="coworker-mono mt-4 whitespace-pre-wrap text-[color:var(--cw-ink)]">
          {instruction}
        </pre>
        <span className="sr-only" role="status" aria-live="polite">
          {copied ? t("delegateRealWork.handoff.copiedLabel") : ""}
        </span>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={COWORK_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="coworker-btn"
          title={t("delegateRealWork.handoff.coworkHrefNote")}
          aria-label={`${t("delegateRealWork.handoff.cta")}. ${t("delegateRealWork.handoff.coworkHrefNote")}`}
        >
          {t("delegateRealWork.handoff.cta")}
        </a>
      </div>

      <p className="coworker-line mt-6">
        {t("delegateRealWork.handoff.honestLimit")}
      </p>

      <CoworkerContinue onClick={onContinue} />
    </CoworkerFrame>
  );
}
