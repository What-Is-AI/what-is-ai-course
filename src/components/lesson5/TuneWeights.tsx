"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  NetworkContinue,
  NetworkFrame,
  NetworkLine,
  NetworkTitle,
} from "@/components/lesson5/NetworkFrame";
import { useT } from "@/i18n/LocaleProvider";

type Props = { onContinue: () => void };
type Phase = "a" | "b";

const FEATURES = ["ears", "whiskers", "legs"] as const;
const CAT_IMG = "/lesson2/tabby-staring.png";
const DOG_IMG = "/lesson2/golden-retriever-outdoors.png";

export function TuneWeights({ onContinue }: Props) {
  const t = useT();
  const [phase, setPhase] = useState<Phase>("a");
  const [w0, setW0] = useState(0.35);
  const [weights, setWeights] = useState({
    ears: 0.4,
    whiskers: 0.35,
    legs: 0.25,
  });
  const [touched, setTouched] = useState(false);
  const [tuned, setTuned] = useState(false);

  const confA = Math.round(20 + w0 * 70);

  const catScore = useMemo(() => {
    const raw =
      weights.ears * 0.9 + weights.whiskers * 0.85 + weights.legs * 0.55;
    return Math.round(Math.min(98, Math.max(8, raw * 100)));
  }, [weights]);

  const dogScore = useMemo(() => {
    const raw =
      weights.ears * 0.35 + weights.whiskers * 0.25 + weights.legs * 0.7;
    return Math.round(Math.min(98, Math.max(8, raw * 100)));
  }, [weights]);

  return (
    <NetworkFrame className="network-tune">
      <NetworkTitle plaque={t("lesson5.tuneWeights.plaque")}>
        {phase === "a"
          ? t("lesson5.tuneWeights.titleA")
          : t("lesson5.tuneWeights.titleB")}
      </NetworkTitle>

      {phase === "a" ? (
        <>
          <NetworkLine>{t("lesson5.tuneWeights.askA")}</NetworkLine>
          <div className="network-panel mt-6 max-w-md px-5 py-5">
            <div className="network-mini-graph" aria-hidden>
              <span className="network-node" />
              <span className="network-edge is-hot" />
              <span className="network-node is-hot" />
            </div>
            <label className="mt-4 block text-sm text-[var(--ink-soft)]">
              {t("lesson5.tuneWeights.weightLabel")}
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={w0}
                aria-valuetext={t("lesson5.tuneWeights.confidence", {
                  value: confA,
                })}
                onChange={(e) => {
                  setTouched(true);
                  setW0(Number(e.target.value));
                }}
                className="network-slider mt-2 w-full"
              />
            </label>
            <p className="mt-3 text-lg font-semibold" aria-live="polite">
              {t("lesson5.tuneWeights.confidence", { value: confA })}
            </p>
          </div>
          {touched ? (
            <>
              <NetworkLine>{t("lesson5.tuneWeights.nameIt")}</NetworkLine>
              <NetworkContinue
                label={t("lesson5.tuneWeights.ctaToB")}
                onClick={() => setPhase("b")}
              />
            </>
          ) : null}
        </>
      ) : (
        <>
          <NetworkLine>{t("lesson5.tuneWeights.body1")}</NetworkLine>
          <NetworkLine compact>{t("lesson5.tuneWeights.body2")}</NetworkLine>

          <div className="network-tune-stage mt-6">
            <div className="network-tune-photos">
              <div className="network-tune-photo">
                <div className="network-tune-photo-frame">
                  <Image
                    src={CAT_IMG}
                    alt={t("lesson5.tuneWeights.photoCat")}
                    fill
                    className="object-cover"
                    sizes="(max-width: 900px) 40vw, 240px"
                  />
                </div>
                <p className="network-tune-photo-score" aria-live="polite">
                  {t("lesson5.tuneWeights.confidence", { value: catScore })}
                </p>
              </div>
              <div className="network-tune-photo">
                <div className="network-tune-photo-frame">
                  <Image
                    src={DOG_IMG}
                    alt={t("lesson5.tuneWeights.photoDog")}
                    fill
                    className="object-cover"
                    sizes="(max-width: 900px) 40vw, 240px"
                  />
                </div>
                <p className="network-tune-photo-score" aria-live="polite">
                  {t("lesson5.shared.dog")} · {dogScore}%
                </p>
              </div>
            </div>

            <div className="network-tune-controls">
              <p className="network-tune-prompt">
                {t("lesson5.tuneWeights.prompt")}
              </p>
              <div className="network-tune-sliders">
                {FEATURES.map((id) => (
                  <label
                    key={id}
                    className="network-tune-slider block text-sm text-[var(--ink-soft)]"
                  >
                    {t(`lesson5.tuneWeights.features.${id}`)} ·{" "}
                    {weights[id].toFixed(2)}
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={weights[id]}
                      onChange={(e) => {
                        setTuned(true);
                        setWeights((prev) => ({
                          ...prev,
                          [id]: Number(e.target.value),
                        }));
                      }}
                      className="network-slider mt-2 w-full"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {tuned ? (
            <div className="network-tune-debrief">
              <ol className="network-tune-points">
                <li>{t("lesson5.tuneWeights.debrief")}</li>
                <li>{t("lesson5.tuneWeights.training")}</li>
                <li>{t("lesson5.tuneWeights.clarify")}</li>
              </ol>
              <p className="network-tune-takeaway">
                {t("lesson5.tuneWeights.takeaway")}
              </p>
              <NetworkContinue
                label={t("lesson5.tuneWeights.ctaNext")}
                onClick={onContinue}
              />
            </div>
          ) : null}
        </>
      )}
    </NetworkFrame>
  );
}
