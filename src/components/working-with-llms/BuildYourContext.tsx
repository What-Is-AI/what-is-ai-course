"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  StudioContinue,
  StudioFrame,
  StudioLine,
  StudioTitle,
} from "@/components/working-with-llms/StudioFrame";
import { type ContextCardId } from "@/lib/working-with-llms-data";
import { useWorkingWithLlmsCopy } from "@/lib/useWorkingWithLlmsCopy";

type Props = {
  onContinue: (pinned: ContextCardId[]) => void;
};

type Phase = "scenario" | "assemble" | "compare";

export function BuildYourContext({ onContinue }: Props) {
  const { t, contextCards } = useWorkingWithLlmsCopy();
  const [phase, setPhase] = useState<Phase>("scenario");
  const [pinned, setPinned] = useState<ContextCardId[]>([]);
  const [dragging, setDragging] = useState<ContextCardId | null>(null);

  const unpinned = contextCards.filter((card) => !pinned.includes(card.id));
  const allPinned = pinned.length === contextCards.length;

  function pin(id: ContextCardId) {
    setPinned((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function unpin(id: ContextCardId) {
    setPinned((prev) => prev.filter((x) => x !== id));
  }

  return (
    <AnimatePresence mode="wait">
      {phase === "scenario" ? (
        <StudioFrame key="scenario">
          <StudioTitle plaque={t("workingWithLlms.build.scenario.plaque")}>
            {t("workingWithLlms.build.scenario.title")}
          </StudioTitle>
          <StudioLine>{t("workingWithLlms.build.scenario.subhead")}</StudioLine>
          <StudioContinue
            label={t("workingWithLlms.build.scenario.cta")}
            onClick={() => setPhase("assemble")}
          />
        </StudioFrame>
      ) : null}

      {phase === "assemble" ? (
        <StudioFrame key="assemble">
          <StudioTitle plaque={t("workingWithLlms.build.assemble.plaque")}>
            {t("workingWithLlms.build.assemble.title")}
          </StudioTitle>
          <StudioLine>{t("workingWithLlms.build.assemble.subhead")}</StudioLine>

          <div className="mt-8 grid max-w-4xl gap-5 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-3">
              {unpinned.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  draggable
                  onDragStart={() => setDragging(card.id)}
                  onDragEnd={() => setDragging(null)}
                  onClick={() => pin(card.id)}
                  className="studio-context-card w-full text-left"
                >
                  <p className="studio-eyebrow">{card.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--stu-ink-soft)]">
                    {card.body}
                  </p>
                </button>
              ))}
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragging) pin(dragging);
                setDragging(null);
              }}
              className={`studio-board min-h-[16rem] ${
                dragging ? "studio-board-active" : ""
              }`}
            >
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--stu-mute)]">
                {t("workingWithLlms.build.assemble.boardHeader")} ·{" "}
                {t("workingWithLlms.build.assemble.pinned", {
                  count: pinned.length,
                })}
              </p>
              <div className="mt-4 space-y-3">
                {pinned.map((id) => {
                  const card = contextCards.find((c) => c.id === id);
                  if (!card) return null;
                  return (
                    <motion.button
                      key={card.id}
                      type="button"
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => unpin(card.id)}
                      className="studio-context-card studio-context-card-pinned w-full text-left"
                    >
                      <p className="studio-eyebrow">{card.label}</p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--stu-ink-soft)]">
                        {card.body}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          <StudioContinue
            label={t("workingWithLlms.build.assemble.cta")}
            disabled={!allPinned}
            onClick={() => setPhase("compare")}
          />
        </StudioFrame>
      ) : null}

      {phase === "compare" ? (
        <StudioFrame key="compare">
          <StudioTitle plaque={t("workingWithLlms.build.compare.plaque")}>
            {t("workingWithLlms.build.compare.title")}
          </StudioTitle>

          <div className="mt-2 grid max-w-3xl gap-4 sm:grid-cols-2">
            <article className="studio-panel px-5 py-5">
              <p className="studio-eyebrow">
                {t("workingWithLlms.build.compare.bare.eyebrow")}
              </p>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-[var(--stu-ink-soft)]">
                {t("workingWithLlms.build.compare.bare.body")}
              </p>
            </article>
            <article className="studio-panel studio-panel-accent px-5 py-5">
              <p className="studio-eyebrow">
                {t("workingWithLlms.build.compare.built.eyebrow")}
              </p>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-[var(--stu-ink-soft)]">
                {t("workingWithLlms.build.compare.built.body")}
              </p>
            </article>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-8 max-w-2xl text-lg font-semibold tracking-tight text-[var(--stu-ink)]"
          >
            {t("workingWithLlms.build.compare.surpriseLine")}
          </motion.p>

          <StudioContinue
            label={t("workingWithLlms.build.compare.cta")}
            onClick={() => onContinue(pinned)}
          />
        </StudioFrame>
      ) : null}
    </AnimatePresence>
  );
}
