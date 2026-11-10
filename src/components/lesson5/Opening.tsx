"use client";

import { useMemo, useState } from "react";
import {
  NetworkContinue,
  NetworkFrame,
  NetworkLine,
  NetworkTitle,
} from "@/components/lesson5/NetworkFrame";
import { useT } from "@/i18n/LocaleProvider";

type Props = { onContinue: () => void };
type ChoiceId = "same" | "adjust" | "rule";

const INPUTS = [1.2, 0.9] as const;
const STEP = 0.1;

function score(w1: number, w2: number) {
  const raw = w1 * INPUTS[0] + w2 * INPUTS[1];
  const cat = Math.round(Math.min(96, Math.max(8, 50 + raw * 80)));
  const kind = cat >= 50 ? ("cat" as const) : ("dog" as const);
  const confidence = kind === "cat" ? cat : 100 - cat;
  return { kind, confidence };
}

function formatW(n: number) {
  const sign = n >= 0 ? "+" : "−";
  return `${sign}${Math.abs(n).toFixed(2)}`;
}

function ConnectionRow({
  value,
  interactive,
  invite,
  onUp,
  onDown,
  upLabel,
  downLabel,
  inputLabel,
}: {
  value: number;
  interactive: boolean;
  invite: boolean;
  onUp: () => void;
  onDown: () => void;
  upLabel: string;
  downLabel: string;
  inputLabel: string;
}) {
  return (
    <div className="network-conn-row">
      <span className="network-conn-io">{inputLabel}</span>
      <div className="network-conn-path">
        <span className="network-conn-rail" aria-hidden />
        <div className="network-conn-number">
          <span className="network-conn-value" aria-live="polite">
            {formatW(value)}
          </span>
          {interactive ? (
            <div className="network-mini-unit-nudge">
              <button
                type="button"
                className={`network-nudge-btn${invite ? " is-invite" : ""}`}
                aria-label={upLabel}
                onClick={onUp}
              >
                ↑
              </button>
              <button
                type="button"
                className={`network-nudge-btn${invite ? " is-invite" : ""}`}
                aria-label={downLabel}
                onClick={onDown}
              >
                ↓
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function Opening({ onContinue }: Props) {
  const t = useT();
  const [picked, setPicked] = useState<ChoiceId | null>(null);
  const [w1, setW1] = useState(0.12);
  const [w2, setW2] = useState(-0.35);
  const [nudged, setNudged] = useState(false);

  const pred = useMemo(() => score(w1, w2), [w1, w2]);
  const wrong = pred.kind !== "cat";
  const predLabel = t(`lesson5.shared.${pred.kind}`);
  const choseAdjust = picked === "adjust";

  const nudge = (which: 1 | 2, dir: 1 | -1) => {
    setNudged(true);
    if (which === 1) setW1((v) => Math.max(-1, Math.min(1, v + dir * STEP)));
    else setW2((v) => Math.max(-1, Math.min(1, v + dir * STEP)));
  };

  return (
    <NetworkFrame>
      <NetworkTitle plaque={t("lesson5.opening.plaque")}>
        {t("lesson5.opening.title")}
      </NetworkTitle>

      <NetworkLine>{t("lesson5.opening.body1")}</NetworkLine>
      <NetworkLine compact>{t("lesson5.opening.body2")}</NetworkLine>

      <p className="network-eyebrow mt-8 mb-3">
        {choseAdjust
          ? t("lesson5.opening.tryChanging")
          : t("lesson5.opening.tinyExample")}
      </p>

      <div
        className="network-mini-unit"
        role="group"
        aria-label={t("lesson5.opening.diagramAria")}
      >
        <div className="network-mini-unit-inputs">
          <ConnectionRow
            value={w1}
            interactive={choseAdjust}
            invite={choseAdjust && !nudged}
            inputLabel={t("lesson5.opening.input")}
            upLabel={t("lesson5.opening.up", { n: 1 })}
            downLabel={t("lesson5.opening.down", { n: 1 })}
            onUp={() => nudge(1, 1)}
            onDown={() => nudge(1, -1)}
          />
          <ConnectionRow
            value={w2}
            interactive={choseAdjust}
            invite={choseAdjust && !nudged}
            inputLabel={t("lesson5.opening.input")}
            upLabel={t("lesson5.opening.up", { n: 2 })}
            downLabel={t("lesson5.opening.down", { n: 2 })}
            onUp={() => nudge(2, 1)}
            onDown={() => nudge(2, -1)}
          />
        </div>

        <div className="network-mini-unit-join" aria-hidden>
          <span className="network-mini-unit-brace" />
          <span className="network-mini-unit-arrow">→</span>
        </div>

        <div className="network-mini-unit-out">
          <p className="network-eyebrow mb-1">
            {t("lesson5.opening.prediction")}
          </p>
          <p
            key={`${pred.kind}-${pred.confidence}`}
            className={`network-mini-unit-pred${wrong ? " is-wrong" : " is-ok"}`}
            aria-live="polite"
          >
            {predLabel} · {pred.confidence}%
          </p>
        </div>
      </div>

      {!choseAdjust ? (
        <>
          <p className="network-ask mt-8">{t("lesson5.opening.ask")}</p>
          <div
            className="mt-3 grid max-w-2xl gap-3"
            role="radiogroup"
            aria-label={t("lesson5.opening.askAria")}
          >
            {(
              [
                ["same", "A"],
                ["adjust", "B"],
                ["rule", "C"],
              ] as const
            ).map(([id, mark]) => {
              const selected = picked === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPicked(id)}
                  className={`network-choice${selected ? " is-selected" : ""}`}
                >
                  <span className="network-choice-mark" aria-hidden>
                    {mark}
                  </span>
                  <span>{t(`lesson5.opening.choices.${id}`)}</span>
                </button>
              );
            })}
          </div>
          {picked ? (
            <p className="mt-4 text-sm text-[var(--network-miss)]">
              {t("lesson5.opening.tryAgain")}
            </p>
          ) : null}
        </>
      ) : (
        <>
          <NetworkLine>{t("lesson5.opening.exactly")}</NetworkLine>
          <NetworkLine compact>{t("lesson5.opening.nudgeHint")}</NetworkLine>
          {nudged ? (
            <>
              <p className="network-ask mt-8">{t("lesson5.opening.nameIt")}</p>
              <NetworkLine compact>{t("lesson5.opening.scale")}</NetworkLine>
              <p className="network-ask mt-6">{t("lesson5.opening.nextAsk")}</p>
              <NetworkContinue
                label={t("lesson5.opening.cta")}
                onClick={onContinue}
              />
            </>
          ) : null}
        </>
      )}
    </NetworkFrame>
  );
}
