"use client";

import { useCallback } from "react";
import { Arrive } from "@/components/lesson6/Arrive";
import { Budget } from "@/components/lesson6/Budget";
import { Challenge } from "@/components/lesson6/Challenge";
import { Compose } from "@/components/lesson6/Compose";
import { CompressBottleneck } from "@/components/lesson6/CompressBottleneck";
import { CompressHuman } from "@/components/lesson6/CompressHuman";
import { CompressReveal } from "@/components/lesson6/CompressReveal";
import { DeepenCallback } from "@/components/lesson6/DeepenCallback";
import { DeepenInspect } from "@/components/lesson6/DeepenInspect";
import { DeepenPlateau } from "@/components/lesson6/DeepenPlateau";
import { DeepenReveal } from "@/components/lesson6/DeepenReveal";
import { DeepenWidth } from "@/components/lesson6/DeepenWidth";
import { DepthShell } from "@/components/lesson6/DepthShell";
import { Lesson6Closing } from "@/components/lesson6/Lesson6Closing";
import { Reflection } from "@/components/lesson6/Reflection";
import { Tracker } from "@/components/lesson6/Tracker";
import { useDepthGates } from "@/components/lesson6/useDepthGates";
import { useLessonSteps } from "@/components/lesson/useLessonSteps";
import { useLessonAnalytics } from "@/lib/analytics/useLessonAnalytics";
import {
  LESSON6_STEP_IDS,
  type Lesson6StepId,
} from "@/lib/lesson6-data";

export function Lesson6Experience() {
  const { step, next, prev, totalSteps } = useLessonSteps(
    LESSON6_STEP_IDS.length,
  );
  useLessonAnalytics({ lessonId: "6", step, totalSteps });
  const { isComplete, markComplete, prefersReducedMotion } =
    useDepthGates(LESSON6_STEP_IDS);
  const current = LESSON6_STEP_IDS[step] as Lesson6StepId;

  const onGate = useCallback(() => {
    markComplete(current);
  }, [markComplete, current]);

  const gateOpen = isComplete(current);
  const shared = { onContinue: next, gateOpen, onGate };

  let content: React.ReactNode = null;
  if (current === "arrive") {
    content = (
      <Arrive
        key="arrive"
        {...shared}
        reducedMotion={prefersReducedMotion}
      />
    );
  } else if (current === "compose") {
    content = <Compose key="compose" {...shared} />;
  } else if (current === "compress-human") {
    content = <CompressHuman key="compress-human" {...shared} />;
  } else if (current === "compress-bottleneck") {
    content = <CompressBottleneck key="compress-bottleneck" {...shared} />;
  } else if (current === "compress-reveal") {
    content = <CompressReveal key="compress-reveal" {...shared} />;
  } else if (current === "deepen-callback") {
    content = <DeepenCallback key="deepen-callback" {...shared} />;
  } else if (current === "deepen-inspect") {
    content = <DeepenInspect key="deepen-inspect" {...shared} />;
  } else if (current === "deepen-width") {
    content = <DeepenWidth key="deepen-width" {...shared} />;
  } else if (current === "deepen-plateau") {
    content = <DeepenPlateau key="deepen-plateau" {...shared} />;
  } else if (current === "deepen-reveal") {
    content = <DeepenReveal key="deepen-reveal" {...shared} />;
  } else if (current === "budget") {
    content = <Budget key="budget" {...shared} />;
  } else if (current === "challenge") {
    content = <Challenge key="challenge" {...shared} />;
  } else if (current === "reflection") {
    content = (
      <Reflection key="reflection" onContinue={next} onGate={onGate} />
    );
  } else if (current === "tracker") {
    content = <Tracker key="tracker" {...shared} />;
  } else if (current === "closing") {
    content = (
      <Lesson6Closing
        key="closing"
        onGate={onGate}
        reducedMotion={prefersReducedMotion}
      />
    );
  }

  return (
    <DepthShell
      step={step}
      totalSteps={totalSteps}
      onPrev={prev}
      onNext={next}
      canNext={current !== "closing" && step < totalSteps - 1}
      handoffAtmosphere={current === "closing"}
      reducedMotion={prefersReducedMotion}
    >
      {content}
    </DepthShell>
  );
}
