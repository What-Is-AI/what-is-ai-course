"use client";

import { motion } from "framer-motion";
import { useT } from "@/i18n/LocaleProvider";

type LabFrameProps = {
  children: React.ReactNode;
  className?: string;
};

export function LabFrame({ children, className = "" }: LabFrameProps) {
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

export function LabTitle({
  plaque,
  children,
}: {
  plaque?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="lesson-heading mb-7 max-w-3xl">
      {plaque ? <p className="lab-eyebrow mb-3">{plaque}</p> : null}
      <h2 className="lab-title">{children}</h2>
    </div>
  );
}

export function LabLine({ children }: { children: React.ReactNode }) {
  return <p className="lab-line">{children}</p>;
}

export function LabContinue({
  label,
  onClick,
  disabled = false,
}: {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  const t = useT();
  const resolved = label ?? t("common.continue");
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      className="lab-btn mt-8"
    >
      {resolved}
    </motion.button>
  );
}
