"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  StudioContinue,
  StudioFrame,
  StudioLine,
  StudioTitle,
} from "@/components/working-with-llms/StudioFrame";
import { type ContextChipId } from "@/lib/working-with-llms-data";
import { useWorkingWithLlmsCopy } from "@/lib/useWorkingWithLlmsCopy";

type Props = {
  onContinue: (active: ContextChipId[]) => void;
};

type Phase = "recall" | "toggle";

export function WhyContextWorks({ onContinue }: Props) {
  const { t, contextChips } = useWorkingWithLlmsCopy();
  const [phase, setPhase] = useState<Phase>("recall");
  const [active, setActive] = useState<ContextChipId[]>([]);

  function toggle(id: ContextChipId) {
    setActive((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const allOff = active.length === 0;
  const allOn = active.length === contextChips.length;

  const helper = allOff
    ? t("workingWithLlms.whyContext.toggle.helperAllOff")
    : allOn
      ? t("workingWithLlms.whyContext.toggle.helperAllOn")
      : null;

  const effects = useMemo(
    () =>
      contextChips
        .filter((chip) => active.includes(chip.id))
        .map((chip) => chip.effect),
    [active, contextChips],
  );

  return (
    <AnimatePresence mode="wait">
      {phase === "recall" ? (
        <StudioFrame key="recall">
          <StudioTitle plaque={t("workingWithLlms.whyContext.recall.plaque")}>
            {t("workingWithLlms.whyContext.recall.title")}
          </StudioTitle>
          <StudioLine>{t("workingWithLlms.whyContext.recall.subhead")}</StudioLine>
          <p className="studio-line mt-4">
            {t("workingWithLlms.whyContext.recall.body")}
          </p>
          <StudioContinue
            label={t("workingWithLlms.whyContext.recall.cta")}
            onClick={() => setPhase("toggle")}
          />
        </StudioFrame>
      ) : null}

      {phase === "toggle" ? (
        <StudioFrame key="toggle">
          <StudioTitle plaque={t("workingWithLlms.whyContext.toggle.plaque")}>
            {t("workingWithLlms.whyContext.toggle.title")}
          </StudioTitle>
          <StudioLine>{t("workingWithLlms.whyContext.toggle.subhead")}</StudioLine>

          <div className="studio-panel mt-8 max-w-3xl px-5 py-5 sm:px-6">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--stu-mute)]">
              {t("workingWithLlms.whyContext.toggle.requestEyebrow")}
            </p>
            <p className="mt-2 text-[1.05rem] font-semibold tracking-tight text-[var(--stu-ink)]">
              {t("workingWithLlms.whyContext.toggle.request")}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {contextChips.map((chip) => {
                const on = active.includes(chip.id);
                return (
                  <button
                    key={chip.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(chip.id)}
                    className="studio-chip"
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.slice().sort().join("-") || "none"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="mt-6 rounded-xl border border-[var(--stu-line)] bg-white/70 px-4 py-4"
              >
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--stu-mute)]">
                  {t("workingWithLlms.whyContext.toggle.answerEyebrow")}
                </p>
                {allOff ? (
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-[var(--stu-ink-soft)]">
                    {t("workingWithLlms.whyContext.toggle.genericAnswer")}
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {effects.map((effect) => (
                      <li
                        key={effect}
                        className="text-[0.98rem] leading-relaxed text-[var(--stu-ink-soft)]"
                      >
                        {effect}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>

            {helper ? (
              <motion.p
                key={helper}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-5 text-sm leading-relaxed text-[var(--stu-ink)]"
              >
                {helper}
              </motion.p>
            ) : null}
          </div>

          <StudioContinue
            label={t("workingWithLlms.whyContext.toggle.cta")}
            onClick={() => onContinue(active)}
          />
        </StudioFrame>
      ) : null}
    </AnimatePresence>
  );
}
