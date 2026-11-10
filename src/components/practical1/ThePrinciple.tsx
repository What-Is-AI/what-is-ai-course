"use client";

import { useState } from "react";
import {
  ConnectedContinue,
  ConnectedFrame,
  ConnectedTitle,
} from "@/components/practical1/ConnectedOfficeFrame";
import { usePractical1Copy } from "@/lib/usePractical1Copy";
import { saveLocal } from "@/lib/storage";

type Props = {
  onContinue: () => void;
};

export function ThePrinciple({ onContinue }: Props) {
  const { t, principleBody, goDeeperBody } = usePractical1Copy();
  const [deeper, setDeeper] = useState(false);

  if (deeper) {
    return (
      <ConnectedFrame>
        <ConnectedTitle>{t("practical1.principle.goDeeper.title")}</ConnectedTitle>
        <div className="mt-6 max-w-2xl space-y-4">
          {goDeeperBody.map((line, i) => (
            <p key={i} className="connected-body">
              {line}
            </p>
          ))}
        </div>
        <ConnectedContinue
          label={t("practical1.principle.goDeeper.cta")}
          onClick={() => setDeeper(false)}
        />
      </ConnectedFrame>
    );
  }

  return (
    <ConnectedFrame>
      <ConnectedTitle plaque={t("practical1.principle.plaque")}>
        {t("practical1.principle.title")}
      </ConnectedTitle>
      <ul className="mt-6 max-w-2xl space-y-4">
        {principleBody.map((line, i) => (
          <li key={i} className="connected-body">
            {line}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="connected-link-btn mt-8"
        onClick={() => setDeeper(true)}
      >
        {t("practical1.principle.goDeeper.open")}
      </button>
      <ConnectedContinue
        label={t("practical1.principle.cta")}
        onClick={() => {
          saveLocal("practical-1-part1-done", true);
          onContinue();
        }}
      />
    </ConnectedFrame>
  );
}
