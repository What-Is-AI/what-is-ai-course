"use client";

import { useState } from "react";
import {
  CoworkerContinue,
  CoworkerFrame,
  CoworkerLine,
  CoworkerTitle,
} from "@/components/delegate-real-work/CoworkerFrame";
import { REVIEW_ROWS, type ReviewRowId } from "@/lib/delegate-real-work-data";
import { useDelegateRealWorkCopy } from "@/lib/useDelegateRealWorkCopy";

type Props = {
  onContinue: () => void;
};

export function ReviewTrust({ onContinue }: Props) {
  const { t } = useDelegateRealWorkCopy();
  const [choice, setChoice] = useState<ReviewRowId | null>(null);
  const revealed = choice != null;

  return (
    <CoworkerFrame>
      <CoworkerTitle plaque={t("delegateRealWork.review.plaque")}>
        {t("delegateRealWork.review.title")}
      </CoworkerTitle>
      <CoworkerLine>{t("delegateRealWork.review.subhead")}</CoworkerLine>

      <div className="coworker-panel mt-8 max-w-3xl overflow-x-auto">
        <table className="w-full min-w-[22rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[color:var(--cw-line)]">
              <th className="px-4 py-3 font-semibold text-[color:var(--cw-mute)]">
                {t("delegateRealWork.review.columns.row")}
              </th>
              <th className="px-4 py-3 font-semibold text-[color:var(--cw-ink)]">
                {t("delegateRealWork.review.columns.vendor")}
              </th>
              <th className="px-4 py-3 font-semibold text-[color:var(--cw-ink)]">
                {t("delegateRealWork.review.columns.amount")}
              </th>
              <th className="px-4 py-3 font-semibold text-[color:var(--cw-ink)]">
                {t("delegateRealWork.review.columns.dueDate")}
              </th>
            </tr>
          </thead>
          <tbody>
            {REVIEW_ROWS.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[color:var(--cw-line)] last:border-0"
              >
                <td className="coworker-mono px-4 py-3">{row.id}</td>
                <td className="px-4 py-3 text-[color:var(--cw-ink-soft)]">
                  {row.vendor}
                </td>
                <td className="px-4 py-3 text-[color:var(--cw-ink-soft)]">
                  {row.amount}
                </td>
                <td className="coworker-mono px-4 py-3 text-[color:var(--cw-ink)]">
                  {row.dueDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="coworker-choice-cue mt-8">
        {t("delegateRealWork.shared.chooseOne")}
      </p>
      <div
        className="grid max-w-2xl gap-3"
        role="radiogroup"
        aria-label={t("delegateRealWork.review.subhead")}
      >
        {REVIEW_ROWS.map((row, i) => {
          const selected = choice === row.id;
          const dimmed = revealed && !selected;
          const mark = String.fromCharCode(65 + i);
          return (
            <button
              key={row.id}
              type="button"
              role="radio"
              className={`coworker-choice coworker-choice-marked${
                !revealed ? " coworker-choice-invite" : ""
              }${selected ? " is-selected" : ""}${dimmed ? " is-dimmed" : ""}`}
              aria-checked={selected}
              disabled={revealed}
              onClick={() => setChoice(row.id)}
            >
              <span className="coworker-choice-mark" aria-hidden>
                {mark}
              </span>
              <span>{t(`delegateRealWork.review.choices.${row.id}`)}</span>
            </button>
          );
        })}
      </div>

      {revealed ? (
        <div className="mt-8 max-w-2xl space-y-4">
          <p className="coworker-line">{t("delegateRealWork.review.reveal")}</p>
          <p className="coworker-line">
            {t("delegateRealWork.review.teachingLine")}
          </p>
          <p className="text-base font-semibold leading-relaxed text-[color:var(--cw-accent)]">
            {t("delegateRealWork.review.howYouFix")}
          </p>
          <CoworkerContinue
            label={t("delegateRealWork.review.cta")}
            onClick={onContinue}
          />
        </div>
      ) : null}
    </CoworkerFrame>
  );
}
