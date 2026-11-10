"use client";

import { motion } from "framer-motion";
import { useT } from "@/i18n/LocaleProvider";

type DepthFrameProps = {
  children: React.ReactNode;
  className?: string;
};

export function DepthFrame({ children, className = "" }: DepthFrameProps) {
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

export function DepthTitle({
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
        <p className={`depth-eyebrow ${compact ? "mb-2" : "mb-3"}`}>{plaque}</p>
      ) : null}
      <h2 className={`depth-title${compact ? " depth-title-compact" : ""}`}>
        {children}
      </h2>
    </div>
  );
}

export function DepthLine({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <p className={`depth-line${compact ? " depth-line-compact" : ""}`}>
      {children}
    </p>
  );
}

export function DepthContinue({
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
  const resolvedLabel = label ?? t("lesson6.shared.continue");
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      className={["depth-btn", className || "mt-8"].filter(Boolean).join(" ")}
    >
      {resolvedLabel}
    </motion.button>
  );
}
