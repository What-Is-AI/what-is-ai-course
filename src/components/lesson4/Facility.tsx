"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FacilityContinue,
  FacilityFrame,
  FacilityLine,
  FacilityTitle,
} from "@/components/lesson4/FacilityFrame";
import { useT } from "@/i18n/LocaleProvider";

type Props = {
  onContinue: () => void;
};

type Beat = "idle" | "thinking" | "guessed";

export function Facility({ onContinue }: Props) {
  const t = useT();
  const reduceMotion = useReducedMotion();
  const [beat, setBeat] = useState<Beat>("idle");

  useEffect(() => {
    if (beat !== "thinking") return;
    const delay = reduceMotion ? 0 : 1100;
    const timeout = window.setTimeout(() => setBeat("guessed"), delay);
    return () => window.clearTimeout(timeout);
  }, [beat, reduceMotion]);

  const guessed = beat === "guessed";
  const thinking = beat === "thinking";

  return (
    <FacilityFrame>
      <FacilityTitle plaque={t("lesson4.facility.plaque")}>
        {t("lesson4.facility.title")}
      </FacilityTitle>
      <FacilityLine>{t("lesson4.facility.subhead")}</FacilityLine>

      <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-[minmax(0,11rem)_1fr]">
        <div className="facility-monitor flex flex-col items-center justify-center px-4 py-6">
          <p className="text-6xl" aria-hidden>
            🐱
          </p>
          <p className="mt-2 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--fac-mute)]">
            {t("lesson4.facility.aCat")}
          </p>
        </div>

        <div className="facility-monitor flex flex-col px-5 py-5 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="facility-led" aria-hidden />
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--fac-accent)]">
              {t("lesson4.facility.wall")}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {thinking ? (
              <motion.p
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-5 text-lg font-semibold text-[var(--fac-ink-soft)]"
                aria-live="polite"
              >
                {t("lesson4.facility.thinking")}
                <motion.span
                  animate={reduceMotion ? undefined : { opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                >
                  …
                </motion.span>
              </motion.p>
            ) : guessed ? (
              <motion.p
                key="guess"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 text-lg font-semibold"
                aria-live="polite"
              >
                {t("lesson4.facility.guess")}
              </motion.p>
            ) : (
              <motion.p
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-5 text-sm text-[var(--fac-mute)]"
              >
                {t("lesson4.facility.waiting")}
              </motion.p>
            )}
          </AnimatePresence>

          <dl className="mt-5 grid gap-3 text-sm">
            <div className="flex items-baseline justify-between gap-4 border-b border-[var(--fac-line)] pb-2">
              <dt className="text-[var(--fac-mute)]">{t("lesson4.facility.status")}</dt>
              <dd className="font-semibold text-[var(--fac-ink)]">
                {guessed
                  ? t("lesson4.facility.statusGuessed")
                  : t("lesson4.facility.statusCreated")}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-[var(--fac-line)] pb-2">
              <dt className="text-[var(--fac-mute)]">
                {t("lesson4.facility.experience")}
              </dt>
              <dd className="font-semibold text-[var(--fac-ink)]">
                {t("lesson4.facility.experienceValue")}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[var(--fac-mute)]">
                {t("lesson4.facility.accuracy")}
              </dt>
              <dd className="font-semibold text-[var(--fac-ink-soft)]">
                {guessed
                  ? t("lesson4.facility.accuracyCoin")
                  : t("lesson4.facility.accuracyUntrained")}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {beat === "idle" ? (
        <FacilityContinue
          label={t("lesson4.facility.ask")}
          onClick={() => setBeat("thinking")}
        />
      ) : null}

      <AnimatePresence>
        {guessed ? (
          <motion.div
            key="mystery"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 max-w-2xl"
          >
            <p className="facility-title text-[clamp(1.35rem,3.2vw,1.85rem)]">
              {t("lesson4.facility.mystery")}
            </p>
            <FacilityContinue
              label={t("lesson4.facility.cta")}
              onClick={onContinue}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </FacilityFrame>
  );
}
