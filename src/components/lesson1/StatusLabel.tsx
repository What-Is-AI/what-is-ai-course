"use client";

import { useT } from "@/i18n/LocaleProvider";

type StatusKind = "aligned" | "rethink" | "skipped" | "right-place";

const KEYS: Record<StatusKind, { visible: string; icon?: string; sr: string }> =
  {
    aligned: {
      visible: "lesson1.shared.status.aligned.visible",
      icon: "✓",
      sr: "lesson1.shared.status.aligned.sr",
    },
    rethink: {
      visible: "lesson1.shared.status.rethink.visible",
      icon: "↻",
      sr: "lesson1.shared.status.rethink.sr",
    },
    skipped: {
      visible: "lesson1.shared.status.skipped.visible",
      sr: "lesson1.shared.status.skipped.sr",
    },
    "right-place": {
      visible: "lesson1.shared.status.rightPlace.visible",
      icon: "✓",
      sr: "lesson1.shared.status.rightPlace.sr",
    },
  };

/** Status as text + icon; color is optional decoration only. */
export function StatusLabel({
  kind,
  className = "",
  style,
}: {
  kind: StatusKind;
  className?: string;
  style?: React.CSSProperties;
}) {
  const t = useT();
  const { visible, icon, sr } = KEYS[kind];

  return (
    <span className={className} style={style}>
      {t(visible)}
      {icon ? (
        <>
          {" "}
          <span aria-hidden="true">{icon}</span>
        </>
      ) : null}
      <span className="sr-only">{t(sr)}</span>
    </span>
  );
}
