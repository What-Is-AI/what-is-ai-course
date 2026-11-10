"use client";

import { BuildYourContext } from "@/components/working-with-llms/BuildYourContext";
import { DiagnoseDifference } from "@/components/working-with-llms/DiagnoseDifference";
import { OneShotVsIteration } from "@/components/working-with-llms/OneShotVsIteration";
import { ReusableOrDisposable } from "@/components/working-with-llms/ReusableOrDisposable";
import { RightAltitude } from "@/components/working-with-llms/RightAltitude";
import {
  StudioClosing,
  STUDIO_CLOSING_PHASES,
  type StudioClosingPhase,
} from "@/components/working-with-llms/StudioClosing";
import { StudioHook } from "@/components/working-with-llms/StudioHook";
import { StudioReflection } from "@/components/working-with-llms/StudioReflection";
import { StudioShell } from "@/components/working-with-llms/StudioShell";
import { WhyContextWorks } from "@/components/working-with-llms/WhyContextWorks";
import { useLessonSteps } from "@/components/lesson/useLessonSteps";
import { useLessonAnalytics } from "@/lib/analytics/useLessonAnalytics";
import { trackChoice } from "@/lib/analytics/attemptRegistry";
import { QStep } from "@/lib/analytics/questionIds";
import { saveLocal } from "@/lib/storage";
import type {
  AltitudeChoiceId,
  ApproachChoiceId,
  CauseChoiceId,
  ContextCardId,
  ContextChipId,
  PredictionSliderValue,
} from "@/lib/working-with-llms-data";

const STEPS = [
  "studio-hook",
  "diagnose",
  "why-context",
  "build-context",
  "one-shot",
  "transfer",
  "altitude",
  "reflection",
  ...STUDIO_CLOSING_PHASES.map((phase) => `closing-${phase}` as const),
] as const;

function closingPhaseOf(step: string): StudioClosingPhase | null {
  if (!step.startsWith("closing-")) return null;
  return step.slice("closing-".length) as StudioClosingPhase;
}

export function WorkingWithLlmsExperience() {
  const { step, next, prev, totalSteps } = useLessonSteps(STEPS.length);
  useLessonAnalytics({ lessonId: "working-with-llms", step, totalSteps });
  const current = STEPS[step];
  const closingPhase = closingPhaseOf(current);

  let content: React.ReactNode = null;
  if (current === "studio-hook") {
    content = (
      <StudioHook
        key="studio-hook"
        onContinue={(guess: PredictionSliderValue) => {
          trackChoice({
            questionId: QStep.predictionGuess,
            selectedOptionId: String(guess),
          });
          saveLocal("lesson-x-prediction-guess", guess);
          next();
        }}
      />
    );
  } else if (current === "diagnose") {
    content = (
      <DiagnoseDifference
        key="diagnose"
        onContinue={(picked: CauseChoiceId[]) => {
          for (const id of picked) {
            trackChoice({ questionId: QStep.causePick, selectedOptionId: id });
          }
          saveLocal("lesson-x-cause-picks", picked);
          next();
        }}
      />
    );
  } else if (current === "why-context") {
    content = (
      <WhyContextWorks
        key="why-context"
        onContinue={(active: ContextChipId[]) => {
          for (const id of active) {
            trackChoice({ questionId: QStep.contextChip, selectedOptionId: id });
          }
          saveLocal("lesson-x-context-chips", active);
          next();
        }}
      />
    );
  } else if (current === "build-context") {
    content = (
      <BuildYourContext
        key="build-context"
        onContinue={(pinned: ContextCardId[]) => {
          for (const id of pinned) {
            trackChoice({ questionId: QStep.contextCard, selectedOptionId: id });
          }
          saveLocal("lesson-x-pinned-context", pinned);
          next();
        }}
      />
    );
  } else if (current === "one-shot") {
    content = (
      <OneShotVsIteration
        key="one-shot"
        onContinue={(choice: ApproachChoiceId) => {
          trackChoice({
            questionId: QStep.approachChoice,
            selectedOptionId: choice,
          });
          saveLocal("lesson-x-approach-choice", choice);
          next();
        }}
      />
    );
  } else if (current === "transfer") {
    content = (
      <ReusableOrDisposable
        key="transfer"
        onContinue={(score: number) => {
          trackChoice({
            questionId: QStep.transferScore,
            selectedOptionId: String(score),
          });
          saveLocal("lesson-x-transfer-score", score);
          next();
        }}
      />
    );
  } else if (current === "altitude") {
    content = (
      <RightAltitude
        key="altitude"
        onContinue={(choice: AltitudeChoiceId) => {
          trackChoice({
            questionId: QStep.altitudeChoice,
            selectedOptionId: choice,
          });
          saveLocal("lesson-x-altitude-choice", choice);
          next();
        }}
      />
    );
  } else if (current === "reflection") {
    content = <StudioReflection key="reflection" onContinue={next} />;
  } else if (closingPhase) {
    content = (
      <StudioClosing
        key={closingPhase}
        phase={closingPhase}
        onContinue={next}
      />
    );
  }

  return (
    <StudioShell
      step={step}
      totalSteps={totalSteps}
      onPrev={prev}
      onNext={next}
    >
      {content}
    </StudioShell>
  );
}
