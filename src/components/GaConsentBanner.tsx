"use client";

import { useEffect, useState } from "react";

import { useT } from "@/i18n/LocaleProvider";
import {
  GA_CONSENT_CHANGE_EVENT,
  GA_CONSENT_OPEN_EVENT,
  getGaConsent,
  setGaConsent,
  type GaConsentChoice,
} from "@/lib/analytics/consent";

/**
 * Minimal EU-style opt-in for Google Analytics only.
 * Accept and Reject are equally available; choice can be changed later.
 */
export function GaConsentBanner() {
  const t = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => setVisible(getGaConsent() == null);
    sync();

    const onOpen = () => setVisible(true);
    const onChange = () => setVisible(getGaConsent() == null);

    window.addEventListener(GA_CONSENT_OPEN_EVENT, onOpen);
    window.addEventListener(GA_CONSENT_CHANGE_EVENT, onChange);
    return () => {
      window.removeEventListener(GA_CONSENT_OPEN_EVENT, onOpen);
      window.removeEventListener(GA_CONSENT_CHANGE_EVENT, onChange);
    };
  }, []);

  if (!visible) return null;

  const choose = (choice: GaConsentChoice) => {
    setGaConsent(choice);
    setVisible(false);
  };

  return (
    <div className="ga-consent" role="dialog" aria-labelledby="ga-consent-title">
      <div className="ga-consent-inner">
        <div className="ga-consent-copy">
          <p id="ga-consent-title" className="ga-consent-title">
            {t("consent.ga.title")}
          </p>
          <p className="ga-consent-body">{t("consent.ga.body")}</p>
        </div>
        <div className="ga-consent-actions">
          <button
            type="button"
            className="ga-consent-btn ga-consent-btn-reject"
            onClick={() => choose("denied")}
          >
            {t("consent.ga.reject")}
          </button>
          <button
            type="button"
            className="ga-consent-btn ga-consent-btn-accept"
            onClick={() => choose("granted")}
          >
            {t("consent.ga.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
