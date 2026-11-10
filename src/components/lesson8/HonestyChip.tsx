"use client";

import { useLesson8LocaleData } from "@/lib/useLesson8Copy";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

/**
 * Persistent honesty note wherever illustrative attention / probability
 * numbers appear. Script lock — not output from a running model.
 */
export function HonestyChip({ className = "", children }: Props) {
  const localeData = useLesson8LocaleData();
  return (
    <p className={`rr-honesty ${className}`.trim()} role="note">
      {children ?? localeData.illustrativeNumbersNote}
    </p>
  );
}
