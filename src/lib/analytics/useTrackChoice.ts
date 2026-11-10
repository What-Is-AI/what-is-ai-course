"use client";

import { trackChoice } from "@/lib/analytics/attemptRegistry";

/** Safe no-op wrapper for Choose-step analytics. */
export function useTrackChoice() {
  return trackChoice;
}
