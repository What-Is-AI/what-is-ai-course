"use client";

import { useEffect } from "react";
import {
  ListeningRoomContinue,
  ListeningRoomFrame,
  ListeningRoomLine,
  ListeningRoomTitle,
} from "@/components/lesson7/ListeningRoomFrame";
import { useT } from "@/i18n/LocaleProvider";
import {
  useLesson7Chrome,
  useLesson7StepCopy,
} from "@/lib/useLesson7Copy";
import type { Lesson7StepId } from "@/lib/lesson7-data";

type Props = {
  stepId: Lesson7StepId;
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
};

/**
 * Phase 0 placeholder for steps not yet built.
 * Opens the gate immediately and shows script title + CTA when available.
 */
export function StepStub({ stepId, onContinue, gateOpen, onGate }: Props) {
  const t = useT();
  const steps = useLesson7StepCopy();
  const chrome = useLesson7Chrome();
  const stubUi = chrome.stepStub ?? {};

  useEffect(() => {
    if (!gateOpen) onGate();
  }, [gateOpen, onGate]);

  const { plaque, title, body, cta } = stubCopy(
    stepId,
    steps,
    stubUi,
    t("common.continue"),
  );

  return (
    <ListeningRoomFrame>
      <ListeningRoomTitle plaque={plaque}>{title}</ListeningRoomTitle>
      {body ? <ListeningRoomLine>{body}</ListeningRoomLine> : null}
      <p className="lr-stub-note">{stubUi.stubNote}</p>
      <ListeningRoomContinue
        label={cta}
        onClick={onContinue}
        disabled={!gateOpen}
      />
    </ListeningRoomFrame>
  );
}

function stubCopy(
  stepId: Lesson7StepId,
  steps: ReturnType<typeof useLesson7StepCopy>,
  stubUi: Record<string, string>,
  continueCta: string,
): {
  plaque?: string;
  title: string;
  body?: string;
  cta: string;
} {
  switch (stepId) {
    case "predict-pick":
      return {
        title: steps.predictPick.title,
        body: steps.predictPick.subhead,
        cta: steps.predictPick.cta,
      };
    case "predict-name":
      return {
        title: steps.predictName.title,
        body: steps.predictName.subhead,
        cta: steps.predictName.cta,
      };
    case "hand-rules":
      return {
        plaque: steps.handRules.plaque,
        title: steps.handRules.title,
        body: steps.handRules.body,
        cta: steps.handRules.cta,
      };
    case "hand-test":
      return {
        title: stubUi.testTitle ?? steps.handTest.subhead,
        body: steps.handTest.subhead,
        cta: steps.handTest.cta,
      };
    case "hand-wall":
      return {
        plaque: steps.handWall.plaque,
        title: steps.handWall.title,
        body: steps.handWall.contrastA,
        cta: steps.handWall.cta,
      };
    case "two-paths":
      return {
        plaque: steps.twoPaths.plaque,
        title: steps.twoPaths.title,
        body: steps.twoPaths.body,
        cta: steps.twoPaths.cta,
      };
    case "label-train":
      return {
        title: steps.labelTrain.title,
        body: steps.labelTrain.status,
        cta: steps.labelTrain.cta,
      };
    case "rep-reveal":
      return {
        plaque: steps.repReveal.plaque,
        title: steps.repReveal.title,
        body: steps.repReveal.term,
        cta: steps.repReveal.cta,
      };
    case "head-to-head":
      return {
        plaque: steps.headToHead.plaque,
        title: steps.headToHead.title,
        body: steps.headToHead.body,
        cta: steps.headToHead.cta,
      };
    case "hidden":
      return {
        plaque: steps.hidden.plaque,
        title: steps.hidden.title,
        body: steps.hidden.body1,
        cta: steps.hidden.cta,
      };
    case "task-dep":
      return {
        plaque: steps.taskDep.plaque,
        title: steps.taskDep.title,
        body: steps.taskDep.helper,
        cta: steps.taskDep.cta,
      };
    case "who-decides":
      return {
        plaque: steps.whoDecides.plaque,
        title: steps.whoDecides.title,
        body: steps.whoDecides.body,
        cta: steps.whoDecides.cta,
      };
    case "challenge":
      return {
        plaque: steps.challenge.plaque,
        title: steps.challenge.prompt,
        body: steps.challenge.land,
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
