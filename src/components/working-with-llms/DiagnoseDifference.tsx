"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  StudioContinue,
  StudioFrame,
  StudioLine,
  StudioTitle,
} from "@/components/working-with-llms/StudioFrame";
import { type CauseChoiceId } from "@/lib/working-with-llms-data";
import { useWorkingWithLlmsCopy } from "@/lib/useWorkingWithLlmsCopy";

type Props = {
  onContinue: (picked: CauseChoiceId[]) => void;
};

type Phase = "inspect" | "pick" | "reveal";

export function DiagnoseDifference({ onContinue }: Props) {
  const { t, causeChoices } = useWorkingWithLlmsCopy();
  const [phase, setPhase] = useState<Phase>("inspect");
  const [picked, setPicked] = useState<CauseChoiceId[]>([]);

  function toggle(id: CauseChoiceId) {
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <AnimatePresence mode="wait">
      {phase === "inspect" ? (
        <StudioFrame key="inspect">
          <StudioTitle plaque={t("workingWithLlms.diagnose.inspect.plaque")}>
            {t("workingWithLlms.diagnose.inspect.title")}
          </StudioTitle>
          <StudioLine>{t("workingWithLlms.diagnose.inspect.subhead")}</StudioLine>

          <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
            <article className="studio-panel px-5 py-5">
              <p className="studio-eyebrow">
                {t("workingWithLlms.diagnose.inspect.workspaceAEyebrow")}
              </p>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-[var(--stu-ink-soft)]">
                {t("workingWithLlms.diagnose.inspect.workspaceA")}
              </p>
            </article>
            <article className="studio-panel studio-panel-accent px-5 py-5">
              <p className="studio-eyebrow">
                {t("workingWithLlms.diagnose.inspect.workspaceBEyebrow")}
              </p>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-[var(--stu-ink-soft)]">
                {t("workingWithLlms.diagnose.inspect.workspaceB")}
              </p>
            </article>
          </div>

          <StudioContinue
            label={t("workingWithLlms.diagnose.inspect.cta")}
            onClick={() => setPhase("pick")}
          />
        </StudioFrame>
      ) : null}

      {phase === "pick" ? (
        <StudioFrame key="pick">
          <StudioTitle plaque={t("workingWithLlms.diagnose.pick.plaque")}>
            {t("workingWithLlms.diagnose.pick.title")}
          </StudioTitle>
          <StudioLine>{t("workingWithLlms.diagnose.pick.subhead")}</StudioLine>

          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
            {causeChoices.map((choice) => {
              const selected = picked.includes(choice.id);
              return (
                <button
                  key={choice.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggle(choice.id)}
                  className="studio-choice"
                >
                  {choice.label}
                </button>
              );
            })}
          </div>

          <StudioContinue
            label={t("workingWithLlms.diagnose.pick.cta")}
            disabled={picked.length === 0}
            onClick={() => setPhase("reveal")}
          />
        </StudioFrame>
      ) : null}

      {phase === "reveal" ? (
        <StudioFrame key="reveal">
          <StudioTitle plaque={t("workingWithLlms.diagnose.reveal.plaque")}>
            {t("workingWithLlms.diagnose.reveal.title")}
          </StudioTitle>
          <StudioLine>{t("workingWithLlms.diagnose.reveal.body1")}</StudioLine>
          <p className="studio-line mt-4">
            {t("workingWithLlms.diagnose.reveal.body2")}
          </p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-8 max-w-2xl text-lg font-semibold tracking-tight text-[var(--stu-ink)]"
          >
            {t("workingWithLlms.diagnose.reveal.punchline")}
          </motion.p>

          <StudioContinue
            label={t("workingWithLlms.diagnose.reveal.cta")}
            onClick={() => onContinue(picked)}
          />
        </StudioFrame>
      ) : null}
    </AnimatePresence>
  );
}
