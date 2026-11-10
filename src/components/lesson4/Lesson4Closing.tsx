"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  FacilityContinue,
  FacilityFrame,
  FacilityLine,
  FacilityTitle,
} from "@/components/lesson4/FacilityFrame";
import { useLesson4Copy } from "@/lib/useLesson4Copy";

export const LESSON4_CLOSING_PHASES = [
  "takeaways",
  "final",
  "transition",
] as const;

export type Lesson4ClosingPhase = (typeof LESSON4_CLOSING_PHASES)[number];

type Props = {
  phase: Lesson4ClosingPhase;
  onContinue: () => void;
};

export function Lesson4Closing({ phase, onContinue }: Props) {
  const { t, takeaways } = useLesson4Copy();

  return (
    <FacilityFrame>
      <AnimatePresence mode="wait">
        {phase === "takeaways" ? (
          <motion.div
            key="takeaways"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <FacilityTitle plaque={t("lesson4.closing.takeaways.plaque")}>
              {t("lesson4.closing.takeaways.title")}
            </FacilityTitle>
            <ul className="mt-2 max-w-2xl space-y-3">
              {takeaways.map((line) => (
                <li
                  key={line}
                  className="facility-panel px-4 py-3 text-sm leading-relaxed text-[var(--fac-ink-soft)]"
                >
                  {line}
                </li>
              ))}
            </ul>
            <FacilityContinue
              label={t("lesson4.closing.takeaways.cta")}
              onClick={onContinue}
            />
          </motion.div>
        ) : null}

        {phase === "final" ? (
          <motion.div
            key="final"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <FacilityTitle>{t("lesson4.closing.final.title")}</FacilityTitle>
            <FacilityLine>{t("lesson4.closing.final.body")}</FacilityLine>
            <div className="facility-monitor mt-8 max-w-lg px-5 py-5">
              <p className="facility-eyebrow mb-2">
                {t("lesson4.closing.final.model")}
              </p>
              <p className="text-base font-semibold leading-snug text-[var(--fac-ink)] sm:text-lg">
                {t("lesson4.closing.final.started")}
              </p>
            </div>
            <FacilityContinue
              label={t("lesson4.closing.final.cta")}
              onClick={onContinue}
            />
          </motion.div>
        ) : null}

        {phase === "transition" ? (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex min-h-[28rem] flex-1 flex-col overflow-hidden"
          >
            <ParameterNetwork />
            <div className="relative z-10 flex flex-1 flex-col justify-center">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.55 }}
                className="max-w-3xl text-3xl font-semibold leading-[1.12] tracking-tight text-[var(--fac-ink)] sm:text-4xl md:text-5xl"
              >
                {t("lesson4.closing.transition.line1")}
                <br />
                <span className="mt-4 block italic text-[var(--fac-accent)]">
                  {t("lesson4.closing.transition.line2")}
                </span>
              </motion.p>
              <p className="mt-4 max-w-xl text-sm text-[var(--fac-mute)]">
                {t("lesson4.closing.transition.inside")}
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <Link href="/lessons/5" className="facility-btn">
                  {t("lesson4.closing.transition.toLesson5")}
                </Link>
                <Link href="/" className="facility-btn-secondary">
                  {t("lesson4.closing.transition.backHome")}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </FacilityFrame>
  );
}

function ParameterNetwork() {
  const dials = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    label: `v${i + 1}`,
    x: 12 + (i % 4) * 22 + ((i * 3) % 5),
    y: 18 + Math.floor(i / 4) * 20 + ((i * 5) % 4),
    value: (0.35 + ((i * 17) % 50) / 100).toFixed(2),
  }));

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-50"
    >
      <svg className="absolute inset-0 h-full w-full">
        {dials.map((a, i) =>
          dials.slice(i + 1, i + 3).map((b) => (
            <line
              key={`${a.id}-${b.id}`}
              x1={`${a.x}%`}
              y1={`${a.y}%`}
              x2={`${b.x}%`}
              y2={`${b.y}%`}
              stroke="rgba(47, 158, 143, 0.35)"
              strokeWidth="1"
            />
          )),
        )}
      </svg>
      {dials.map((d) => (
        <div
          key={d.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-sm border px-2 py-1.5"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            borderColor: "rgba(47, 158, 143, 0.45)",
            backgroundColor: "rgba(27, 33, 41, 0.85)",
            boxShadow: "0 0 12px rgba(47, 158, 143, 0.12)",
          }}
        >
          <p className="text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-[var(--fac-mute)]">
            {d.label}
          </p>
          <p className="text-[0.7rem] font-semibold tabular-nums text-[var(--fac-accent)]">
            {d.value}
          </p>
        </div>
      ))}
    </div>
  );
}
