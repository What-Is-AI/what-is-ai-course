"use client";

import { useState } from "react";
import {
  ConnectedContinue,
  ConnectedFrame,
  ConnectedTitle,
} from "@/components/practical1/ConnectedOfficeFrame";
import { usePractical1Copy } from "@/lib/usePractical1Copy";
import { saveLocal } from "@/lib/storage";

type Props = { onContinue: () => void };

export function ConnectedReflection({ onContinue }: Props) {
  const { t, reflectionPrompts } = usePractical1Copy();
  const [answers, setAnswers] = useState<Record<string, string>>({
    task: "",
    gate: "",
  });

  return (
    <ConnectedFrame>
      <ConnectedTitle plaque={t("practical1.reflection.plaque")}>
        {t("practical1.reflection.title")}
      </ConnectedTitle>

      <div className="mt-8 max-w-2xl space-y-6">
        {reflectionPrompts.map((prompt) => (
          <label key={prompt.id} className="block">
            <span className="connected-plaque normal-case tracking-normal">
              {prompt.label}
            </span>
            <textarea
              value={answers[prompt.id] ?? ""}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [prompt.id]: e.target.value }))
              }
              placeholder={prompt.placeholder}
              rows={3}
              className="connected-input mt-2"
            />
          </label>
        ))}
      </div>

      <ConnectedContinue
        label={t("practical1.reflection.cta")}
        onClick={() => {
          saveLocal("practical-1-reflection", answers);
          onContinue();
        }}
      />
    </ConnectedFrame>
  );
}
