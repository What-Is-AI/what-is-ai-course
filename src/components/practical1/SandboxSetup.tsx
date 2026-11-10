"use client";

import {
  ConnectedContinue,
  ConnectedFrame,
  ConnectedLine,
  ConnectedTitle,
} from "@/components/practical1/ConnectedOfficeFrame";
import { usePractical1Copy } from "@/lib/usePractical1Copy";

type Props = {
  onContinue: () => void;
};

export function SandboxSetup({ onContinue }: Props) {
  const { t, sandboxSet } = usePractical1Copy();

  return (
    <ConnectedFrame>
      <ConnectedTitle plaque={t("practical1.sandbox.plaque")}>
        {t("practical1.sandbox.title")}
      </ConnectedTitle>
      <ConnectedLine>{t("practical1.sandbox.subhead")}</ConnectedLine>
      <p className="connected-body mt-5 max-w-2xl">
        {t("practical1.sandbox.framing")}
      </p>
      <ul className="mt-6 max-w-2xl space-y-2">
        {sandboxSet.map((row) => (
          <li key={row.id} className="connected-door px-4 py-3 text-sm">
            {row.label}
          </li>
        ))}
      </ul>
      <p className="connected-mystery mt-6 max-w-2xl">
        {t("practical1.sandbox.vehicle")}
      </p>
      <ConnectedContinue
        label={t("practical1.sandbox.cta")}
        onClick={onContinue}
      />
    </ConnectedFrame>
  );
}
