"use client";

import { useMemo, useState } from "react";
import {
  NetworkContinue,
  NetworkFrame,
  NetworkTitle,
} from "@/components/lesson5/NetworkFrame";
import { useT } from "@/i18n/LocaleProvider";

type Props = { onContinue: () => void };

export function Layers({ onContinue }: Props) {
  const t = useT();
  const [l1, setL1] = useState(true);
  const [l2, setL2] = useState(true);
  const [l3, setL3] = useState(true);
  const [tried, setTried] = useState(false);

  const strength = (l1 ? 1 : 0) + (l2 ? 1 : 0) + (l3 ? 1 : 0);
  const allOn = strength === 3;
  const summary = allOn
    ? t("lesson5.layers.summaryAll")
    : t("lesson5.layers.summaryWeak");

  const toggle = (n: 1 | 2 | 3) => {
    setTried(true);
    if (n === 1) setL1((v) => !v);
    else if (n === 2) setL2((v) => !v);
    else setL3((v) => !v);
  };

  const view = useMemo(() => {
    if (!l1) return "empty";
    if (l1 && !l2) return "edges";
    if (l1 && l2 && !l3) return "loops";
    return "digit";
  }, [l1, l2, l3]);

  return (
    <NetworkFrame className="network-layers">
      <NetworkTitle plaque={t("lesson5.layers.plaque")} compact>
        {t("lesson5.layers.title")}
      </NetworkTitle>
      <p className="network-layers-bridge">{t("lesson5.layers.bridge")}</p>

      <div className="network-layers-layout">
        <div className="network-layers-viz">
          <div className="network-layers-stage">
            <div className="network-layers-canvas" aria-hidden>
              <svg viewBox="0 0 120 120" className="network-layers-svg">
                {view === "edges" || view === "loops" || view === "digit" ? (
                  <>
                    <path
                      d="M30 35 H90"
                      className="network-layer-stroke"
                      opacity={l1 ? 1 : 0.15}
                    />
                    <path
                      d="M35 85 H85"
                      className="network-layer-stroke"
                      opacity={l1 ? 1 : 0.15}
                    />
                    <path
                      d="M28 40 Q20 60 28 80"
                      className="network-layer-stroke"
                      opacity={l1 ? 1 : 0.15}
                    />
                  </>
                ) : null}
                {view === "loops" || view === "digit" ? (
                  <>
                    <ellipse
                      cx="60"
                      cy="42"
                      rx="22"
                      ry="16"
                      className="network-layer-stroke"
                      fill="none"
                      opacity={l2 ? 1 : 0.2}
                    />
                    <ellipse
                      cx="60"
                      cy="78"
                      rx="24"
                      ry="16"
                      className="network-layer-stroke"
                      fill="none"
                      opacity={l2 ? 1 : 0.2}
                    />
                  </>
                ) : null}
                {view === "digit" ? (
                  <text
                    x="60"
                    y="72"
                    textAnchor="middle"
                    className="network-layer-digit"
                    opacity={l3 ? 1 : 0.2}
                  >
                    8
                  </text>
                ) : null}
                {view === "empty" ? (
                  <text
                    x="60"
                    y="66"
                    textAnchor="middle"
                    className="network-layers-empty"
                  >
                    —
                  </text>
                ) : null}
              </svg>
            </div>

            <div className="network-layers-toggles">
              <p className="network-layers-toggle-prompt">
                {t("lesson5.layers.togglePrompt")}
              </p>
              {(
                [
                  [1, l1, "lesson5.layers.layer1Desc"],
                  [2, l2, "lesson5.layers.layer2Desc"],
                  [3, l3, "lesson5.layers.layer3Desc"],
                ] as const
              ).map(([n, on, descKey]) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={on}
                  aria-label={t(
                    on ? "lesson5.layers.layerOn" : "lesson5.layers.layerOff",
                    { n },
                  )}
                  onClick={() => toggle(n)}
                  className={`network-layer-toggle${on ? " is-on" : ""}${
                    tried ? "" : " is-invite"
                  }`}
                >
                  <span className="network-layer-toggle-top">
                    <span className="font-semibold">
                      {t(`lesson5.layers.layer${n}`)}
                    </span>
                    <span
                      className={`network-layer-state${on ? " is-on" : ""}`}
                    >
                      {on
                        ? t("lesson5.layers.stateOn")
                        : t("lesson5.layers.stateOff")}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs text-[var(--network-dim)]">
                    {t(descKey)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="network-layers-guess" aria-live="polite">
            {allOn
              ? t("lesson5.layers.guess", { digit: "8" })
              : t("lesson5.layers.guessWeak")}
          </p>
        </div>

        <aside className="network-layers-reading">
          <ol className="network-layers-points">
            <li>{summary}</li>
            <li>{t("lesson5.layers.hedge")}</li>
            <li>{t("lesson5.layers.capacity")}</li>
          </ol>
          <NetworkContinue
            label={t("lesson5.layers.cta")}
            onClick={onContinue}
            className="network-layers-cta"
          />
        </aside>
      </div>
    </NetworkFrame>
  );
}
