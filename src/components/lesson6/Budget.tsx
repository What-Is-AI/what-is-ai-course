"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  DepthContinue,
  DepthFrame,
  DepthLine,
  DepthTitle,
} from "@/components/lesson6/DepthFrame";
import {
  useLesson6Chrome,
  useLesson6StepCopy,
} from "@/lib/useLesson6Copy";
import {
  BUDGET_CHOICES,
  type BudgetChoice,
} from "@/lib/lesson6-data";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
};

export function Budget({ onContinue, gateOpen, onGate }: Props) {
  const steps = useLesson6StepCopy();
  const copy = steps.budget;
  const chrome = useLesson6Chrome();
  const ui = chrome.budget ?? {};
  const [choice, setChoice] = useState<BudgetChoice | null>(null);

  function pick(c: BudgetChoice) {
    setChoice(c);
    onGate();
  }

  return (
    <DepthFrame>
      <div className="depth-layout">
        <div>
          <DepthTitle plaque={copy.plaque}>{copy.title}</DepthTitle>
          <DepthLine>{copy.body}</DepthLine>

          <div className="depth-budget-choose">
            <p className="depth-budget-choose-hint" id="budget-choose-hint">
              {copy.helper}
            </p>
            <div
              className="depth-budget-choose-list"
              role="radiogroup"
              aria-labelledby="budget-choose-hint"
            >
              {BUDGET_CHOICES.map((id) => {
                const selected = choice === id;
                const opt = copy.options[id];
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`depth-choice depth-budget-option${selected ? " is-selected" : ""}`}
                    onClick={() => pick(id)}
                  >
                    <span className="depth-budget-option-name">{opt.name}</span>
                    <span className="depth-budget-option-label">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <DepthContinue
            label={copy.cta}
            onClick={onContinue}
            disabled={!gateOpen}
          />
        </div>

        <aside className="depth-budget-aside">
          <div className="depth-budget-exhibit" aria-hidden={!choice}>
            <p className="depth-budget-exhibit-label">{ui.fixedBudget}</p>
            <div className="depth-budget-meter" data-choice={choice ?? "none"}>
              <div className="depth-budget-meter-track">
                <span className="depth-budget-meter-seg is-model" />
                <span className="depth-budget-meter-seg is-data" />
              </div>
              <div className="depth-budget-meter-labels">
                <span>{ui.modelSize}</span>
                <span>{ui.trainingData}</span>
              </div>
            </div>
            <p className="depth-mono depth-budget-exhibit-hint">
              {choice ? ui.afterChoice : ui.beforeChoice}
            </p>
          </div>

          <AnimatePresence initial={false}>
            {choice ? (
              <motion.aside
                key="finding"
                className="depth-budget-finding"
                role="note"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="depth-eyebrow mb-2">{ui.finding}</p>
                <p className="depth-budget-reveal-title">{copy.revealTitle}</p>
                <p className="depth-recon-finding-body">{copy.reveal}</p>
                <div className="depth-budget-chinchilla">
                  <p className="depth-eyebrow mb-2">{copy.chinchillaLabel}</p>
                  <p className="depth-budget-chinchilla-body">
                    {copy.chinchillaBody}
                  </p>
                </div>
              </motion.aside>
            ) : null}
          </AnimatePresence>
        </aside>
      </div>
    </DepthFrame>
  );
}
