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
import type { AttentionLink } from "@/lib/lesson8-data";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion: boolean;
};

const DEFAULT_STRENGTHS = [0.82, 0.41, 0.09];

/** S3 – Direct connections from “it” (tap target; illustrative strengths). */
export function Connections({
  onContinue,
  gateOpen,
  onGate,
  reducedMotion,
}: Props) {
  const steps = useLesson8StepCopy();
  const chrome = useLesson8Chrome();
  const copy = steps.connections;
  const localeData = useLesson8LocaleData();
  const ui = chrome.connections ?? {};
  const [links, setLinks] = useState<AttentionLink[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState("");

  const ready = links.length >= 2;

  useEffect(() => {
    if (ready && !gateOpen) onGate();
  }, [ready, gateOpen, onGate]);

  const selectedLink = useMemo(
    () => links.find((l) => l.toId === selectedTarget) ?? null,
    [links, selectedTarget],
  );

  function onWordActivate(wordId: string) {
    if (wordId === localeData.canonicalItId) return;
    const existing = links.find((l) => l.toId === wordId);
    if (existing) {
      setSelectedTarget(wordId);
      const word = localeData.canonicalWords.find((w) => w.id === wordId)?.text ?? wordId;
      setLiveMessage(
        `it → ${word}, strength ${existing.strength.toFixed(2)}.`,
      );
      return;
    }
    const strength =
      DEFAULT_STRENGTHS[Math.min(links.length, DEFAULT_STRENGTHS.length - 1)] ??
      0.25;
    const next: AttentionLink = {
      fromId: localeData.canonicalItId,
      toId: wordId,
      strength,
    };
    setLinks((prev) => [...prev, next]);
    setSelectedTarget(wordId);
    const word = localeData.canonicalWords.find((w) => w.id === wordId)?.text ?? wordId;
    setLiveMessage(`it → ${word}, strength ${strength.toFixed(2)}.`);
  }

  function setStrength(value: number) {
    if (!selectedTarget) return;
    setLinks((prev) =>
      prev.map((l) =>
        l.toId === selectedTarget ? { ...l, strength: value } : l,
      ),
    );
    const word =
      localeData.canonicalWords.find((w) => w.id === selectedTarget)?.text ??
      selectedTarget;
    setLiveMessage(`it → ${word}, strength ${value.toFixed(2)}.`);
  }

  return (
    <ReadingRoomFrame>
      <div className="rr-stage">
        <div className="rr-stage-copy">
          <ReadingRoomTitle plaque={copy.plaque} compact>
            {copy.title}
          </ReadingRoomTitle>
          <ReadingRoomLine compact>{copy.tryIt}</ReadingRoomLine>
          <p className="rr-instruct">{copy.instruct}</p>

          {!ready ? (
            <p className="rr-gate-hint" role="status">
              {copy.needTwo} ({links.length}/2)
            </p>
          ) : (
            <>
              <p className="rr-pivot">{copy.madeVisible}</p>
              <ReadingRoomLine compact>{copy.body}</ReadingRoomLine>
              <ReadingRoomLine compact>{copy.history}</ReadingRoomLine>
              <ReadingRoomContinue
                label={copy.cta}
                onClick={onContinue}
                disabled={!gateOpen}
              />
            </>
          )}
        </div>

        <div className="rr-stage-action">
          <ChooseHelper>{ui.tapAWord}</ChooseHelper>
          <ReadingRoomLine compact>{copy.hint}</ReadingRoomLine>
          <PaperPage mark={ui.focusIt}>
            <LivingSentence
              words={localeData.canonicalWords}
              mode="operate"
              focusWordId={localeData.canonicalItId}
              selectedWordId={selectedTarget}
              links={links}
              onWordActivate={onWordActivate}
              reducedMotion={reducedMotion}
              liveMessage={liveMessage}
            />
            {links.length > 0 ? <HonestyChip /> : null}
          </PaperPage>

          {selectedLink ? (
            <label className="rr-strength">
              <span className="rr-eyebrow">{copy.strengthLabel}</span>
              <input
                type="range"
                min={0.05}
                max={1}
                step={0.01}
                value={selectedLink.strength}
                onChange={(e) => setStrength(Number(e.target.value))}
                aria-valuetext={selectedLink.strength.toFixed(2)}
              />
              <span className="rr-strength-val">
                {selectedLink.strength.toFixed(2)}
              </span>
            </label>
          ) : null}
        </div>
      </div>
    </ReadingRoomFrame>
  );
}
