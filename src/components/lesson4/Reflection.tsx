"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  FacilityContinue,
  FacilityFrame,
  FacilityTitle,
} from "@/components/lesson4/FacilityFrame";
import { useLesson4Copy } from "@/lib/useLesson4Copy";
import { saveLocal } from "@/lib/storage";

type Props = {
  predictedMechanism: string | null;
  onContinue: () => void;
};

export function Reflection({ predictedMechanism, onContinue }: Props) {
  const { t, assumptionById, weatherChoices } = useLesson4Copy();
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const [weather, setWeather] = useState<string | null>(null);
  const weatherRevealed = weather !== null;

  const bet = assumptionById(predictedMechanism);
  const weatherCorrect = weatherChoices.find((c) => c.id === weather)?.correct;

  function save() {
    saveLocal("lesson4-reflection", {
      before: before.trim(),
      after: after.trim(),
      weather,
      predictedMechanism,
      savedAt: new Date().toISOString(),
    });
    onContinue();
  }

  const canSave =
    before.trim().length > 0 && after.trim().length > 0 && weatherRevealed;

  return (
    <FacilityFrame>
      <FacilityTitle plaque={t("lesson4.reflection.plaque")}>
        {weatherRevealed
          ? t("lesson4.reflection.titleComplete")
          : t("lesson4.reflection.titleCheck")}
      </FacilityTitle>

      <div className="facility-panel max-w-2xl px-5 py-4">
        <p className="facility-eyebrow mb-2">{t("lesson4.reflection.readBet")}</p>
        {bet ? (
          <>
            <p className="text-sm leading-relaxed text-[var(--fac-ink)]">
              {t("lesson4.reflection.youBet", {
                bet: bet.getsSmarterBy ?? t("lesson4.reflection.unsure"),
              })}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--fac-ink-soft)]">
              {t("lesson4.reflection.watched")}
            </p>
            <p className="mt-2 text-sm text-[var(--fac-mute)]">
              {bet.borneOut
                ? t("lesson4.reflection.matched")
                : bet.getsSmarterBy
                  ? t("lesson4.reflection.different")
                  : t("lesson4.reflection.gotAnswer")}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm leading-relaxed text-[var(--fac-ink)]">
              {t("lesson4.reflection.noBet")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--fac-ink-soft)]">
              {t("lesson4.reflection.watched")}
            </p>
          </>
        )}
      </div>

      <div className="mt-8 max-w-2xl">
        <p className="facility-eyebrow mb-2">{t("lesson4.reflection.doCheck")}</p>
        <p className="facility-line font-semibold text-[var(--fac-ink)]">
          {t("lesson4.reflection.weatherQ")}
        </p>
        <p className="facility-choice-cue mt-5">{t("lesson4.shared.chooseOne")}</p>
        <div
          className="mt-3 grid gap-3"
          role="radiogroup"
          aria-label={t("lesson4.reflection.weatherAria")}
        >
          {weatherChoices.map((option, i) => {
            const mark = String.fromCharCode(65 + i);
            const isPicked = weather === option.id;
            let stateClass = "";
            if (!weatherRevealed) {
              stateClass = " facility-choice-invite";
            } else if (option.correct) {
              stateClass = " is-correct";
            } else if (isPicked) {
              stateClass = " is-miss";
            } else {
              stateClass = " is-dimmed";
            }

            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isPicked}
                disabled={weatherRevealed}
                onClick={() => setWeather(option.id)}
                className={`facility-choice facility-choice-marked${stateClass}`}
              >
                <span className="facility-choice-mark" aria-hidden>
                  {mark}
                </span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {weatherRevealed ? (
          <motion.div
            key="log"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 max-w-2xl"
          >
            <p className="text-sm font-semibold text-[var(--fac-accent)]">
              {weatherCorrect
                ? t("lesson4.reflection.weatherYes")
                : t("lesson4.reflection.weatherClose")}
            </p>

            <p className="facility-line mt-6">{t("lesson4.reflection.noQuiz")}</p>

            <p className="facility-eyebrow mt-6 mb-3">
              {t("lesson4.reflection.writeLog")}
            </p>
            <div className="grid gap-5">
              <label className="facility-panel block px-5 py-5">
                <span className="facility-eyebrow mb-3 block">
                  {t("lesson4.reflection.beforeLabel")}
                </span>
                <textarea
                  value={before}
                  onChange={(e) => setBefore(e.target.value)}
                  rows={3}
                  placeholder={t("lesson4.reflection.beforePlaceholder")}
                  className="w-full resize-none border-0 bg-transparent px-0 py-1 text-lg tracking-tight text-[var(--fac-ink)] outline-none placeholder:text-[var(--fac-mute)]"
                />
              </label>

              <label className="facility-panel block px-5 py-5">
                <span className="facility-eyebrow mb-3 block">
                  {t("lesson4.reflection.afterLabel")}
                </span>
                <textarea
                  value={after}
                  onChange={(e) => setAfter(e.target.value)}
                  rows={3}
                  placeholder={t("lesson4.reflection.afterPlaceholder")}
                  className="w-full resize-none border-0 bg-transparent px-0 py-1 text-lg tracking-tight text-[var(--fac-ink)] outline-none placeholder:text-[var(--fac-mute)]"
                />
              </label>
            </div>

            <FacilityContinue
              label={t("lesson4.reflection.save")}
              disabled={!canSave}
              onClick={save}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </FacilityFrame>
  );
}
