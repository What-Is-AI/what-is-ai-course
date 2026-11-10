"use client";

import { useState } from "react";
import {
  StudioContinue,
  StudioFrame,
  StudioLine,
  StudioTitle,
} from "@/components/working-with-llms/StudioFrame";
import { useWorkingWithLlmsCopy } from "@/lib/useWorkingWithLlmsCopy";
import { saveLocal } from "@/lib/storage";

type Props = {
  onContinue: () => void;
};

export function StudioReflection({ onContinue }: Props) {
  const { t } = useWorkingWithLlmsCopy();
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");

  const canSave = before.trim().length > 0 && after.trim().length > 0;

  function save() {
    saveLocal("lesson-x-reflection", {
      before: before.trim(),
      after: after.trim(),
      savedAt: new Date().toISOString(),
    });
    onContinue();
  }

  const prompts = [
    {
      id: "before" as const,
      label: t("workingWithLlms.reflection.beforeLabel"),
      placeholder: t("workingWithLlms.reflection.beforePlaceholder"),
      value: before,
      setValue: setBefore,
    },
    {
      id: "after" as const,
      label: t("workingWithLlms.reflection.afterLabel"),
      placeholder: t("workingWithLlms.reflection.afterPlaceholder"),
      value: after,
      setValue: setAfter,
    },
  ];

  return (
    <StudioFrame>
      <StudioTitle plaque={t("workingWithLlms.reflection.plaque")}>
        {t("workingWithLlms.reflection.title")}
      </StudioTitle>
      <StudioLine>{t("workingWithLlms.reflection.subhead")}</StudioLine>

      <div className="mt-8 grid max-w-2xl gap-4">
        {prompts.map((prompt) => (
          <label key={prompt.id} className="studio-panel block px-5 py-4">
            <span className="block text-sm font-semibold text-[var(--stu-ink)]">
              {prompt.label}
            </span>
            <textarea
              value={prompt.value}
              onChange={(e) => prompt.setValue(e.target.value)}
              rows={2}
              placeholder={prompt.placeholder}
              className="mt-2 w-full resize-none border-0 bg-transparent px-0 py-1 text-lg tracking-tight text-[var(--stu-ink)] outline-none placeholder:text-[var(--stu-mute)]"
            />
          </label>
        ))}
      </div>

      <StudioContinue
        label={t("workingWithLlms.reflection.cta")}
        disabled={!canSave}
        onClick={save}
      />
    </StudioFrame>
  );
}
