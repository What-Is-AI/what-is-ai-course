"use client";

import Link from "next/link";
import {
  ConnectedFrame,
} from "@/components/practical1/ConnectedOfficeFrame";
import { usePractical1Copy } from "@/lib/usePractical1Copy";
import {
  PRACTICAL1_CLOSING_PHASES,
  type Practical1ClosingPhase,
} from "@/lib/practical1-data";

export { PRACTICAL1_CLOSING_PHASES };
export type { Practical1ClosingPhase };

type Props = {
  phase: Practical1ClosingPhase;
  onContinue: () => void;
};

export function Practical1Closing({ phase }: Props) {
  const { t } = usePractical1Copy();
  void phase;

  return (
    <ConnectedFrame className="justify-center">
      <p className="connected-body max-w-2xl text-lg font-semibold leading-relaxed text-[color:var(--connected-ink)]">
        {t("practical1.closing.line")}
      </p>
      <p className="connected-mystery mt-8 max-w-2xl">
        {t("practical1.closing.hook")}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        {/* Next practice is unpublished — don't put stub URLs in the public link graph. */}
        <Link href="/lessons" className="connected-btn">
          {t("practical1.closing.ctaPrimary")}
        </Link>
        <Link href="/" className="connected-btn-secondary">
          {t("practical1.closing.ctaSecondary")}
        </Link>
      </div>
    </ConnectedFrame>
  );
}
