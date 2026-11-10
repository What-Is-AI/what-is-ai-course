"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
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

type Point = { examples: number; accuracy: number };
type Era = "now" | "early";

const HISTORY: Point[] = [
  { examples: 0, accuracy: 50 },
  { examples: 100, accuracy: 68 },
  { examples: 1_000, accuracy: 85 },
  { examples: 10_000, accuracy: 94 },
  { examples: 1_000_000, accuracy: 98 },
  { examples: 100_000_000, accuracy: 98 },
];

const BASE_EXAMPLES = 100_000_000;
const BASE_ACC = 98;
const EARLY_BASE_EXAMPLES = 0;
const EARLY_BASE_ACC = 50;
const EARLY_AFTER_ONE = 68;

function PlateauCurve({
  examples,
  accuracy,
  twitch,
  era,
}: {
  examples: number;
  accuracy: number;
  twitch: boolean;
  era: Era;
}) {
  const { t, locale } = useLesson4Copy();
  const width = 340;
  const height = 170;
  const pad = { t: 16, r: 14, b: 28, l: 38 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const maxLog = Math.log10(
    era === "early" ? Math.max(examples, 100) : Math.max(examples, BASE_EXAMPLES),
  );

  const histPoints =
    era === "early"
      ? [{ examples: 0, accuracy: 50 }].map((p) => {
          const x = pad.l;
          const y = pad.t + (1 - (p.accuracy - 45) / 55) * innerH;
          return { ...p, x, y };
        })
      : HISTORY.map((p) => {
          const x =
            pad.l +
            (p.examples === 0 ? 0 : Math.log10(p.examples) / maxLog) * innerW;
          const y = pad.t + (1 - (p.accuracy - 45) / 55) * innerH;
          return { ...p, x, y };
        });

  const liveX =
    examples === 0
      ? pad.l
      : pad.l + (Math.log10(examples) / maxLog) * innerW;
  const live = {
    x: liveX,
    y: pad.t + (1 - (accuracy - 45) / 55) * innerH,
  };

  const pathPoints =
    era === "early"
      ? examples > 0
        ? [
            { x: pad.l, y: pad.t + (1 - (50 - 45) / 55) * innerH },
            live,
          ]
        : [live]
      : [...histPoints.slice(0, -1), live];

  const path = pathPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={t("lesson4.oneMore.aria", {
        accuracy: accuracy.toFixed(era === "early" ? 0 : 3),
        examples: examples.toLocaleString(locale),
      })}
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
      <text x={4} y={height - pad.b} fill="var(--fac-mute)" fontSize="9">
        50%
      </text>
      <path
        d={path}
        fill="none"
        stroke={era === "early" ? "var(--fac-warn)" : "var(--fac-accent)"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.circle
        cx={live.x}
        cy={live.y}
        r={twitch ? 6 : 4}
        fill={era === "early" ? "var(--fac-warn)" : "var(--fac-accent)"}
        animate={twitch ? { r: [6, 4, 5] } : undefined}
      />
      <text
        x={Math.min(live.x, width - pad.r - 28)}
        y={live.y - 10}
        fill="var(--fac-ink)"
        fontSize="11"
        fontWeight="600"
      >
        ~
        {era === "early"
          ? `${Math.round(accuracy)}%`
          : accuracy.toFixed(accuracy >= 98.01 ? 2 : 1)}
        %
      </text>
    </svg>
  );
}

export function OneMoreExample({ onContinue }: Props) {
  const { t, locale } = useLesson4Copy();
  const [era, setEra] = useState<Era>("now");
  const [extraOnes, setExtraOnes] = useState(0);
  const [extraMillion, setExtraMillion] = useState(false);
  const [earlyOnes, setEarlyOnes] = useState(0);
  const [twitch, setTwitch] = useState(false);
  const [lastDelta, setLastDelta] = useState<string | null>(null);

  const examples =
    era === "now"
      ? BASE_EXAMPLES + extraOnes + (extraMillion ? 1_000_000 : 0)
      : EARLY_BASE_EXAMPLES + earlyOnes;

  const accuracy =
    era === "now"
      ? BASE_ACC + extraOnes * 0.001 + (extraMillion ? 0.04 : 0)
      : earlyOnes === 0
        ? EARLY_BASE_ACC
        : EARLY_AFTER_ONE;

  const showMillion = era === "now" && extraOnes >= 2;
  const showReveal = extraOnes >= 2 && extraMillion;
  const showRewind = extraOnes >= 1;

  function pulse(delta: string) {
    setLastDelta(delta);
    setTwitch(true);
    window.setTimeout(() => setTwitch(false), 350);
  }

  function addOne() {
    if (era === "now") {
      setExtraOnes((n) => n + 1);
      pulse(t("lesson4.oneMore.deltaOne"));
      return;
    }
    if (earlyOnes >= 1) return;
    setEarlyOnes(1);
    pulse(t("lesson4.oneMore.deltaEarly"));
  }

  function addMillion() {
    setExtraMillion(true);
    pulse(t("lesson4.oneMore.deltaMillion"));
  }

  return (
    <FacilityFrame>
      <FacilityTitle compact plaque={t("lesson4.oneMore.plaque")}>
        {t("lesson4.oneMore.title")}
      </FacilityTitle>
      <FacilityLine compact>
        {era === "now"
          ? t("lesson4.oneMore.subNow")
          : t("lesson4.oneMore.subEarly")}
      </FacilityLine>

      {showRewind ? (
        <div
          className="mt-4 inline-flex rounded-sm border border-[var(--fac-line)] p-1"
          role="group"
          aria-label={t("lesson4.oneMore.compareAria")}
        >
          <button
            type="button"
            aria-pressed={era === "now"}
            onClick={() => {
              setEra("now");
              setLastDelta(null);
            }}
            className={`rounded-sm px-3 py-1.5 text-sm font-semibold transition ${
              era === "now"
                ? "bg-[var(--fac-accent)] text-[#061512]"
                : "text-[var(--fac-ink-soft)]"
            }`}
          >
            {t("lesson4.oneMore.nowToggle")}
          </button>
          <button
            type="button"
            aria-pressed={era === "early"}
            onClick={() => {
              setEra("early");
              setLastDelta(null);
            }}
            className={`rounded-sm px-3 py-1.5 text-sm font-semibold transition ${
              era === "early"
                ? "bg-[var(--fac-warn)] text-[#1a1208]"
                : "text-[var(--fac-ink-soft)]"
            }`}
          >
            {t("lesson4.oneMore.rewindToggle")}
          </button>
        </div>
      ) : null}

      <div className="mt-5 grid w-full gap-5 lg:grid-cols-[minmax(16rem,1.15fr)_minmax(14rem,0.85fr)] lg:items-start lg:gap-8">
        <div className="facility-monitor px-4 py-5 sm:px-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--fac-accent)]">
              {era === "early"
                ? t("lesson4.oneMore.chartEarly")
                : t("lesson4.oneMore.chartNow")}
            </p>
            <p className="text-sm tabular-nums text-[var(--fac-ink-soft)]">
              {t("lesson4.oneMore.examplesAcc", {
                examples: examples.toLocaleString(locale),
                accuracy:
                  era === "early"
                    ? Math.round(accuracy)
                    : accuracy.toFixed(3),
              })}
            </p>
          </div>
          <PlateauCurve
            examples={Math.max(examples, era === "early" ? 0 : 1)}
            accuracy={accuracy}
            twitch={twitch}
            era={era}
          />
          <AnimatePresence>
            {lastDelta ? (
              <motion.p
                key={`${era}-${lastDelta}-${examples}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-2 text-sm font-semibold ${
                  era === "early"
                    ? "text-[var(--fac-warn)]"
                    : "text-[var(--fac-mute)]"
                }`}
                aria-live="polite"
              >
                {era === "early"
                  ? t("lesson4.oneMore.twitchEarly", { delta: lastDelta })
                  : t("lesson4.oneMore.twitchNow", { delta: lastDelta })}
              </motion.p>
            ) : null}
          </AnimatePresence>

          {showReveal ? (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm leading-relaxed text-[var(--fac-ink-soft)]"
            >
              {t("lesson4.oneMore.reveal")}
            </motion.p>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-2.5">
          <p className="facility-choice-cue">{t("lesson4.oneMore.addCue")}</p>
          <button
            type="button"
            onClick={addOne}
            disabled={era === "early" && earlyOnes >= 1}
            className={`facility-btn w-full disabled:opacity-35${
              !showReveal && !(era === "early" && earlyOnes >= 1)
                ? " facility-choice-invite"
                : ""
            }`}
          >
            {era === "early"
              ? earlyOnes === 0
                ? t("lesson4.oneMore.showOne")
                : t("lesson4.oneMore.alreadyDid")
              : extraOnes === 0
                ? t("lesson4.oneMore.showOne")
                : t("lesson4.oneMore.plusOne")}
          </button>
          {showMillion ? (
            <button
              type="button"
              onClick={addMillion}
              disabled={extraMillion}
              className="facility-btn-secondary w-full disabled:opacity-35"
            >
              {extraMillion
                ? t("lesson4.oneMore.millionDone")
                : t("lesson4.oneMore.plusMillion")}
            </button>
          ) : null}

          {showReveal ? (
            <FacilityContinue
              className="mt-1"
              label={t("lesson4.oneMore.wait")}
              onClick={onContinue}
            />
          ) : (
            <p className="text-xs leading-snug text-[var(--fac-mute)]">
              {t("lesson4.oneMore.watchHint")}
            </p>
          )}
        </div>
      </div>
    </FacilityFrame>
  );
}
