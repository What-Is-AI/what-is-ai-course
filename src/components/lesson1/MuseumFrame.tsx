"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useT } from "@/i18n/LocaleProvider";
import { useFocusHeading } from "@/components/lesson1/a11y";

type MuseumFrameProps = {
  children: React.ReactNode;
  className?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function MuseumFrame({ children, className = "" }: MuseumFrameProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE }}
      className={`flex flex-1 flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function MuseumTitle({
  plaque,
  children,
  focusKey,
}: {
  plaque?: string;
  children: React.ReactNode;
  /** Remount focus when this changes (e.g. object index). */
  focusKey?: string | number;
}) {
  const headingRef = useFocusHeading(focusKey ?? "screen");

  return (
    <div className="lesson-heading mb-8 max-w-3xl">
      {plaque ? <p className="museum-eyebrow mb-3">{plaque}</p> : null}
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="museum-title outline-none"
      >
        {children}
      </h2>
    </div>
  );
}

export function MuseumLine({ children }: { children: React.ReactNode }) {
  return <p className="museum-line">{children}</p>;
}

export function MuseumContinue({
  label,
  onClick,
  disabled = false,
  secondary = false,
}: {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
  /** Ghost/outline style for back / secondary actions */
  secondary?: boolean;
}) {
  const t = useT();
  const reduceMotion = useReducedMotion();
  const resolved = label ?? t("common.continue");

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled || reduceMotion ? undefined : { y: -1 }}
      whileTap={disabled || reduceMotion ? undefined : { scale: 0.985 }}
      className={`museum-btn mt-8${secondary ? " museum-btn-secondary" : ""}`}
    >
      {resolved}
    </motion.button>
  );
}

export function Pedestal({
  children,
  className = "",
  float = false,
}: {
  children: React.ReactNode;
  className?: string;
  float?: boolean;
}) {
  return (
    <div className={`museum-pedestal ${float ? "museum-float" : ""} ${className}`}>
      <div className="museum-glass">{children}</div>
      <div aria-hidden className="museum-plinth" />
    </div>
  );
}
