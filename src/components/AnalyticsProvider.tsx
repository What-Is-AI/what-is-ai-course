"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { isAnalyticsExcludedPath } from "@/lib/analytics/admin-paths";
import { AnalyticsContext } from "@/lib/analytics/context";
import { isAnalyticsConfigured } from "@/lib/analytics/config";
import { getOrCreateUserId } from "@/lib/analytics/identity";
import { startSessionHeartbeat } from "@/lib/analytics/heartbeat";
import { fireAndForget } from "@/lib/analytics/safe";
import { ensureSession, touchSession } from "@/lib/analytics/session";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const excluded = isAnalyticsExcludedPath(pathname);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const userIdRef = useRef<string | null>(null);

  const bindSession = (nextSessionId: string | null) => {
    sessionIdRef.current = nextSessionId;
    setSessionId(nextSessionId);
  };

  useEffect(() => {
    if (!isAnalyticsConfigured() || excluded) return;

    const id = getOrCreateUserId();
    if (!id) return;

    userIdRef.current = id;
    setUserId(id);

    fireAndForget(
      ensureSession(id).then((nextSessionId) => {
        if (nextSessionId) bindSession(nextSessionId);
      }),
    );
  }, [excluded]);

  useEffect(() => {
    if (!isAnalyticsConfigured() || excluded) return;

    const stopHeartbeat = startSessionHeartbeat(() => sessionIdRef.current);

    const onVisibilityChange = () => {
      const activeUserId = userIdRef.current;
      const activeSessionId = sessionIdRef.current;

      if (document.visibilityState === "hidden") {
        // Keep the session; only refresh last-seen so idle timeout stays accurate.
        if (activeSessionId) fireAndForget(touchSession(activeSessionId));
        return;
      }

      if (document.visibilityState === "visible" && activeUserId) {
        fireAndForget(
          ensureSession(activeUserId).then((nextSessionId) => {
            if (nextSessionId) bindSession(nextSessionId);
          }),
        );
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      stopHeartbeat();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [excluded]);

  return (
    <AnalyticsContext.Provider value={{ userId, sessionId }}>
      {children}
    </AnalyticsContext.Provider>
  );
}
