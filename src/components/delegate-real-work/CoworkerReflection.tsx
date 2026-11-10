"use client";

import { useState } from "react";
import {
  CoworkerContinue,
  CoworkerFrame,
  CoworkerTitle,
} from "@/components/delegate-real-work/CoworkerFrame";
import { useDelegateRealWorkCopy } from "@/lib/useDelegateRealWorkCopy";

type Props = {
  onContinue: () => void;
};

export function CoworkerReflection({ onContinue }: Props) {
  const { t, reflectionPrompts } = useDelegateRealWorkCopy();
  const [answers, setAnswers] = useState<Record<string, string>>({
    before: "",
    handoff: "",
    check: "",
  });

  return (
    <CoworkerFrame>
      <CoworkerTitle plaque={t("delegateRealWork.reflection.plaque")}>
        {t("delegateRealWork.reflection.title")}
      </CoworkerTitle>

      <div className="mt-8 max-w-2xl space-y-6">
        {reflectionPrompts.map((prompt) => (
          <label key={prompt.id} className="block">
            <span className="coworker-mono text-[color:var(--cw-accent)]">
              {prompt.label}
            </span>
            <input
              type="text"
              value={answers[prompt.id] ?? ""}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [prompt.id]: e.target.value }))
              }
              placeholder={prompt.placeholder}
              className="coworker-input mt-2"
            />
          </label>
        ))}
      </div>

      <CoworkerContinue
        label={t("delegateRealWork.reflection.cta")}
        onClick={onContinue}
      />
    </CoworkerFrame>
  );
}
