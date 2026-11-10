"use client";

import { useState } from "react";
import { CatRules } from "@/components/lesson2/CatRules";
import { ChairAnalogy } from "@/components/lesson2/ChairAnalogy";
import { LabShell } from "@/components/lesson2/LabShell";
import {
  Lesson2Closing,
  LESSON2_CLOSING_PHASES,
  type Lesson2ClosingPhase,
} from "@/components/lesson2/Lesson2Closing";
import { MissionHook } from "@/components/lesson2/MissionHook";
import { RuleExplosion } from "@/components/lesson2/RuleExplosion";
import { TrainModel } from "@/components/lesson2/TrainModel";
import { Twist } from "@/components/lesson2/Twist";
import { WhichApproach } from "@/components/lesson2/WhichApproach";
import { useLessonSteps } from "@/components/lesson/useLessonSteps";
import { useLessonAnalytics } from "@/lib/analytics/useLessonAnalytics";
import { saveLocal } from "@/lib/storage";

const STEPS = [
  "mission",
  "rules",
  "explosion",
  "train",
  "approach",
  "chair",
  "twist",
  ...LESSON2_CLOSING_PHASES.map((phase) => `closing-${phase}` as const),
] as const;

function closingPhaseOf(step: string): Lesson2ClosingPhase | null {
  if (!step.startsWith("closing-")) return null;
  return step.slice("closing-".length) as Lesson2ClosingPhase;
}

export function Lesson2Experience() {
  const { step, next, prev, totalSteps } = useLessonSteps(STEPS.length);
  useLessonAnalytics({ lessonId: "2", step, totalSteps });
  const [rules, setRules] = useState<string[]>([]);
  const current = STEPS[step];
  const closingPhase = closingPhaseOf(current);

  let content: React.ReactNode = null;
  if (current === "mission") {
    content = <MissionHook key="mission" onContinue={next} />;
  } else if (current === "rules") {
    content = (
      <CatRules
        key="rules"
        onContinue={(nextRules) => {
          setRules(nextRules);
          saveLocal("lesson2-rules", nextRules);
          next();
        }}
      />
    );
  } else if (current === "explosion") {
    content = (
      <RuleExplosion
        key="explosion"
        rules={rules}
        onBack={prev}
        onContinue={next}
      />
    );
  } else if (current === "train") {
    content = <TrainModel key="train" onContinue={next} />;
  } else if (current === "approach") {
    content = <WhichApproach key="approach" onContinue={next} />;
  } else if (current === "chair") {
    content = <ChairAnalogy key="chair" onContinue={next} />;
  } else if (current === "twist") {
    content = <Twist key="twist" onContinue={next} />;
  } else if (closingPhase) {
    content = (
      <Lesson2Closing
        key={closingPhase}
        phase={closingPhase}
        onContinue={next}
      />
    );
  }

  return (
    <LabShell step={step} totalSteps={totalSteps} onPrev={prev} onNext={next}>
      {content}
    </LabShell>
  );
}
