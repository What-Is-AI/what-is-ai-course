"use client";

import { useEffect, useMemo, useState } from "react";
import { ChooseHelper } from "@/components/lesson8/ChooseHelper";
import { HonestyChip } from "@/components/lesson8/HonestyChip";
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
import { focusIdForContext, wordsForContext } from "@/lib/lesson8-data";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion: boolean;
};

/** S11 – Final experiment: attention → canned probs → append token → repeat. */
export function NextToken({
  onContinue,
  gateOpen,
  onGate,
  reducedMotion,
}: Props) {
  const steps = useLesson8StepCopy();
  const copy = steps.nextToken;
  const chrome = useLesson8Chrome();
  const ui: Record<string, string> = chrome.nextToken ?? {};
  const localeData = useLesson8LocaleData();
  const [roundIndex, setRoundIndex] = useState(0);
  const [generated, setGenerated] = useState<string[]>([]);
  const [pickedThisRound, setPickedThisRound] = useState(false);

  const round = localeData.nextTokenRounds[Math.min(roundIndex, localeData.nextTokenRounds.length - 1)]!;
  const words = useMemo(
    () => wordsForContext(round.context),
    [round.context],
  );
  const focusId = focusIdForContext(round.context);
  const doneEnough = generated.length >= 1;
  const finishedAll =
    generated.length >= localeData.nextTokenRounds.length ||
    (pickedThisRound && roundIndex >= localeData.nextTokenRounds.length - 1);

  useEffect(() => {
    if (doneEnough && !gateOpen) onGate();
  }, [doneEnough, gateOpen, onGate]);

  function pickToken(token: string) {
    if (pickedThisRound) return;
    setGenerated((prev) => [...prev, token]);
    setPickedThisRound(true);
  }

  function nextRound() {
    if (roundIndex >= localeData.nextTokenRounds.length - 1) return;
    setRoundIndex((i) => i + 1);
    setPickedThisRound(false);
  }

  const fullText = [localeData.nextTokenRounds[0]!.context, ...generated].join(" ");

  return (
    <ReadingRoomFrame>
      <div className="rr-stage">
        <div className="rr-stage-copy">
          <ReadingRoomTitle plaque={copy.plaque} compact>
            {copy.title}
          </ReadingRoomTitle>
          <ReadingRoomLine compact>{copy.lead}</ReadingRoomLine>
          <ReadingRoomLine compact>{copy.body}</ReadingRoomLine>
          <ReadingRoomLine compact>{copy.process}</ReadingRoomLine>
          <p className="rr-pivot">{copy.clarification}</p>

          {generated.length > 0 ? (
            <div className="rr-gen-history">
              <p className="rr-eyebrow">{copy.historyLabel}</p>
              <ol>
                {generated.map((t, i) => {
                  const context =
                    i === 0
                      ? localeData.nextTokenRounds[0]!.context
                      : `${localeData.nextTokenRounds[0]!.context} ${generated.slice(0, i).join(" ")}`;
                  return (
                    <li key={`${t}-${i}`}>
                      {(
                        ui.historyStep ??
                        'Step {n}: added “{token}” · context was “{context}”'
                      )
                        .replace("{n}", String(i + 1))
                        .replace("{token}", t)
                        .replace("{context}", context)}
                    </li>
                  );
                })}
              </ol>
              <p className="rr-living-sentence rr-gen-full">{fullText}</p>
            </div>
          ) : null}

          {doneEnough ? (
            <ReadingRoomContinue
              label={copy.cta}
              onClick={onContinue}
              disabled={!gateOpen}
            />
          ) : (
            <p className="rr-gate-hint" role="status">
              {ui.chooseAtLeastOne}
            </p>
          )}
        </div>

        <div className="rr-stage-action">
          <PaperPage mark={copy.contextLabel}>
            <LivingSentence
              words={words}
              mode="exhibit"
              focusWordId={focusId}
              links={round.attention}
              reducedMotion={reducedMotion}
            />
          </PaperPage>

          {!pickedThisRound ? (
            <ChooseHelper>{ui.tapNextToken}</ChooseHelper>
          ) : null}
          <p className="rr-eyebrow">{copy.probsLabel}</p>
          <p className="rr-instruct">{copy.pickHint}</p>
          <ul className="rr-prob-list" aria-label={copy.probsLabel}>
            {round.candidates.map((c) => (
              <li key={c.token}>
                <button
                  type="button"
                  className={`rr-prob-option${
                    pickedThisRound && generated[generated.length - 1] === c.token
                      ? " is-selected"
                      : ""
                  }`}
                  disabled={pickedThisRound}
                  onClick={() => pickToken(c.token)}
                  aria-label={(
                    ui.percentAria ?? "{token}, {pct} percent"
                  )
                    .replace("{token}", c.token)
                    .replace("{pct}", (c.p * 100).toFixed(0))}
                >
                  <span className="rr-prob-token">{c.token}</span>
                  <span className="rr-prob-bar-wrap" aria-hidden>
                    <span
                      className="rr-prob-bar"
                      style={{ width: `${c.p * 100}%` }}
                    />
                  </span>
                  <span className="rr-prob-pct">
                    {(c.p * 100).toFixed(0)}%
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <HonestyChip />

          {pickedThisRound && roundIndex < localeData.nextTokenRounds.length - 1 ? (
            <div className="rr-action-bar">
              <ChooseHelper>{ui.pressToContinueGenerating}</ChooseHelper>
              <button
                type="button"
                className="rr-btn rr-btn-operate"
                onClick={nextRound}
              >
                {copy.again}
              </button>
            </div>
          ) : null}

          {finishedAll ? (
            <p className="rr-gate-hint">{ui.reviewMode}</p>
          ) : null}
        </div>
      </div>
    </ReadingRoomFrame>
  );
}
