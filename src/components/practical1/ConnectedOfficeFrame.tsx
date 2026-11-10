"use client";

import { motion } from "framer-motion";
import { useT } from "@/i18n/LocaleProvider";

export function ConnectedFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-1 flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function ConnectedTitle({
  plaque,
  children,
}: {
  plaque?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="lesson-heading mb-7 max-w-3xl">
      {plaque ? <p className="connected-plaque mb-3">{plaque}</p> : null}
      <h2 className="connected-title">{children}</h2>
    </div>
  );
}

export function ConnectedLine({ children }: { children: React.ReactNode }) {
  return <p className="connected-body mt-2 max-w-2xl">{children}</p>;
}

export function ConnectedContinue({
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
  const resolved = label ?? t("practical1.shared.continue");
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      className={`connected-btn ${className || "mt-8"}`}
    >
      {resolved}
    </motion.button>
  );
}
