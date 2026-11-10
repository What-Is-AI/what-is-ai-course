"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useT } from "@/i18n/LocaleProvider";

type Props = {
  label: string;
  text: string;
};

/**
 * Short real-life “what is this?” hint.
 * Opens on hover (desktop), focus (keyboard), and tap/click (touch).
 * Never hover-only.
 */
export function MuseumWhatIs({ label, text }: Props) {
  const t = useT();
  const [pinned, setPinned] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!pinned) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPinned(false);
    }

    function onPointer(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setPinned(false);
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [pinned]);

  return (
    <div
      ref={rootRef}
      className={`museum-whatis${pinned ? " is-open" : ""}`}
    >
      <button
        type="button"
        className="museum-whatis-btn"
        aria-expanded={pinned}
        aria-controls={panelId}
        aria-label={t("lesson1.round2.whatIsAria", { label })}
        onClick={(e) => {
          e.stopPropagation();
          setPinned((v) => !v);
        }}
      >
        <span aria-hidden>ⓘ</span>
      </button>
      <div
        id={panelId}
        role="tooltip"
        className="museum-whatis-panel"
      >
        {text}
      </div>
    </div>
  );
}
