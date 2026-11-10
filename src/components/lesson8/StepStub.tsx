"use client";

import { useEffect } from "react";
import {
  ReadingRoomContinue,
  ReadingRoomFrame,
  ReadingRoomLine,
  ReadingRoomTitle,
} from "@/components/lesson8/ReadingRoomFrame";
import { HonestyChip } from "@/components/lesson8/HonestyChip";
import { LivingSentence } from "@/components/lesson8/LivingSentence";
import { PaperPage } from "@/components/lesson8/PaperPage";
import { useT } from "@/i18n/LocaleProvider";
import {
  useLesson8Chrome,
  useLesson8LocaleData,
  useLesson8StepCopy,
} from "@/lib/useLesson8Copy";
import type { Lesson8StepId } from "@/lib/lesson8-data";

type Props = {
  stepId: Lesson8StepId;
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion?: boolean;
};

/**
 * Phase 0/A placeholder for steps not yet built.
 * Opens the gate immediately; wraps content on the paper page.
 */
export function StepStub({
  stepId,
  onContinue,
  gateOpen,
  onGate,
  reducedMotion = false,
}: Props) {
  const t = useT();
  const steps = useLesson8StepCopy();
  const chrome = useLesson8Chrome();
  const localeData = useLesson8LocaleData();
  const stubNote =
    chrome.stepStub?.stubNote ??
    "Step stub – interaction comes in a later phase.";

  useEffect(() => {
    if (!gateOpen) onGate();
  }, [gateOpen, onGate]);

  const { plaque, title, body, cta, showLiving, showHonesty } = stubCopy(
    stepId,
    steps,
    t("common.continue"),
  );

  return (
    <ReadingRoomFrame>
      <ReadingRoomTitle plaque={plaque}>{title}</ReadingRoomTitle>
      {body ? <ReadingRoomLine>{body}</ReadingRoomLine> : null}
      {showLiving ? (
        <PaperPage mark="passage" className="mt-4">
          <LivingSentence
            words={localeData.canonicalWords}
            mode="exhibit"
            focusWordId={
              stepId === "connections" || stepId === "soft-lookup"
                ? localeData.canonicalItId
                : null
            }
            links={
              stepId === "connections" || stepId === "soft-lookup"
                ? localeData.demoAttentionLinks
                : []
            }
            reducedMotion={reducedMotion}
          />
          {showHonesty ? <HonestyChip /> : null}
        </PaperPage>
      ) : null}
      <p className="rr-stub-note">{stubNote}</p>
      <ReadingRoomContinue
        label={cta}
        onClick={onContinue}
        disabled={!gateOpen}
      />
    </ReadingRoomFrame>
  );
}

function stubCopy(
  stepId: Lesson8StepId,
  steps: ReturnType<typeof useLesson8StepCopy>,
  continueCta: string,
): {
  plaque?: string;
  title: string;
  body?: string;
  cta: string;
  showLiving?: boolean;
  showHonesty?: boolean;
} {
  switch (stepId) {
    case "opening":
      return {
        plaque: steps.opening.plaque,
        title: steps.opening.title,
        body: steps.opening.body2,
        cta: steps.opening.cta,
        showLiving: true,
      };
    case "telephone":
      return {
        plaque: steps.telephone.plaque,
        title: steps.telephone.title,
        body: steps.telephone.body,
        cta: steps.telephone.cta,
        showLiving: true,
      };
    case "connections":
      return {
        plaque: steps.connections.plaque,
        title: steps.connections.title,
        body: steps.connections.body,
        cta: steps.connections.cta,
        showLiving: true,
        showHonesty: true,
      };
    case "paper":
      return {
        plaque: steps.paper.plaque,
        title: steps.paper.title,
        body: steps.paper.body,
        cta: steps.paper.cta,
      };
    case "soft-lookup":
      return {
        plaque: steps.softLookup.plaque,
        title: steps.softLookup.title,
        body: steps.softLookup.body,
        cta: steps.softLookup.cta,
        showLiving: true,
        showHonesty: true,
      };
    case "order":
      return {
        plaque: steps.order.plaque,
        title: steps.order.title,
        body: steps.order.body,
        cta: steps.order.cta,
      };
    case "stack":
      return {
        plaque: steps.stack.plaque,
        title: steps.stack.title,
        body: steps.stack.body,
        cta: steps.stack.cta,
      };
    case "hide-future":
      return {
        plaque: steps.hideFuture.plaque,
        title: steps.hideFuture.title,
        body: steps.hideFuture.body,
        cta: steps.hideFuture.cta,
        showLiving: true,
      };
    case "why-mattered":
      return {
        plaque: steps.whyMattered.plaque,
        title: steps.whyMattered.title,
        body: steps.whyMattered.body,
        cta: steps.whyMattered.cta,
      };
    case "next-token":
      return {
        plaque: steps.nextToken.plaque,
        title: steps.nextToken.title,
        body: steps.nextToken.body,
        cta: steps.nextToken.cta,
        showLiving: true,
        showHonesty: true,
      };
    case "challenge":
      return {
        plaque: steps.challenge.plaque,
        title: steps.challenge.title,
        body: steps.challenge.body,
        cta: steps.challenge.cta,
      };
    case "reflection":
      return {
        plaque: steps.reflection.plaque,
        title: steps.reflection.title,
        cta: steps.reflection.cta,
      };
    case "closing":
      return {
        plaque: steps.closing.plaque,
        title: steps.closing.headline,
        body: steps.closing.body,
        cta: steps.closing.home,
      };
    default:
      return { title: stepId, cta: continueCta };
  }
}
