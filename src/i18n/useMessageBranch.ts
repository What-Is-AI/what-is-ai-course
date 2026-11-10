"use client";

import { useMemo } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { getMessageNode } from "@/i18n/translate";

/** Locale-aware nested messages branch (e.g. `lesson6.steps`). */
export function useMessageBranch<T>(path: string, fallback: T): T {
  const { locale } = useLocale();
  return useMemo(() => {
    const node = getMessageNode<T>(locale, path);
    return node ?? fallback;
  }, [locale, path, fallback]);
}
