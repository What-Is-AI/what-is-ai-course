"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  LibraryContinue,
  LibraryFrame,
  LibraryLine,
  LibraryTitle,
} from "@/components/lesson3/LibraryFrame";
import { useLesson3Copy } from "@/lib/useLesson3Copy";

type Props = {
  onContinue: () => void;
};

export function InternetChangedAI({ onContinue }: Props) {
  const { t, eras } = useLesson3Copy();
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    if (visible >= eras.length) return;
    const timeout = setTimeout(() => setVisible((v) => v + 1), 550);
    return () => clearTimeout(timeout);
  }, [visible, eras.length]);

  const done = visible >= eras.length;

  return (
    <LibraryFrame>
      <LibraryTitle plaque={t("lesson3.internet.plaque")}>
        {t("lesson3.internet.title")}
      </LibraryTitle>
      <LibraryLine>{t("lesson3.internet.subhead")}</LibraryLine>

      <ol className="relative mt-8 max-w-xl space-y-0 pl-1">
        <motion.span
          aria-hidden
          className="absolute bottom-4 left-[1.2rem] top-4 w-px origin-top bg-ink/15"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.7 }}
        />
        {eras.slice(0, visible).map((era, index) => (
          <motion.li
            key={era.year}
            initial={{ opacity: 0, y: 12, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            className="relative flex gap-4 pb-5 last:pb-0"
          >
            <div className="relative z-10 flex w-8 shrink-0 justify-center pt-2">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--lib-bookmark)] text-[10px] font-bold text-white"
                style={{ color: "#f7f6f1" }}
              >
                {index + 1}
              </span>
            </div>
            <div className="library-paper library-drift min-w-0 flex-1 px-4 py-3">
              <p className="text-sm font-bold text-[var(--lib-bookmark)]">
                {era.year}
              </p>
              <p className="font-semibold text-ink">{era.label}</p>
              <p className="mt-1 text-sm text-ink-soft">{era.blurb}</p>
            </div>
          </motion.li>
        ))}
      </ol>

      {done ? <LibraryContinue onClick={onContinue} /> : null}
    </LibraryFrame>
  );
}
