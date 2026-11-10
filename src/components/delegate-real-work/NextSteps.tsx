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

export function NextSteps({ onContinue }: Props) {
  const { t, nextStepRows } = useDelegateRealWorkCopy();
  return (
    <CoworkerFrame>
      <CoworkerTitle plaque={t("delegateRealWork.nextSteps.plaque")}>
        {t("delegateRealWork.nextSteps.title")}
      </CoworkerTitle>

      <div className="coworker-panel mt-8 max-w-3xl overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[color:var(--cw-line)]">
              <th className="px-4 py-3 font-semibold text-[color:var(--cw-accent)]">
                {t("delegateRealWork.nextSteps.columns.upgrade")}
              </th>
              <th className="px-4 py-3 font-semibold text-[color:var(--cw-ink)]">
                {t("delegateRealWork.nextSteps.columns.adds")}
              </th>
              <th className="px-4 py-3 font-semibold text-[color:var(--cw-ink)]">
                {t("delegateRealWork.nextSteps.columns.needs")}
              </th>
            </tr>
          </thead>
          <tbody>
            {nextStepRows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[color:var(--cw-line)] last:border-0"
              >
                <th className="px-4 py-3 align-top font-semibold text-[color:var(--cw-ink)]">
                  {row.upgrade}
                </th>
                <td className="px-4 py-3 align-top text-[color:var(--cw-ink-soft)]">
                  {row.adds}
                </td>
                <td className="px-4 py-3 align-top text-[color:var(--cw-ink-soft)]">
                  {row.needs}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="coworker-line mt-8">{t("delegateRealWork.nextSteps.body")}</p>
      <CoworkerContinue
        label={t("delegateRealWork.nextSteps.cta")}
        onClick={onContinue}
      />
    </CoworkerFrame>
  );
}
