"use client";

import { motion } from "framer-motion";
import { useT } from "@/i18n/LocaleProvider";

type StudioFrameProps = {
  children: React.ReactNode;
  className?: string;
};

export function StudioFrame({ children, className = "" }: StudioFrameProps) {
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

export function StudioTitle({
  plaque,
  children,
}: {
  plaque?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="lesson-heading mb-6 max-w-3xl">
      {plaque ? <p className="studio-eyebrow mb-3">{plaque}</p> : null}
      <h2 className="studio-title">{children}</h2>
    </div>
  );
}

export function StudioLine({ children }: { children: React.ReactNode }) {
  return <p className="studio-line">{children}</p>;
}

export function StudioContinue({
  label,
  onClick,
  disabled = false,
}: {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  const t = useT();
  const resolved = label ?? t("workingWithLlms.shared.continue");
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      className="studio-btn mt-8"
    >
      {resolved}
    </motion.button>
  );
}
