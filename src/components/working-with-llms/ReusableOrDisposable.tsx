"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  StudioContinue,
  StudioFrame,
  StudioLine,
  StudioTitle,
} from "@/components/working-with-llms/StudioFrame";
import {
  type TransferChoiceId,
  type TransferScenarioId,
} from "@/lib/working-with-llms-data";
import { useWorkingWithLlmsCopy } from "@/lib/useWorkingWithLlmsCopy";

type Props = {
  onContinue: (score: number) => void;
};

type Result = {
  scenarioId: TransferScenarioId;
  picked: TransferChoiceId;
  matched: boolean;
};

export function ReusableOrDisposable({ onContinue }: Props) {
  const {
    t,
    transferChoices,
    transferChoiceLabel,
    transferScenarios,
  } = useWorkingWithLlmsCopy();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<TransferChoiceId | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  const total = transferScenarios.length;
  const finished = index >= total;
  const scenario = transferScenarios[index];
  const score = results.filter((r) => r.matched).length;
  const revealed = picked !== null;
  const matched = picked !== null && picked === scenario?.answer;
  const isLast = index === total - 1;

  if (finished) {
    return (
      <StudioFrame>
        <StudioTitle plaque={t("workingWithLlms.transfer.score.plaque")}>
          {t("workingWithLlms.transfer.score.title", { score, total })}
        </StudioTitle>
        <StudioLine>{t("workingWithLlms.transfer.score.subhead")}</StudioLine>

        <ul className="mt-8 max-w-2xl divide-y divide-[var(--stu-line)] border-y border-[var(--stu-line)]">
          {results.map((result, i) => {
            const item = transferScenarios.find(
              (s) => s.id === result.scenarioId,
            );
            if (!item) return null;
            return (
              <motion.li
                key={result.scenarioId}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.35) }}
                className="flex flex-col gap-1 py-3 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-4"
              >
                <span className="text-[0.98rem] font-semibold tracking-tight text-[var(--stu-ink)]">
                  {item.scenario}
                </span>
                <span className="flex flex-wrap items-baseline gap-x-3 text-sm text-[var(--stu-ink-soft)]">
                  <span
                    className="text-[0.65rem] font-bold uppercase tracking-[0.12em]"
                    style={{
                      color: result.matched
                        ? "var(--stu-accent)"
                        : "var(--stu-mute)",
                    }}
                  >
                    {result.matched
                      ? t("workingWithLlms.transfer.status.matched")
                      : t("workingWithLlms.transfer.status.missed")}
                  </span>
                  <span>
                    {t("workingWithLlms.transfer.resultLine", {
                      picked: transferChoiceLabel(result.picked),
                      usual: transferChoiceLabel(item.answer),
                    })}
                  </span>
                </span>
              </motion.li>
            );
          })}
        </ul>

        <StudioContinue
          label={t("workingWithLlms.transfer.score.cta")}
          onClick={() => onContinue(score)}
        />
      </StudioFrame>
    );
  }

  return (
    <StudioFrame>
      <StudioTitle
        plaque={t("workingWithLlms.transfer.plaque", {
          index: index + 1,
          total,
        })}
      >
        {t("workingWithLlms.transfer.title")}
      </StudioTitle>
      <StudioLine>{scenario.scenario}</StudioLine>

      <div className="mt-8 grid max-w-2xl gap-3">
        {transferChoices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            disabled={revealed}
            aria-pressed={picked === choice.id}
            onClick={() => setPicked(choice.id)}
            className="studio-choice disabled:cursor-default"
          >
            {choice.label}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {revealed ? (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="studio-panel mt-6 max-w-2xl px-5 py-4"
          >
            <p className="text-sm font-semibold text-[var(--stu-ink)]">
              {matched
                ? t("workingWithLlms.transfer.feedback.match")
                : t("workingWithLlms.transfer.feedback.rethink")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--stu-ink-soft)]">
              {scenario.note}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {revealed ? (
        <StudioContinue
          label={
            isLast
              ? t("workingWithLlms.transfer.lastCta")
              : t("workingWithLlms.transfer.nextCta")
          }
          onClick={() => {
            setResults((prev) => [
              ...prev,
              {
                scenarioId: scenario.id,
                picked: picked!,
                matched,
              },
            ]);
            setPicked(null);
            setIndex((prev) => prev + 1);
          }}
        />
      ) : null}
    </StudioFrame>
  );
}
