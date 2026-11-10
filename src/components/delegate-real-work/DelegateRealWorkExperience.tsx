"use client";

import {
  DelegateClosing,
  DELEGATE_CLOSING_PHASES,
  type DelegateClosingPhase,
} from "@/components/delegate-real-work/DelegateClosing";
import { CoworkerReflection } from "@/components/delegate-real-work/CoworkerReflection";
import { CoworkerShell } from "@/components/delegate-real-work/CoworkerShell";
import { Handoff } from "@/components/delegate-real-work/Handoff";
import { Judgment } from "@/components/delegate-real-work/Judgment";
import { MeetCoworker } from "@/components/delegate-real-work/MeetCoworker";
import { NextSteps } from "@/components/delegate-real-work/NextSteps";
import { Prediction } from "@/components/delegate-real-work/Prediction";
import { PromptInjection } from "@/components/delegate-real-work/PromptInjection";
import { ReviewTrust } from "@/components/delegate-real-work/ReviewTrust";
import { Takeaways } from "@/components/delegate-real-work/Takeaways";
import { ThePile } from "@/components/delegate-real-work/ThePile";
import { UsualTools } from "@/components/delegate-real-work/UsualTools";
import { WatchItWork } from "@/components/delegate-real-work/WatchItWork";
import { useLessonSteps } from "@/components/lesson/useLessonSteps";
import { useLessonAnalytics } from "@/lib/analytics/useLessonAnalytics";
import { saveLocal } from "@/lib/storage";
import type { PredictionChoiceId } from "@/lib/delegate-real-work-data";

export { DELEGATE_CLOSING_PHASES };
export type { DelegateClosingPhase };

const STEPS = [
  "pile",
  "prediction",
  "usual-tools",
  "meet",
  "watch",
  "review",
  "prompt-injection",
  "handoff",
  "next-steps",
  "judgment",
  "reflection",
  "takeaways",
  ...DELEGATE_CLOSING_PHASES.map((phase) => `closing-${phase}` as const),
] as const;

function closingPhaseOf(step: string): DelegateClosingPhase | null {
  if (!step.startsWith("closing-")) return null;
  return step.slice("closing-".length) as DelegateClosingPhase;
}

export function DelegateRealWorkExperience() {
  const { step, next, prev, totalSteps } = useLessonSteps(STEPS.length);
  useLessonAnalytics({ lessonId: "delegate-real-work", step, totalSteps });
  const current = STEPS[step];
  const closingPhase = closingPhaseOf(current);

  const mood =
    current === "review" || current === "prompt-injection"
      ? "sober"
      : current === "watch"
        ? "working"
        : "warm";

  let content: React.ReactNode = null;

  if (current === "pile") {
    content = <ThePile key="pile" onContinue={next} />;
  } else if (current === "prediction") {
    content = (
      <Prediction
        key="prediction"
        onContinue={(choiceId: PredictionChoiceId) => {
          saveLocal("delegate-real-work-prediction", choiceId);
          next();
        }}
      />
    );
  } else if (current === "usual-tools") {
    content = <UsualTools key="usual-tools" onContinue={next} />;
  } else if (current === "meet") {
    content = <MeetCoworker key="meet" onContinue={next} />;
  } else if (current === "watch") {
    content = <WatchItWork key="watch" onContinue={next} />;
  } else if (current === "review") {
    content = <ReviewTrust key="review" onContinue={next} />;
  } else if (current === "prompt-injection") {
    content = <PromptInjection key="prompt-injection" onContinue={next} />;
  } else if (current === "handoff") {
    content = <Handoff key="handoff" onContinue={next} />;
  } else if (current === "next-steps") {
    content = <NextSteps key="next-steps" onContinue={next} />;
  } else if (current === "judgment") {
    content = <Judgment key="judgment" onContinue={next} />;
  } else if (current === "reflection") {
    content = <CoworkerReflection key="reflection" onContinue={next} />;
  } else if (current === "takeaways") {
    content = <Takeaways key="takeaways" onContinue={next} />;
  } else if (closingPhase) {
    content = (
      <DelegateClosing
        key={closingPhase}
        phase={closingPhase}
        onContinue={next}
      />
    );
  }

  return (
    <CoworkerShell
      step={step}
      totalSteps={totalSteps}
      onPrev={prev}
      onNext={next}
      mood={mood}
    >
      {content}
    </CoworkerShell>
  );
}
