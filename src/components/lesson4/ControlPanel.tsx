"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  FacilityContinue,
  FacilityFrame,
  FacilityLine,
  FacilityTitle,
} from "@/components/lesson4/FacilityFrame";
import { useLesson4Copy } from "@/lib/useLesson4Copy";

type Props = {
  onContinue: () => void;
};

type Dial = {
  id: string;
  label: string;
  value: number;
};

const START_PRED = 97;
const AFTER_SINGLE = 96;
const AFTER_ALL = 71;

function makeDials(): Dial[] {
  return Array.from({ length: 16 }, (_, i) => ({
    id: `d${i + 1}`,
    label: `v${i + 1}`,
    value: 0.35 + ((i * 17) % 50) / 100,
  }));
}

export function ControlPanel({ onContinue }: Props) {
  const { t, formatPrediction } = useLesson4Copy();
  const dials = useMemo(() => makeDials(), []);
  const [tried, setTried] = useState<string[]>([]);
  const [lastTried, setLastTried] = useState<string | null>(null);
  const [allNudged, setAllNudged] = useState(false);
  const [offDial, setOffDial] = useState<string | null>(null);

  const prediction = allNudged
    ? AFTER_ALL
    : lastTried
      ? AFTER_SINGLE
      : START_PRED;

  const canNudgeAll = tried.length >= 2 && !allNudged;

  function tapDial(id: string) {
    if (allNudged) return;
    setLastTried(id);
    setOffDial(id);
    setTried((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  const tapCue =
    tried.length === 0
      ? t("lesson4.controlPanel.tapFirst")
      : tried.length === 1
        ? t("lesson4.controlPanel.tapAnother")
        : t("lesson4.controlPanel.tapMore");

  const hint =
    tried.length === 0
      ? t("lesson4.controlPanel.hintFirst")
      : tried.length === 1
        ? t("lesson4.controlPanel.hintSecond")
        : t("lesson4.controlPanel.hintTogether");

  return (
    <FacilityFrame>
      <FacilityTitle compact plaque={t("lesson4.controlPanel.plaque")}>
        {t("lesson4.controlPanel.title")}
      </FacilityTitle>
      <FacilityLine compact>{t("lesson4.controlPanel.subhead")}</FacilityLine>

      <div className="mt-5 grid w-full gap-5 lg:grid-cols-[minmax(16rem,1.2fr)_minmax(13rem,0.8fr)] lg:items-start lg:gap-8">
        <div className="facility-monitor px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--fac-line)] pb-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--fac-mute)]">
                {t("lesson4.controlPanel.predEyebrow")}
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {formatPrediction("cat", prediction)}
              </p>
            </div>
            {allNudged ? (
              <p className="text-sm font-semibold text-[var(--fac-accent)]">
                {t("lesson4.controlPanel.shifted")}
              </p>
            ) : lastTried ? (
              <p className="text-sm font-semibold text-[var(--fac-warn)]">
                {t("lesson4.controlPanel.barely")}
              </p>
            ) : null}
          </div>

          <p className="mt-4 text-xs leading-snug text-[var(--fac-mute)] sm:text-sm">
            {t("lesson4.controlPanel.guessHint")}
          </p>

          {!allNudged ? (
            <p className="facility-choice-cue mt-4">{tapCue}</p>
          ) : null}

          <div className="mt-3 grid grid-cols-4 gap-2">
            {dials.map((dial) => {
              const isOff = offDial === dial.id && !allNudged;
              const isTried = tried.includes(dial.id);
              const litAll = allNudged;
              return (
                <button
                  key={dial.id}
                  type="button"
                  disabled={allNudged}
                  onClick={() => tapDial(dial.id)}
                  aria-label={t("lesson4.controlPanel.testAria", {
                    label: dial.label,
                  })}
                  aria-pressed={isOff || litAll}
                  className={`facility-key facility-choice-compact text-left${
                    !allNudged && !isTried ? " facility-key-invite" : ""
                  }${isOff ? " is-off" : ""}${
                    isTried && !isOff && !litAll ? " is-tried" : ""
                  }${litAll ? " is-spread" : ""}`}
                >
                  <span className="facility-key-led" aria-hidden />
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-[var(--fac-mute)]">
                    {dial.label}
                  </p>
                  <p className="mt-1 font-semibold tabular-nums text-sm">
                    {isOff ? t("lesson4.controlPanel.off") : dial.value.toFixed(2)}
                  </p>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {lastTried && !allNudged ? (
              <motion.p
                key={lastTried}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-sm leading-relaxed text-[var(--fac-ink-soft)]"
                aria-live="polite"
              >
                {t("lesson4.controlPanel.notTheOne", {
                  confidence: AFTER_SINGLE,
                })}
              </motion.p>
            ) : null}
          </AnimatePresence>

          {allNudged ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-3"
            >
              <p className="text-sm leading-relaxed text-[var(--fac-ink-soft)]">
                {t("lesson4.controlPanel.noCatDial")}
              </p>
              <p className="text-sm leading-relaxed text-[var(--fac-ink-soft)]">
                {t("lesson4.controlPanel.parameters")}
              </p>
            </motion.div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-2.5">
          {!allNudged ? (
            <>
              <p className="facility-choice-cue">
                {t("lesson4.controlPanel.tryADial")}
              </p>
              <p className="text-xs leading-snug text-[var(--fac-mute)]">{hint}</p>
              {canNudgeAll ? (
                <button
                  type="button"
                  onClick={() => {
                    setAllNudged(true);
                    setOffDial(null);
                  }}
                  className="facility-btn facility-choice-invite w-full"
                >
                  {t("lesson4.controlPanel.nudgeAll")}
                </button>
              ) : null}
            </>
          ) : (
            <>
              <p className="facility-choice-cue">
                {t("lesson4.controlPanel.seePoint")}
              </p>
              <FacilityContinue
                className="mt-0"
                label={t("lesson4.controlPanel.cta")}
                onClick={onContinue}
              />
            </>
          )}
        </div>
      </div>
    </FacilityFrame>
  );
}
