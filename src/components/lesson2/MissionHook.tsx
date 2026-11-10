"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  LabContinue,
  LabFrame,
  LabLine,
  LabTitle,
} from "@/components/lesson2/LabFrame";
import { useT } from "@/i18n/LocaleProvider";

type Props = {
  onContinue: () => void;
};

export function MissionHook({ onContinue }: Props) {
  const t = useT();
  const [ready, setReady] = useState(false);

  return (
    <LabFrame>
      <LabTitle plaque={t("lesson2.mission.plaque")}>
        {t("lesson2.mission.title")}
      </LabTitle>
      {!ready ? (
        <>
          <LabLine>{t("lesson2.mission.subhead")}</LabLine>
          <LabContinue
            label={t("lesson2.mission.open")}
            onClick={() => setReady(true)}
          />
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2"
        >
          <div className="lab-crt max-w-xl px-5 py-7 sm:px-7">
            <p className="relative z-10 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--lab-phosphor-dim)]">
              {t("lesson2.mission.fileLabel")}
            </p>
            <p className="relative z-10 mt-4 text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
              {t("lesson2.mission.briefTitle")}
            </p>
            <p className="relative z-10 mt-4 text-sm leading-relaxed text-[var(--lab-phosphor-dim)]">
              {t("lesson2.mission.line1")}
              <br />
              {t("lesson2.mission.line2")}
              <span className="lab-blink">_</span>
            </p>
          </div>
          <p className="lab-line mt-8">{t("lesson2.mission.coreQuestion")}</p>
          <LabContinue label={t("lesson2.mission.cta")} onClick={onContinue} />
        </motion.div>
      )}
    </LabFrame>
  );
}
