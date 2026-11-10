"use client";

import { useEffect, useState } from "react";
import { BuildIt } from "@/components/practical1/BuildIt";
import { ConnectedOfficeShell } from "@/components/practical1/ConnectedOfficeShell";
import { ConnectedReflection } from "@/components/practical1/ConnectedReflection";
import {
  Practical1Closing,
  PRACTICAL1_CLOSING_PHASES,
  type Practical1ClosingPhase,
} from "@/components/practical1/Practical1Closing";
import { Prediction } from "@/components/practical1/Prediction";
import { SandboxSetup } from "@/components/practical1/SandboxSetup";
import { SortRound1 } from "@/components/practical1/SortRound1";
import { SortRound2 } from "@/components/practical1/SortRound2";
import { TheFlip } from "@/components/practical1/TheFlip";
import { TheKeys } from "@/components/practical1/TheKeys";
import { TheOverreach } from "@/components/practical1/TheOverreach";
import { ThePrinciple } from "@/components/practical1/ThePrinciple";
import { useLessonSteps } from "@/components/lesson/useLessonSteps";
import { useLessonAnalytics } from "@/lib/analytics/useLessonAnalytics";
import { loadLocal, saveLocal } from "@/lib/storage";
import type {
  GutBucketId,
  PredictionChoiceId,
  SortCardId,
} from "@/lib/practical1-data";

const STEPS = [
  "keys",
  "overreach",
  "prediction",
  "sort-r1",
  "flip",
  "sort-r2",
  "principle",
  "sandbox-setup",
  "build",
  "reflection",
  ...PRACTICAL1_CLOSING_PHASES.map((phase) => `closing-${phase}` as const),
] as const;

function closingPhaseOf(step: string): Practical1ClosingPhase | null {
  if (!step.startsWith("closing-")) return null;
  return step.slice("closing-".length) as Practical1ClosingPhase;
}

export function Practical1Experience() {
  const { step, next, prev, totalSteps } = useLessonSteps(STEPS.length);
  useLessonAnalytics({ lessonId: "just-because-it-can", step, totalSteps });
  const current = STEPS[step];
  const closingPhase = closingPhaseOf(current);

  const [predictionId, setPredictionId] = useState<PredictionChoiceId | null>(
    null,
  );
  const [gutPlacements, setGutPlacements] = useState<
    Record<SortCardId, GutBucketId> | null
  >(null);

  useEffect(() => {
    setPredictionId(
      loadLocal<PredictionChoiceId | null>("practical-1-prediction", null),
    );
    setGutPlacements(
      loadLocal<Record<SortCardId, GutBucketId> | null>(
        "practical-1-sort-r1",
        null,
      ),
    );
  }, []);

  const mood =
    current === "overreach"
      ? "sting"
      : current === "flip" || current === "sort-r2"
        ? "sober"
        : current === "reflection" || closingPhase
          ? "morning"
          : "open";

  let content: React.ReactNode = null;

  if (current === "keys") {
    content = <TheKeys key="keys" onContinue={next} />;
  } else if (current === "overreach") {
    content = <TheOverreach key="overreach" onContinue={next} />;
  } else if (current === "prediction") {
    content = (
      <Prediction
        key="prediction"
        onContinue={(id) => {
          setPredictionId(id);
          saveLocal("practical-1-prediction", id);
          next();
        }}
      />
    );
  } else if (current === "sort-r1") {
    content = (
      <SortRound1
        key="sort-r1"
        onContinue={(placements) => {
          setGutPlacements(placements);
          saveLocal("practical-1-sort-r1", placements);
          next();
        }}
      />
    );
  } else if (current === "flip") {
    content = gutPlacements ? (
      <TheFlip
        key="flip"
        gutPlacements={gutPlacements}
        predictionId={predictionId}
        onContinue={next}
      />
    ) : (
      <SortRound1
        key="sort-r1-recover-flip"
        onContinue={(placements) => {
          setGutPlacements(placements);
          saveLocal("practical-1-sort-r1", placements);
        }}
      />
    );
  } else if (current === "sort-r2") {
    content = gutPlacements ? (
      <SortRound2
        key="sort-r2"
        gutPlacements={gutPlacements}
        onContinue={next}
      />
    ) : (
      <SortRound1
        key="sort-r1-recover-r2"
        onContinue={(placements) => {
          setGutPlacements(placements);
          saveLocal("practical-1-sort-r1", placements);
        }}
      />
    );
  } else if (current === "principle") {
    content = <ThePrinciple key="principle" onContinue={next} />;
  } else if (current === "sandbox-setup") {
    content = <SandboxSetup key="sandbox-setup" onContinue={next} />;
  } else if (current === "build") {
    content = <BuildIt key="build" onContinue={next} />;
  } else if (current === "reflection") {
    content = <ConnectedReflection key="reflection" onContinue={next} />;
  } else if (closingPhase) {
    content = (
      <Practical1Closing
        key={closingPhase}
        phase={closingPhase}
        onContinue={next}
      />
    );
  }

  return (
    <ConnectedOfficeShell
      step={step}
      totalSteps={totalSteps}
      onPrev={prev}
      onNext={next}
      canNext={step < totalSteps - 1 && current !== "prediction"}
      mood={mood}
    >
      {content}
    </ConnectedOfficeShell>
  );
}
