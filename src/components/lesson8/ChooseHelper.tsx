"use client";

import { useT } from "@/i18n/LocaleProvider";

/** Shared Choose affordance chrome (not lesson script). Matches Opening. */
export function ChooseHelper({
  children,
  id,
}: {
  children?: string;
  id?: string;
}) {
  const t = useT();
  const label = children ?? t("lesson8.shared.tapOne");
  return (
    <p className="rr-choose-helper" id={id}>
      {label}
    </p>
  );
}
