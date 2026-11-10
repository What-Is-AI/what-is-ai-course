"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

import {
  GA_CONSENT_CHANGE_EVENT,
  GA_MEASUREMENT_ID,
  getGaConsent,
} from "@/lib/analytics/consent";

/** Load GA only after explicit opt-in. */
export function ConditionalGoogleAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(getGaConsent() === "granted");
    sync();
    window.addEventListener(GA_CONSENT_CHANGE_EVENT, sync);
    return () => window.removeEventListener(GA_CONSENT_CHANGE_EVENT, sync);
  }, []);

  if (!allowed || !GA_MEASUREMENT_ID) return null;
  return <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}
