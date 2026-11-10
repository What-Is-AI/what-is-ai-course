"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FacilityContinue,
  FacilityFrame,
  FacilityLine,
  FacilityTitle,
} from "@/components/lesson4/FacilityFrame";
import { useLesson4Copy } from "@/lib/useLesson4Copy";
import { type TrainFlash } from "@/lib/lesson4-data";
import { useTrackChoice } from "@/lib/analytics/useTrackChoice";
import { QStep } from "@/lib/analytics/questionIds";
import { saveLocal } from "@/lib/storage";

type Phase = "predict" | "run" | "payoff";

type Props = {
  onContinue: () => void;
};

function LiveCurve({
  stages,
  empty,
}: {
  stages: TrainFlash[];
  empty?: boolean;
}) {
  const { t, locale } = useLesson4Copy();
  const width = 340;
  const height = 180;
  const pad = { t: 18, r: 14, b: 30, l: 38 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const maxLog = Math.log10(1_000_000);

  const points = stages.map((p) => {
    const x =
      pad.l +
      (p.examples === 0 ? 0 : Math.log10(p.examples) / maxLog) * innerW;
    const y = pad.t + (1 - (p.accuracy - 45) / 55) * innerH;
    return { ...p, x, y };
  });

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={
        empty
          ? t("lesson4.train.ariaEmpty")
          : t("lesson4.train.ariaFilled", {
              accuracy: last?.accuracy ?? 50,
              examples: (last?.examples ?? 0).toLocaleString(locale),
            })
      }
    >
      <line
        x1={pad.l}
        y1={pad.t}
        x2={pad.l}
        y2={height - pad.b}
        stroke="rgba(230,234,238,0.2)"
      />
      <line
        x1={pad.l}
        y1={height - pad.b}
        x2={width - pad.r}
        y2={height - pad.b}
        stroke="rgba(230,234,238,0.2)"
      />
      <text x={4} y={pad.t + 4} fill="var(--fac-mute)" fontSize="9">
        {t("lesson4.train.chartMax")}
      </text>
      <text x={8} y={height - pad.b} fill="var(--fac-mute)" fontSize="9">
        {t("lesson4.train.chartMin")}
      </text>
      <text
        x={width - pad.r}
        y={height - 8}
        textAnchor="end"
        fill="var(--fac-mute)"
        fontSize="9"
      >
        {t("lesson4.train.chartEnd")}
      </text>
      {!empty && points.length > 1 ? (
        <path
          d={path}
          fill="none"
          stroke="var(--fac-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
      {!empty
        ? points.map((p) => (
            <circle
              key={`${p.examples}-${p.accuracy}`}
              cx={p.x}
              cy={p.y}
              r={p.dip ? 5 : 3.5}
              fill={p.dip ? "var(--fac-warn)" : "var(--fac-accent)"}
            />
          ))
        : (
            <circle
              cx={pad.l}
              cy={pad.t + (1 - (50 - 45) / 55) * innerH}
              r={3.5}
              fill="var(--fac-mute)"
            />
          )}
      {!empty && last ? (
        <text
          x={Math.min(last.x, width - pad.r - 24)}
          y={last.y - 12}
          fill="var(--fac-ink)"
          fontSize="11"
          fontWeight="600"
        >
          ~{last.accuracy}%
        </text>
      ) : null}
    </svg>
  );
}

export function TrainTheModel({ onContinue }: Props) {
  const { t, locale, curveBets, trainStages } = useLesson4Copy();
  const trackChoice = useTrackChoice();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("predict");
  const [bet, setBet] = useState<(typeof curveBets)[number] | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [sawDip, setSawDip] = useState(false);
  const holdRef = useRef<number | null>(null);
  const ffRef = useRef(false);

  const stage = trainStages[stageIndex];
  const visited = trainStages.slice(0, stageIndex + 1);
  const done = Boolean(stage?.plateau);

  const advance = useCallback(() => {
    setStageIndex((i) => {
      const next = Math.min(i + 1, trainStages.length - 1);
      const s = trainStages[next];
      if (s?.dip) setSawDip(true);
      return next;
    });
  }, [trainStages]);

  const jumpToEnd = useCallback(() => {
    setStageIndex(trainStages.length - 1);
    setSawDip(true);
  }, [trainStages.length]);

  useEffect(() => {
    if (phase !== "run" || !done) return;
    const timeout = window.setTimeout(
      () => setPhase("payoff"),
      reduceMotion ? 0 : 600,
    );
    return () => window.clearTimeout(timeout);
  }, [phase, done, reduceMotion]);

  function pickBet(choice: (typeof curveBets)[number]) {
    setBet(choice);
    saveLocal("lesson4-curve-bet", choice.id);
    trackChoice({ questionId: QStep.curveBet, selectedOptionId: choice.id });
  }

  function startHold() {
    if (done) return;
    ffRef.current = true;
    if (reduceMotion) {
      jumpToEnd();
      return;
    }
    const tick = () => {
      if (!ffRef.current) return;
      setStageIndex((i) => {
        if (i >= trainStages.length - 1) {
          ffRef.current = false;
          return i;
        }
        const next = i + 1;
        if (trainStages[next]?.dip) setSawDip(true);
        return next;
      });
      holdRef.current = window.setTimeout(tick, 90);
    };
    holdRef.current = window.setTimeout(tick, 90);
  }

  function endHold() {
    ffRef.current = false;
    if (holdRef.current) {
      window.clearTimeout(holdRef.current);
      holdRef.current = null;
    }
  }

  useEffect(() => () => endHold(), []);

  return (
    <FacilityFrame>
      <AnimatePresence mode="wait">
        {phase === "predict" ? (
          <motion.div
            key="predict"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <FacilityTitle plaque={t("lesson4.train.plaque")}>
              {t("lesson4.train.title")}
            </FacilityTitle>
            <FacilityLine>{t("lesson4.train.predictSub")}</FacilityLine>

            <div className="mt-6 grid w-full gap-5 lg:grid-cols-[minmax(16rem,1.15fr)_minmax(14rem,0.85fr)] lg:items-start lg:gap-8">
              <div className="facility-monitor px-4 py-5 sm:px-5">
                <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--fac-mute)]">
                  {t("lesson4.train.emptyChart")}
                </p>
                <LiveCurve
                  stages={[{ id: "0", examples: 0, accuracy: 50 }]}
                  empty
                />
              </div>

              <div className="flex min-w-0 flex-col gap-2.5">
                <p className="facility-choice-cue">{t("lesson4.shared.chooseOne")}</p>
                <div
                  className="flex flex-col gap-2.5"
                  role="radiogroup"
                  aria-label={t("lesson4.train.predictAria")}
                >
                  {curveBets.map((option, i) => {
                    const selected = bet?.id === option.id;
                    const dimmed = bet !== null && !selected;
                    const mark = String.fromCharCode(65 + i);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => pickBet(option)}
                        className={`facility-choice facility-choice-marked${
                          !bet ? " facility-choice-invite" : ""
                        }${selected ? " is-selected" : ""}${
                          dimmed ? " is-dimmed" : ""
                        }`}
                      >
                        <span className="facility-choice-mark" aria-hidden>
                          {mark}
                        </span>
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>

                <FacilityContinue
                  className="mt-3"
                  label={t("lesson4.train.trainCta")}
                  disabled={!bet}
                  onClick={() => setPhase("run")}
                />
              </div>
            </div>
          </motion.div>
        ) : null}

        {phase === "run" ? (
          <motion.div
            key="run"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <FacilityTitle plaque={t("lesson4.train.plaque")}>
              {t("lesson4.train.title")}
            </FacilityTitle>
            <FacilityLine>{t("lesson4.train.runSub")}</FacilityLine>

            <div className="mt-6 grid w-full gap-5 lg:grid-cols-[minmax(16rem,1.15fr)_minmax(14rem,0.85fr)] lg:items-start lg:gap-8">
              <div className="facility-monitor px-4 py-5 sm:px-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--fac-accent)]">
                    {t("lesson4.train.overTime")}
                  </p>
                  <p className="text-sm tabular-nums text-[var(--fac-ink-soft)]">
                    {t("lesson4.train.examplesAcc", {
                      examples: stage.examples.toLocaleString(locale),
                      accuracy: stage.accuracy,
                    })}
                  </p>
                </div>
                <LiveCurve stages={visited} />

                <AnimatePresence mode="wait">
                  {stage.prediction ? (
                    <motion.p
                      key={`${stage.examples}-${stage.prediction}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 text-sm font-semibold"
                      aria-live="polite"
                    >
                      {stage.prediction}
                      {stage.result ? (
                        <span className="font-medium text-[var(--fac-ink-soft)]">
                          {" "}
                          · {stage.result}
                        </span>
                      ) : null}
                    </motion.p>
                  ) : null}
                </AnimatePresence>

                {sawDip && stage.dip ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-sm leading-relaxed text-[var(--fac-warn)]"
                  >
                    {stage.dipGloss}
                  </motion.p>
                ) : null}
              </div>

              <div className="flex min-w-0 flex-col gap-2.5">
                {!done ? (
                  <>
                    <p className="facility-choice-cue">{t("lesson4.train.drive")}</p>
                    <button
                      type="button"
                      onClick={advance}
                      className="facility-btn facility-choice-invite w-full"
                    >
                      {t("lesson4.train.trainCta")}
                    </button>
                    <button
                      type="button"
                      onPointerDown={startHold}
                      onPointerUp={endHold}
                      onPointerLeave={endHold}
                      onPointerCancel={endHold}
                      className="facility-btn-secondary w-full"
                    >
                      {t("lesson4.train.holdFf")}
                    </button>
                    <p className="mt-1 text-xs leading-snug text-[var(--fac-mute)]">
                      {t("lesson4.train.paceHint")}
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-medium text-[var(--fac-accent)]">
                    {t("lesson4.train.plateauReached")}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}

        {phase === "payoff" ? (
          <motion.div
            key="payoff"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FacilityTitle plaque={t("lesson4.train.plaque")}>
              {t("lesson4.train.payoffTitle")}
            </FacilityTitle>
            <div className="facility-panel mt-2 max-w-2xl px-5 py-5">
              <p className="facility-eyebrow mb-2">{t("lesson4.train.yourBet")}</p>
              <p className="text-lg font-semibold">
                {t("lesson4.train.payoffGuess", { bet: bet?.label ?? "—" })}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--fac-ink-soft)]">
                {t("lesson4.train.payoffBody")}
              </p>
            </div>
            <FacilityContinue onClick={onContinue} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </FacilityFrame>
  );
}
