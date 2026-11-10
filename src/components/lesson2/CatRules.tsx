"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  LabContinue,
  LabFrame,
  LabLine,
  LabTitle,
} from "@/components/lesson2/LabFrame";
import { RichText } from "@/i18n/RichText";
import { useLesson2Copy } from "@/lib/useLesson2Copy";

type Props = {
  onContinue: (rules: string[]) => void;
};

function CounterexamplePhoto({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[3/2] w-full overflow-hidden ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 42vw"
        priority
      />
    </div>
  );
}

export function CatRules({ onContinue }: Props) {
  const { t, suggestions, displayRule, examplesForRules, resultLabel } =
    useLesson2Copy();
  const [rules, setRules] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [phase, setPhase] = useState<"build" | "break">("build");
  const [exampleIndex, setExampleIndex] = useState(0);

  const examples = useMemo(
    () => examplesForRules(rules),
    [examplesForRules, rules],
  );

  function addRule(rule: string) {
    const trimmed = rule.trim();
    if (!trimmed || rules.includes(trimmed)) return;
    setRules((prev) => [...prev, trimmed]);
    setCustom("");
  }

  function removeRule(rule: string) {
    setRules((prev) => prev.filter((r) => r !== rule));
  }

  function startBreak() {
    setExampleIndex(0);
    setPhase("break");
  }

  const example = examples[exampleIndex];
  const brokenAll = exampleIndex >= examples.length;
  const activeRules =
    rules.map(displayRule).join(t("lesson2.rules.break.andJoin")) ||
    t("lesson2.rules.break.none");

  return (
    <LabFrame>
      {phase === "build" ? (
        <>
          <LabTitle plaque={t("lesson2.rules.plaque")}>
            {t("lesson2.rules.title")}
          </LabTitle>
          <LabLine>{t("lesson2.rules.subhead")}</LabLine>

          <div className="mt-5 grid gap-5 md:mt-8 md:gap-6 lg:grid-cols-2">
            <div className="lab-whiteboard p-4 sm:p-5">
              <p className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#5a6454]">
                {t("lesson2.rules.boardHeader", { count: rules.length })}
              </p>
              <ul className="min-h-24 space-y-2 md:min-h-40">
                {rules.length === 0 ? (
                  <li className="text-sm text-[#7a8470]">
                    {t("lesson2.rules.empty")}
                  </li>
                ) : (
                  rules.map((rule, i) => (
                    <li key={rule}>
                      <button
                        type="button"
                        onClick={() => removeRule(rule)}
                        className={`lab-sticky w-full text-left ${
                          i % 2 === 1 ? "lab-sticky-alt" : ""
                        }`}
                        style={{
                          transform: `rotate(${((i % 5) - 2) * 1.4}deg)`,
                        }}
                      >
                        {t("lesson2.rules.sticky", { rule: displayRule(rule) })}
                        <span className="ml-2 text-[0.65rem] opacity-60">
                          {t("lesson2.rules.remove")}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>

              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  addRule(custom);
                }}
              >
                <input
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder={t("lesson2.rules.placeholder")}
                  className="min-w-0 flex-1 border border-[#b8bcaa] bg-white/70 px-3 py-2.5 font-[family-name:var(--font-lab)] text-sm text-[#2a3228] outline-none focus:border-[#6d7a68]"
                />
                <button
                  type="submit"
                  className="lab-btn !mt-0 !px-3 !py-2 !text-[0.75rem]"
                >
                  {t("lesson2.rules.add")}
                </button>
              </form>
            </div>

            <div>
              <p className="lab-eyebrow mb-3">
                {t("lesson2.rules.suggestionsEyebrow")}
              </p>
              <div className="flex flex-wrap gap-3">
                {suggestions.map((suggestion, i) => {
                  const used = rules.includes(suggestion.id);
                  return (
                    <button
                      key={suggestion.id}
                      type="button"
                      disabled={used}
                      onClick={() => addRule(suggestion.id)}
                      className={`lab-sticky ${i % 3 === 1 ? "lab-sticky-alt" : ""} disabled:cursor-not-allowed disabled:opacity-35`}
                      style={{
                        transform: `rotate(${((i % 5) - 2) * 1.6}deg)`,
                      }}
                    >
                      {suggestion.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <LabContinue
            label={t("lesson2.rules.cta")}
            disabled={rules.length < 2}
            onClick={startBreak}
          />
        </>
      ) : (
        <>
          <LabTitle plaque={t("lesson2.rules.break.plaque")}>
            {t("lesson2.rules.break.title")}
          </LabTitle>
          <LabLine>
            {brokenAll
              ? t("lesson2.rules.break.subDone")
              : t("lesson2.rules.break.subInProgress")}
          </LabLine>

          <div className="lab-crt mt-6 px-4 py-3 text-sm">
            <p className="relative z-10 text-[var(--lab-phosphor-dim)]">
              {t("lesson2.rules.break.activeRules", { rules: activeRules })}
            </p>
            <p className="relative z-10 mt-2 text-[var(--lab-phosphor-dim)]/80">
              <RichText text={t("lesson2.rules.break.gloss")} />
            </p>
          </div>

          {!brokenAll && example ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={example.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="lab-panel mt-6 grid max-w-5xl overflow-hidden border-[var(--lab-warn)]/40 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:items-center lg:gap-6"
              >
                <CounterexamplePhoto
                  src={example.image}
                  alt={example.label}
                  className="border border-[var(--lab-line)]"
                />
                <div className="mt-4 flex flex-col lg:mt-0">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--lab-warn)]">
                    {resultLabel(example.result)}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                    {example.label}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-[0.95rem]">
                    <RichText text={example.note} />
                  </p>
                  <LabContinue
                    label={
                      exampleIndex === examples.length - 1
                        ? t("lesson2.rules.break.seePattern")
                        : t("lesson2.rules.break.next")
                    }
                    onClick={() => setExampleIndex((i) => i + 1)}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 max-w-2xl text-lg font-medium text-ink"
              >
                {t("lesson2.rules.break.frustration")}
              </motion.p>
              <LabContinue
                label={t("lesson2.rules.break.keepGoing")}
                onClick={() => onContinue(rules)}
              />
            </>
          )}
        </>
      )}
    </LabFrame>
  );
}
