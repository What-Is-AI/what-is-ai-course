"use client";

import { useCallback } from "react";
import { Challenge } from "@/components/lesson8/Challenge";
import { Connections } from "@/components/lesson8/Connections";
import { HideFuture } from "@/components/lesson8/HideFuture";
import { Lesson8Closing } from "@/components/lesson8/Lesson8Closing";
import { MultiHead } from "@/components/lesson8/MultiHead";
import { NextToken } from "@/components/lesson8/NextToken";
import { Opening } from "@/components/lesson8/Opening";
import { Order } from "@/components/lesson8/Order";
import { PaperReveal } from "@/components/lesson8/PaperReveal";
import { ReadingRoomShell } from "@/components/lesson8/ReadingRoomShell";
import { Reflection } from "@/components/lesson8/Reflection";
import { SoftLookup } from "@/components/lesson8/SoftLookup";
import { Stack } from "@/components/lesson8/Stack";
import { Telephone } from "@/components/lesson8/Telephone";
import { WhyMattered } from "@/components/lesson8/WhyMattered";
import { useReadingRoomGates } from "@/components/lesson8/useReadingRoomGates";
import { useLessonSteps } from "@/components/lesson/useLessonSteps";
import { useLessonAnalytics } from "@/lib/analytics/useLessonAnalytics";
import {
  LESSON8_STEP_IDS,
  type Lesson8StepId,
} from "@/lib/lesson8-data";

export function Lesson8Experience() {
  const { step, next, prev, totalSteps } = useLessonSteps(
    LESSON8_STEP_IDS.length,
  );
  useLessonAnalytics({ lessonId: "8", step, totalSteps });
  const { isComplete, markComplete, prefersReducedMotion } =
    useReadingRoomGates(LESSON8_STEP_IDS);
  const current = LESSON8_STEP_IDS[step] as Lesson8StepId;

  const onGate = useCallback(() => {
    markComplete(current);
  }, [markComplete, current]);

  const gateOpen = isComplete(current);
  const shared = {
    onContinue: next,
    gateOpen,
    onGate,
    reducedMotion: prefersReducedMotion,
  };

  let content: React.ReactNode;
  if (current === "opening") {
    content = <Opening key="opening" {...shared} />;
  } else if (current === "telephone") {
    content = <Telephone key="telephone" {...shared} />;
  } else if (current === "connections") {
    content = <Connections key="connections" {...shared} />;
  } else if (current === "paper") {
    content = <PaperReveal key="paper" {...shared} />;
  } else if (current === "soft-lookup") {
    content = <SoftLookup key="soft-lookup" {...shared} />;
  } else if (current === "order") {
    content = <Order key="order" {...shared} />;
  } else if (current === "stack") {
    content = <Stack key="stack" {...shared} />;
  } else if (current === "hide-future") {
    content = <HideFuture key="hide-future" {...shared} />;
  } else if (current === "multi-head") {
    content = <MultiHead key="multi-head" {...shared} />;
  } else if (current === "why-mattered") {
    content = <WhyMattered key="why-mattered" {...shared} />;
  } else if (current === "next-token") {
    content = <NextToken key="next-token" {...shared} />;
  } else if (current === "challenge") {
    content = <Challenge key="challenge" {...shared} />;
  } else if (current === "reflection") {
    content = <Reflection key="reflection" {...shared} />;
  } else if (current === "closing") {
    content = (
      <Lesson8Closing
        key="closing"
        onGate={onGate}
        reducedMotion={prefersReducedMotion}
      />
    );
  } else {
    content = null;
  }

  return (
    <ReadingRoomShell
      step={step}
      totalSteps={totalSteps}
      onPrev={prev}
      onNext={next}
      canNext={current !== "closing" && step < totalSteps - 1}
    >
      {content}
    </ReadingRoomShell>
  );
}
