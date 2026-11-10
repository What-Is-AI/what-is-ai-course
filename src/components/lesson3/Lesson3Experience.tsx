"use client";

import { BiggerIsntBetter } from "@/components/lesson3/BiggerIsntBetter";
import { DetectivePick } from "@/components/lesson3/DetectivePick";
import { InternetChangedAI } from "@/components/lesson3/InternetChangedAI";
import {
  Lesson3Closing,
  LESSON3_CLOSING_PHASES,
  type Lesson3ClosingPhase,
} from "@/components/lesson3/Lesson3Closing";
import { LibraryShell } from "@/components/lesson3/LibraryShell";
import { SameBrain } from "@/components/lesson3/SameBrain";
import { WhatCountsAsData } from "@/components/lesson3/WhatCountsAsData";
import { WhoWouldYouTrust } from "@/components/lesson3/WhoWouldYouTrust";
import { useLessonSteps } from "@/components/lesson/useLessonSteps";
import { useLessonAnalytics } from "@/lib/analytics/useLessonAnalytics";
import { saveLocal } from "@/lib/storage";

const STEPS = [
  "doctors",
  "same-brain",
  "data-cards",
  "quality",
  "internet",
  "detective",
  ...LESSON3_CLOSING_PHASES.map((phase) => `closing-${phase}` as const),
] as const;

function closingPhaseOf(step: string): Lesson3ClosingPhase | null {
  if (!step.startsWith("closing-")) return null;
  return step.slice("closing-".length) as Lesson3ClosingPhase;
}

export function Lesson3Experience() {
  const { step, next, prev, totalSteps } = useLessonSteps(STEPS.length);
  useLessonAnalytics({ lessonId: "3", step, totalSteps });
  const current = STEPS[step];
  const closingPhase = closingPhaseOf(current);

  let content: React.ReactNode = null;
  if (current === "doctors") {
    content = <WhoWouldYouTrust key="doctors" onContinue={next} />;
  } else if (current === "same-brain") {
    content = <SameBrain key="same-brain" onContinue={next} />;
  } else if (current === "data-cards") {
    content = <WhatCountsAsData key="data-cards" onContinue={next} />;
  } else if (current === "quality") {
    content = <BiggerIsntBetter key="quality" onContinue={next} />;
  } else if (current === "internet") {
    content = <InternetChangedAI key="internet" onContinue={next} />;
  } else if (current === "detective") {
    content = (
      <DetectivePick
        key="detective"
        onContinue={(picked) => {
          saveLocal("lesson3-detective", picked);
          next();
        }}
      />
    );
  } else if (closingPhase) {
    content = (
      <Lesson3Closing
        key={closingPhase}
        phase={closingPhase}
        onContinue={next}
      />
    );
  }

  return (
    <LibraryShell
      step={step}
      totalSteps={totalSteps}
      onPrev={prev}
      onNext={next}
    >
      {content}
    </LibraryShell>
  );
}
