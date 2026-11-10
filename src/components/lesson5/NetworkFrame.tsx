"use client";

import { motion } from "framer-motion";
import { useT } from "@/i18n/LocaleProvider";

type NetworkFrameProps = {
  children: React.ReactNode;
  className?: string;
};

export function NetworkFrame({
  children,
  className = "",
}: NetworkFrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-1 flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function NetworkTitle({
  plaque,
  children,
  compact = false,
}: {
  plaque?: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`lesson-heading ${compact ? "mb-3" : "mb-7"} max-w-3xl`}>
      {plaque ? (
        <p className={`network-eyebrow ${compact ? "mb-2" : "mb-3"}`}>
          {plaque}
        </p>
      ) : null}
      <h2
        className={`network-title${compact ? " network-title-compact" : ""}`}
      >
        {children}
      </h2>
    </div>
  );
}

export function NetworkLine({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <p className={`network-line${compact ? " network-line-compact" : ""}`}>
      {children}
    </p>
  );
}

export function NetworkContinue({
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
  const resolved = label ?? t("lesson5.shared.continue");
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      className={["network-btn", className || "mt-8"].filter(Boolean).join(" ")}
    >
      {resolved}
    </motion.button>
  );
}
