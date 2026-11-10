"use client";

import { useState } from "react";
import { ControlPanel } from "@/components/lesson4/ControlPanel";
import { Facility } from "@/components/lesson4/Facility";
import { FacilityShell } from "@/components/lesson4/FacilityShell";
import { FirstPrediction } from "@/components/lesson4/FirstPrediction";
import { History } from "@/components/lesson4/History";
import { LearningLoop } from "@/components/lesson4/LearningLoop";
import {
  Lesson4Closing,
  LESSON4_CLOSING_PHASES,
  type Lesson4ClosingPhase,
} from "@/components/lesson4/Lesson4Closing";
import { OneMoreExample } from "@/components/lesson4/OneMoreExample";
import { PredictionAssumption } from "@/components/lesson4/PredictionAssumption";
import { Reflection } from "@/components/lesson4/Reflection";
import { TrainTheModel } from "@/components/lesson4/TrainTheModel";
import { WhichWay } from "@/components/lesson4/WhichWay";
import { WhoLabeledInternet } from "@/components/lesson4/WhoLabeledInternet";
import { useLessonSteps } from "@/components/lesson/useLessonSteps";
import { useLessonAnalytics } from "@/lib/analytics/useLessonAnalytics";
import { saveLocal } from "@/lib/storage";

const STEPS = [
  "facility",
  "assumption",
  "first-prediction",
  "which-way",
  "train",
  "loop",
  "control-panel",
  "one-more",
  "labeled-internet",
  "history",
  "reflection",
  ...LESSON4_CLOSING_PHASES.map((phase) => `closing-${phase}` as const),
] as const;

function closingPhaseOf(step: string): Lesson4ClosingPhase | null {
  if (!step.startsWith("closing-")) return null;
  return step.slice("closing-".length) as Lesson4ClosingPhase;
}

export function Lesson4Experience() {
  const { step, next, prev, totalSteps } = useLessonSteps(STEPS.length);
  useLessonAnalytics({ lessonId: "4", step, totalSteps });
  const [predictedMechanism, setPredictedMechanism] = useState<string | null>(
    null,
  );
  const current = STEPS[step];
  const closingPhase = closingPhaseOf(current);

  let content: React.ReactNode = null;
  if (current === "facility") {
    content = <Facility key="facility" onContinue={next} />;
  } else if (current === "assumption") {
    content = (
      <PredictionAssumption
        key="assumption"
        onContinue={(id) => {
          setPredictedMechanism(id);
          saveLocal("lesson4-predicted-mechanism", id);
          next();
        }}
      />
    );
  } else if (current === "first-prediction") {
    content = <FirstPrediction key="first-prediction" onContinue={next} />;
  } else if (current === "which-way") {
    content = <WhichWay key="which-way" onContinue={next} />;
  } else if (current === "train") {
    content = <TrainTheModel key="train" onContinue={next} />;
  } else if (current === "loop") {
    content = <LearningLoop key="loop" onContinue={next} />;
  } else if (current === "control-panel") {
    content = <ControlPanel key="control-panel" onContinue={next} />;
  } else if (current === "one-more") {
    content = <OneMoreExample key="one-more" onContinue={next} />;
  } else if (current === "labeled-internet") {
    content = <WhoLabeledInternet key="labeled-internet" onContinue={next} />;
  } else if (current === "history") {
    content = <History key="history" onContinue={next} />;
  } else if (current === "reflection") {
    content = (
      <Reflection
        key="reflection"
        predictedMechanism={predictedMechanism}
        onContinue={next}
      />
    );
  } else if (closingPhase) {
    content = (
      <Lesson4Closing
        key={closingPhase}
        phase={closingPhase}
        onContinue={next}
      />
    );
  }

  return (
    <FacilityShell
      step={step}
      totalSteps={totalSteps}
      onPrev={prev}
      onNext={next}
    >
      {content}
    </FacilityShell>
  );
}
