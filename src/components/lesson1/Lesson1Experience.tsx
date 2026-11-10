"use client";

import { useState } from "react";
import {
  Closing,
  LESSON1_CLOSING_PHASES,
  type Lesson1ClosingPhase,
} from "@/components/lesson1/Closing";
import { Consolidation } from "@/components/lesson1/Consolidation";
import { DependsToggle } from "@/components/lesson1/DependsToggle";
import { IsThisAI } from "@/components/lesson1/IsThisAI";
import { MuseumShell } from "@/components/lesson1/MuseumShell";
import { Reflection } from "@/components/lesson1/Reflection";
import { Reveal } from "@/components/lesson1/Reveal";
import { SortHook } from "@/components/lesson1/SortHook";
import { SortRound2 } from "@/components/lesson1/SortRound2";
import { Timeline } from "@/components/lesson1/Timeline";
import { useLessonSteps } from "@/components/lesson/useLessonSteps";
import { useLessonAnalytics } from "@/lib/analytics/useLessonAnalytics";
import { type Bucket } from "@/lib/lesson1-data";
import { saveLocal } from "@/lib/storage";

const STEPS = [
  "hook",
  "reveal",
  "round2",
  "depends",
  "timeline",
  "exercise",
  "consolidation",
  "reflection",
  ...LESSON1_CLOSING_PHASES.map((phase) => `closing-${phase}` as const),
] as const;

function closingPhaseOf(step: string): Lesson1ClosingPhase | null {
  if (!step.startsWith("closing-")) return null;
  return step.slice("closing-".length) as Lesson1ClosingPhase;
}

export function Lesson1Experience() {
  const { step, next, prev, totalSteps } = useLessonSteps(STEPS.length);
  useLessonAnalytics({ lessonId: "1", step, totalSteps });
  const [placements, setPlacements] = useState<Record<string, Bucket>>({});
  const current = STEPS[step];
  const closingPhase = closingPhaseOf(current);

  let content: React.ReactNode = null;
  if (current === "hook") {
    content = (
      <SortHook
        key="hook"
        onContinue={(nextPlacements) => {
          setPlacements(nextPlacements);
          saveLocal("lesson1-sort-round1", nextPlacements);
          next();
        }}
      />
    );
  } else if (current === "reveal") {
    content = (
      <Reveal
        key="reveal"
        placements={placements}
        onBack={prev}
        onContinue={next}
      />
    );
  } else if (current === "round2") {
    content = (
      <SortRound2
        key="round2"
        onContinue={(round2) => {
          saveLocal("lesson1-sort-round2", round2);
          next();
        }}
      />
    );
  } else if (current === "depends") {
    content = <DependsToggle key="depends" onContinue={next} />;
  } else if (current === "timeline") {
    content = <Timeline key="timeline" onContinue={next} />;
  } else if (current === "exercise") {
    content = <IsThisAI key="exercise" onContinue={next} />;
  } else if (current === "consolidation") {
    content = <Consolidation key="consolidation" onContinue={next} />;
  } else if (current === "reflection") {
    content = <Reflection key="reflection" onContinue={next} />;
  } else if (closingPhase) {
    content = (
      <Closing key={closingPhase} phase={closingPhase} onContinue={next} />
    );
  }

  return (
    <MuseumShell
      step={step}
      totalSteps={totalSteps}
      onPrev={prev}
      onNext={next}
    >
      {content}
    </MuseumShell>
  );
}
