"use client";

import { useEffect, useState } from "react";
import { ChooseHelper } from "@/components/lesson8/ChooseHelper";
import { LivingSentence } from "@/components/lesson8/LivingSentence";
import { PaperPage } from "@/components/lesson8/PaperPage";
import {
  ReadingRoomContinue,
  ReadingRoomFrame,
  ReadingRoomLine,
  ReadingRoomTitle,
} from "@/components/lesson8/ReadingRoomFrame";
import {
  useLesson8Chrome,
  useLesson8LocaleData,
  useLesson8StepCopy,
} from "@/lib/useLesson8Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion: boolean;
};

type Pick = "step" | "direct" | null;

/** S4 – Paper reveal + choose shorter route → Transformer. */
export function PaperReveal({
  onContinue,
  gateOpen,
  onGate,
  reducedMotion,
}: Props) {
  const steps = useLesson8StepCopy();
  const copy = steps.paper;
  const chrome = useLesson8Chrome();
  const ui: Record<string, string> = chrome.paper ?? {};
  const localeData = useLesson8LocaleData();
  const [phase, setPhase] = useState<"doc" | "compare">("doc");
  const [pick, setPick] = useState<Pick>(null);

  const labelA = (ui.optionAPrefix ?? "A · {label}").replace(
    "{label}",
    copy.optionA,
  );
  const labelB = (ui.optionBPrefix ?? "B · {label}").replace(
    "{label}",
    copy.optionB,
  );

  useEffect(() => {
    if (pick && !gateOpen) onGate();
  }, [pick, gateOpen, onGate]);

  return (
    <ReadingRoomFrame>
      {phase === "doc" ? (
        <div className="rr-stage">
          <div className="rr-stage-copy">
            <ReadingRoomTitle plaque={copy.plaque} compact>
              {copy.title}
            </ReadingRoomTitle>
            <ReadingRoomLine compact>{copy.body}</ReadingRoomLine>
            <ReadingRoomLine compact>{copy.idea}</ReadingRoomLine>
            <ReadingRoomContinue
              label={ui.compareRoutes}
              onClick={() => setPhase("compare")}
            />
          </div>
          <aside className="rr-doc rr-stage-action" aria-label={copy.docTitle}>
            <p className="rr-doc-rule" aria-hidden>
              ────────────────────────────────
            </p>
            <p className="rr-doc-title">{copy.docTitle}</p>
            <p className="rr-doc-meta">
              {copy.authors}
              <br />
              {copy.year}
            </p>
            <p className="rr-doc-rule" aria-hidden>
              ────────────────────────────────
            </p>
          </aside>
        </div>
      ) : (
        <div className="rr-stage">
          <div className="rr-stage-copy">
            <ReadingRoomTitle plaque={copy.plaque} compact>
              {copy.ask}
            </ReadingRoomTitle>
            <ChooseHelper />
            <div className="rr-choose-stack" role="group" aria-label={copy.ask}>
              <button
                type="button"
                className={`rr-choose rr-choose-block${
                  pick === "step" ? " is-selected" : ""
                }`}
                aria-pressed={pick === "step"}
                onClick={() => setPick("step")}
              >
                {labelA}
              </button>
              <button
                type="button"
                className={`rr-choose rr-choose-block${
                  pick === "direct" ? " is-selected" : ""
                }`}
                aria-pressed={pick === "direct"}
                onClick={() => setPick("direct")}
              >
                {labelB}
              </button>
            </div>

            {pick ? (
              <div className="rr-reveal">
                <p className="rr-surprise">{copy.reveal}</p>
                <ReadingRoomLine compact>{copy.revealBody}</ReadingRoomLine>
                <ReadingRoomContinue
                  label={copy.cta}
                  onClick={onContinue}
                  disabled={!gateOpen}
                />
              </div>
            ) : null}
          </div>

          <div className="rr-stage-action rr-compare">
            <div
              className={`rr-compare-panel${pick === "step" ? " is-active" : ""}`}
            >
              <p className="rr-eyebrow">{labelA}</p>
              <p className="rr-compare-detail">{copy.optionADetail}</p>
              <PaperPage mark={ui.markChain} className="rr-compare-page">
                <LivingSentence
                  words={localeData.paperStepWords}
                  mode="exhibit"
                  reducedMotion={reducedMotion}
                />
                <p className="rr-chain-caption" aria-hidden>
                  {ui.chainCaption}
                </p>
              </PaperPage>
            </div>

            <div
              className={`rr-compare-panel${
                pick === "direct" ? " is-active" : ""
              }`}
            >
              <p className="rr-eyebrow">{labelB}</p>
              <p className="rr-compare-detail">{copy.optionBDetail}</p>
              <PaperPage mark={ui.markDirect} className="rr-compare-page">
                <LivingSentence
                  words={localeData.canonicalWords}
                  mode="exhibit"
                  focusWordId={localeData.canonicalItId}
                  links={localeData.demoAttentionLinks}
                  reducedMotion={reducedMotion}
                />
              </PaperPage>
            </div>
          </div>
        </div>
      )}
    </ReadingRoomFrame>
  );
}
