"use client";

import { LOCALES, type Locale } from "@/i18n/config";
import { useLocale } from "@/i18n/LocaleProvider";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="lang-switch" role="group" aria-label={t("common.language")}>
      {LOCALES.map((id: Locale) => (
        <button
          key={id}
          type="button"
          className="lang-switch-btn"
          aria-pressed={locale === id}
          onClick={() => setLocale(id)}
        >
          {t(`common.${id}Short`)}
        </button>
      ))}
    </div>
  );
}
