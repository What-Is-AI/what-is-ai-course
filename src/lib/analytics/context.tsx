"use client";

import { createContext, useContext } from "react";

import type { AnalyticsContextValue } from "@/lib/analytics/types";

const AnalyticsContext = createContext<AnalyticsContextValue>({
  userId: null,
  sessionId: null,
});

export function useAnalyticsContext(): AnalyticsContextValue {
  return useContext(AnalyticsContext);
}

export { AnalyticsContext };
