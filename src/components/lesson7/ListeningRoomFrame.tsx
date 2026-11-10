"use client";

import { motion } from "framer-motion";
import { useT } from "@/i18n/LocaleProvider";

type ListeningRoomFrameProps = {
  children: React.ReactNode;
  className?: string;
};

export function ListeningRoomFrame({
  children,
  className = "",
}: ListeningRoomFrameProps) {
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

export function ListeningRoomTitle({
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
        <p className={`lr-eyebrow ${compact ? "mb-2" : "mb-3"}`}>{plaque}</p>
      ) : null}
      <h2 className={`lr-title${compact ? " lr-title-compact" : ""}`}>
        {children}
      </h2>
    </div>
  );
}

export function ListeningRoomLine({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <p className={`lr-line${compact ? " lr-line-compact" : ""}`}>{children}</p>
  );
}

export function ListeningRoomContinue({
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
  const resolvedLabel = label ?? t("lesson7.shared.continue");
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      className={["lr-btn", className || "mt-8"].filter(Boolean).join(" ")}
    >
      {resolvedLabel}
    </motion.button>
  );
}
