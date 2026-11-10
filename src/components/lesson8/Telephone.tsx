"use client";

import { useEffect, useMemo, useState } from "react";
import { ChooseHelper } from "@/components/lesson8/ChooseHelper";
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
import type { TelephoneChain, TelephoneHop } from "@/lib/lesson8-data";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion: boolean;
};

type Phase = "short" | "long" | "done";

function kindLabel(
  kind: TelephoneHop["kind"],
  ui: Record<string, string>,
): string {
  return ui[kind] ?? kind;
}

/** S2 – Telephone Game: scripted degradation; learner only advances hops. */
export function Telephone({
  onContinue,
  gateOpen,
  onGate,
  reducedMotion,
}: Props) {
  const steps = useLesson8StepCopy();
  const copy = steps.telephone;
  const chrome = useLesson8Chrome();
  const ui: Record<string, string> = chrome.telephone ?? {};
  const localeData = useLesson8LocaleData();
  const [phase, setPhase] = useState<Phase>("short");
  const [hopIndex, setHopIndex] = useState(0);

  const chain: TelephoneChain =
    phase === "long" || phase === "done"
      ? localeData.telephoneLong
      : localeData.telephoneShort;

  const hops = chain.hops;
  const atEnd = hopIndex >= hops.length - 1;
  const current = hops[Math.min(hopIndex, hops.length - 1)]!;

  const shortDone = phase !== "short";
  const longDone = phase === "done";

  useEffect(() => {
    if (longDone && !gateOpen) onGate();
  }, [longDone, gateOpen, onGate]);

  const liveMessage = useMemo(() => {
    const kind = kindLabel(current.kind, ui);
    return (ui.atWord ??
      'At “{word}”: message “{message}”. {note} Handoff: {kind}.')
      .replace("{word}", current.word)
      .replace("{message}", current.message)
      .replace("{note}", current.note)
      .replace("{kind}", kind);
  }, [current, ui]);

  function advanceHop() {
    if (!atEnd) {
      setHopIndex((i) => i + 1);
      return;
    }
    if (phase === "short") {
      setPhase("long");
      setHopIndex(0);
      return;
    }
    if (phase === "long") {
      setPhase("done");
    }
  }

  function completeStaticPhase() {
    if (phase === "short") {
      setPhase("long");
      setHopIndex(localeData.telephoneLong.hops.length - 1);
      return;
    }
    setPhase("done");
  }

  const hopLabel = reducedMotion
    ? phase === "short"
      ? ui.seeLonger
      : ui.showGarble
    : atEnd && phase === "short"
      ? ui.tryLonger
      : atEnd
        ? ui.seeWhatArrived
        : copy.hopCta;

  return (
    <ReadingRoomFrame>
      <div className={`rr-stage${longDone ? " is-settled" : ""}`}>
        <div className="rr-stage-copy">
          <ReadingRoomTitle plaque={copy.plaque} compact>
            {copy.title}
          </ReadingRoomTitle>

          {!longDone ? (
            <>
              <ReadingRoomLine compact>{copy.rnn}</ReadingRoomLine>
              <ReadingRoomLine compact>{copy.body}</ReadingRoomLine>
              <p className="rr-instruct">
                {phase === "short" ? copy.prompt : copy.longerPrompt}
              </p>
              {shortDone ? (
                <ReadingRoomLine compact>{copy.afterShort}</ReadingRoomLine>
              ) : null}
            </>
          ) : (
            <>
              <p className="rr-surprise">{copy.surprise}</p>
              <ReadingRoomLine compact>{copy.point}</ReadingRoomLine>
              <p className="rr-pivot">{copy.pivot}</p>
              <ReadingRoomContinue
                label={copy.cta}
                onClick={onContinue}
                disabled={!gateOpen}
              />
            </>
          )}
        </div>

        <div className="rr-stage-action">
          {reducedMotion ? (
            <StaticChain
              chain={
                phase === "short"
                  ? localeData.telephoneShort
                  : localeData.telephoneLong
              }
              label={copy.staticSummaryLabel}
              kindOf={(k) => kindLabel(k, ui)}
            />
          ) : (
            <PaperPage
              mark={chain.label}
              className={longDone ? "rr-telephone-page is-settled" : undefined}
            >
              <TelephoneTrack
                hops={hops}
                hopIndex={hopIndex}
                current={current}
                settled={longDone}
                messageLabel={ui.message ?? "Message"}
                wordChainLabel={ui.wordChain ?? "Word chain"}
                kindOf={(k) => kindLabel(k, ui)}
              />
              <p className="sr-only" role="status" aria-live="polite">
                {liveMessage}
              </p>
            </PaperPage>
          )}

          {!longDone ? (
            <div className="rr-action-bar">
              <ChooseHelper>{ui.pressToAdvance}</ChooseHelper>
              <button
                type="button"
                className="rr-btn rr-btn-operate"
                onClick={reducedMotion ? completeStaticPhase : advanceHop}
              >
                {hopLabel}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </ReadingRoomFrame>
  );
}

function TelephoneTrack({
  hops,
  hopIndex,
  current,
  settled,
  messageLabel,
  wordChainLabel,
  kindOf,
}: {
  hops: readonly TelephoneHop[];
  hopIndex: number;
  current: TelephoneHop;
  settled?: boolean;
  messageLabel: string;
  wordChainLabel: string;
  kindOf: (kind: TelephoneHop["kind"]) => string;
}) {
  return (
    <div className={`rr-telephone${settled ? " is-settled" : ""}`}>
      <ol className="rr-telephone-words" aria-label={wordChainLabel}>
        {hops.map((hop, i) => (
          <li
            key={`${hop.word}-${i}`}
            className={[
              "rr-telephone-word",
              i === hopIndex ? "is-current" : "",
              i < hopIndex ? "is-past" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {hop.word}
            {i < hops.length - 1 ? (
              <span className="rr-telephone-arrow" aria-hidden>
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="rr-telephone-payload" aria-live="polite">
        <p className="rr-telephone-msg">
          <span className="rr-eyebrow">{messageLabel}</span>
          <span className="rr-telephone-msg-text">{current.message}</span>
        </p>
        <p className="rr-telephone-note">
          <span className={`rr-hand off-${current.kind}`}>
            {kindOf(current.kind)}
          </span>
          {current.note}
        </p>
      </div>
    </div>
  );
}

function StaticChain({
  chain,
  label,
  kindOf,
}: {
  chain: TelephoneChain;
  label: string;
  kindOf: (kind: TelephoneHop["kind"]) => string;
}) {
  return (
    <PaperPage mark={label}>
      <ol className="rr-telephone-static">
        {chain.hops.map((hop, i) => (
          <li key={`${hop.word}-${i}`}>
            <strong>{hop.word}</strong>: {hop.message}{" "}
            <span className={`rr-hand off-${hop.kind}`}>
              ({kindOf(hop.kind)})
            </span>{" "}
            — {hop.note}
          </li>
        ))}
      </ol>
    </PaperPage>
  );
}
