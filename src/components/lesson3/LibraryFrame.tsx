"use client";

import { motion } from "framer-motion";
import { useT } from "@/i18n/LocaleProvider";

type LibraryFrameProps = {
  children: React.ReactNode;
  className?: string;
};

export function LibraryFrame({ children, className = "" }: LibraryFrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-1 flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function LibraryTitle({
  plaque,
  children,
  compact = false,
}: {
  plaque?: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`lesson-heading ${compact ? "mb-3" : "mb-8"} max-w-3xl`}>
      {plaque ? (
        <p className={`library-eyebrow ${compact ? "mb-2" : "mb-3"}`}>{plaque}</p>
      ) : null}
      <h2 className={`library-title${compact ? " library-title-compact" : ""}`}>
        {children}
      </h2>
    </div>
  );
}

export function LibraryLine({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <p className={`library-line${compact ? " library-line-compact" : ""}`}>
      {children}
    </p>
  );
}

export function LibraryContinue({
  label,
  onClick,
  disabled = false,
  className = "",
}: {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const t = useT();
  const resolved = label ?? t("common.continue");
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      className={["library-btn", className || "mt-8"].filter(Boolean).join(" ")}
    >
      {resolved}
    </motion.button>
  );
}
