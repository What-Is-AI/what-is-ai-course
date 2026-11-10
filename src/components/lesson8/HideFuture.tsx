"use client";

import { useEffect, useState } from "react";
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
import { causalAllowedLabel } from "@/lib/lesson8-data";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion: boolean;
};

/**
 * S8 – Causal mask.
 * Staged disclosure (NN/g): one primary action per beat; supporting copy
 * deferred — same script, revealed when needed.
 */
export function HideFuture({
  onContinue,
  gateOpen,
  onGate,
  reducedMotion,
}: Props) {
  const steps = useLesson8StepCopy();
  const copy = steps.hideFuture;
  const chrome = useLesson8Chrome();
  const ui: Record<string, string> = chrome.hideFuture ?? {};
  const localeData = useLesson8LocaleData();
  const [inspected, setInspected] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  useEffect(() => {
    if (reducedMotion) setInspected(true);
  }, [reducedMotion]);

  useEffect(() => {
    if (revealed && inspected && !gateOpen) onGate();
  }, [revealed, inspected, gateOpen, onGate]);

  useEffect(() => {
    if (inspected) setSupportOpen(true);
  }, [inspected]);

  const links = inspected ? localeData.hideAttentionLinks : [];

  return (
    <ReadingRoomFrame>
      <div
        className={[
          "rr-stage rr-stage-hide",
          inspected ? "is-inspected" : "is-awaiting",
          revealed ? "is-revealed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="rr-hide-lead">
          <ReadingRoomTitle plaque={copy.plaque} compact>
            {copy.title}
          </ReadingRoomTitle>

          {!revealed ? (
            <>
              <ReadingRoomLine compact>{copy.body}</ReadingRoomLine>
              <ReadingRoomLine compact>{copy.rule}</ReadingRoomLine>
            </>
          ) : null}

          {!inspected ? (
            <details
              className="rr-hide-more"
              open={supportOpen}
              onToggle={(e) =>
                setSupportOpen((e.target as HTMLDetailsElement).open)
              }
            >
              <summary className="rr-hide-more-summary">{ui.background}</summary>
              <div className="rr-hide-more-body">
                <ReadingRoomLine compact>{copy.why}</ReadingRoomLine>
                <ReadingRoomLine compact>{copy.mask}</ReadingRoomLine>
              </div>
            </details>
          ) : null}

          {!inspected ? null : !revealed ? (
            <div className="rr-action-bar rr-hide-reveal">
              <ChooseHelper>{ui.pressToReveal}</ChooseHelper>
              <button
                type="button"
                className="rr-btn rr-btn-operate"
                onClick={() => setRevealed(true)}
              >
                {copy.revealFuture}
              </button>
            </div>
          ) : (
            <div className="rr-hide-advance">
              <p className="rr-surprise">{copy.futureNote}</p>
              <ReadingRoomContinue
                label={copy.cta}
                onClick={onContinue}
                disabled={!gateOpen}
              />
              <details className="rr-hide-more" open={false}>
                <summary className="rr-hide-more-summary">{ui.background}</summary>
                <div className="rr-hide-more-body">
                  <ReadingRoomLine compact>{copy.body}</ReadingRoomLine>
                  <ReadingRoomLine compact>{copy.rule}</ReadingRoomLine>
                  <ReadingRoomLine compact>{copy.why}</ReadingRoomLine>
                  <ReadingRoomLine compact>{copy.mask}</ReadingRoomLine>
                </div>
              </details>
            </div>
          )}
        </div>

        <div className="rr-hide-desk">
          {!inspected ? (
            <>
              <ChooseHelper>{ui.tapContextWord}</ChooseHelper>
              <p className="rr-instruct">{copy.inspectHint}</p>
            </>
          ) : null}

          <PaperPage
            mark={ui.availableContextOnly}
            className={`rr-hide-page${inspected ? "" : " is-awaiting"}`}
          >
            <LivingSentence
              words={localeData.hideContextWords}
              mode="operate"
              focusWordId={localeData.hideFocusId}
              links={links}
              onWordActivate={() => setInspected(true)}
              reducedMotion={reducedMotion}
            />
            <p className="rr-blank-slot">
              {copy.prompt}
              {revealed ? (
                <>
                  {" "}
                  <span className="rr-future-chip">{localeData.hideFutureWord}</span>
                </>
              ) : null}
            </p>
            <HonestyChip />
          </PaperPage>
        </div>

        {inspected ? (
          <div className="rr-hide-result">
            <table className="rr-mask-table">
              <caption>{copy.tableLabel}</caption>
              <thead>
                <tr>
                  <th scope="col">{ui.position}</th>
                  <th scope="col">{ui.mayAttendTo}</th>
                </tr>
              </thead>
              <tbody>
                {localeData.hideContextWords.map((w, i) => (
                  <tr key={w.id}>
                    <th scope="row">{w.text}</th>
                    <td>
                      {causalAllowedLabel(
                        localeData.hideContextWords,
                        i,
                        ui.none,
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="rr-mask-future-row">
                  <th scope="row">
                    {localeData.hideFutureWord} {ui.futureSuffix}
                  </th>
                  <td>
                    {revealed ? ui.shownForTeaching : ui.notAvailable}
                  </td>
                </tr>
              </tbody>
            </table>

            {!revealed ? (
              <details
                className="rr-hide-more"
                open={supportOpen}
                onToggle={(e) =>
                  setSupportOpen((e.target as HTMLDetailsElement).open)
                }
              >
                <summary className="rr-hide-more-summary">{ui.background}</summary>
                <div className="rr-hide-more-body">
                  <ReadingRoomLine compact>{copy.why}</ReadingRoomLine>
                  <ReadingRoomLine compact>{copy.mask}</ReadingRoomLine>
                </div>
              </details>
            ) : null}
          </div>
        ) : null}
      </div>
    </ReadingRoomFrame>
  );
}
