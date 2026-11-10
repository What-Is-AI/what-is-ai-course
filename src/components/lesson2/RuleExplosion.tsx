"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  LabContinue,
  LabFrame,
  LabLine,
  LabTitle,
} from "@/components/lesson2/LabFrame";
import { RichText } from "@/i18n/RichText";
import { useLesson2Copy } from "@/lib/useLesson2Copy";

type Props = {
  rules: string[];
  onBack?: () => void;
  onContinue: () => void;
};

export function RuleExplosion({ rules, onBack, onContinue }: Props) {
  const { t, displayRule, exceptions } = useLesson2Copy();
  const [visible, setVisible] = useState(0);
  const [done, setDone] = useState(false);
  const [phase, setPhase] = useState<"prompt" | "reveal">("prompt");
  const hasRules = rules.length > 0;

  useEffect(() => {
    if (!hasRules) return;
    if (visible >= exceptions.length) {
      const timeout = setTimeout(() => setDone(true), 400);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setVisible((v) => v + 1), 200);
    return () => clearTimeout(timeout);
  }, [visible, hasRules, exceptions.length]);

  if (!hasRules) {
    return (
      <LabFrame>
        <LabTitle plaque={t("lesson2.explosion.locked.plaque")}>
          {t("lesson2.explosion.locked.title")}
        </LabTitle>
        <LabLine>{t("lesson2.explosion.locked.body")}</LabLine>
        <p className="lab-line mt-4 max-w-2xl">
          {t("lesson2.explosion.locked.hint")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {onBack ? (
            <LabContinue
              label={t("lesson2.explosion.locked.back")}
              onClick={onBack}
            />
          ) : null}
          <LabContinue
            label={t("lesson2.explosion.locked.skip")}
            onClick={onContinue}
          />
        </div>
      </LabFrame>
    );
  }

  return (
    <LabFrame>
      <LabTitle plaque={t("lesson2.explosion.plaque")}>
        {t("lesson2.explosion.title")}
      </LabTitle>
      <LabLine>{t("lesson2.explosion.subhead")}</LabLine>

      <div className="lab-panel relative mt-8 min-h-[280px] overflow-hidden p-5">
        <p className="lab-eyebrow mb-4">{t("lesson2.explosion.startingRules")}</p>
        <div className="mb-6 flex flex-wrap gap-2">
          {rules.map((rule, i) => (
            <span
              key={rule}
              className={`lab-sticky ${i % 2 === 1 ? "lab-sticky-alt" : ""}`}
              style={{ transform: `rotate(${((i % 3) - 1) * 2}deg)` }}
            >
              {displayRule(rule)}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {exceptions.slice(0, visible).map((exception, index) => (
            <motion.span
              key={exception.id}
              initial={{ opacity: 0, scale: 0.8, y: -8, rotate: -8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                rotate: ((index % 7) - 3) * 2.4,
              }}
              className={`lab-sticky ${index % 3 === 1 ? "lab-sticky-alt" : ""}`}
            >
              {t("lesson2.explosion.needRule", {
                exception: exception.label.toLowerCase(),
              })}
            </motion.span>
          ))}
        </div>
      </div>

      {done && phase === "prompt" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 max-w-2xl"
        >
          <p className="lab-title text-[1.5rem] sm:text-[1.85rem]">
            <RichText text={t("lesson2.explosion.prompt")} />
          </p>
          <LabContinue onClick={() => setPhase("reveal")} />
        </motion.div>
      ) : null}

      {done && phase === "reveal" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 max-w-2xl"
        >
          <p className="lab-title text-[1.5rem] sm:text-[1.85rem]">
            {t("lesson2.explosion.revealTitle")}
          </p>
          <p className="lab-line mt-3">{t("lesson2.explosion.revealLine1")}</p>
          <p className="lab-line mt-5">{t("lesson2.explosion.revealLine2")}</p>
          <LabContinue onClick={onContinue} />
        </motion.div>
      ) : null}

      {!done ? (
        <p className="mt-6 text-sm text-[var(--lab-phosphor-dim)]">
          {t("lesson2.explosion.multiplying")}
          <span className="lab-blink">_</span>
        </p>
      ) : null}
    </LabFrame>
  );
}
