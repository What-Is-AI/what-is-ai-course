"use client";

import { useCallback } from "react";
import { Arrive } from "@/components/lesson7/Arrive";
import { Challenge } from "@/components/lesson7/Challenge";
import { HandRules } from "@/components/lesson7/HandRules";
import { HandTest } from "@/components/lesson7/HandTest";
import { HandWall } from "@/components/lesson7/HandWall";
import { HeadToHead } from "@/components/lesson7/HeadToHead";
import { Hidden } from "@/components/lesson7/Hidden";
import { LabelTrain } from "@/components/lesson7/LabelTrain";
import { Lesson7AudioProvider } from "@/components/lesson7/useLesson7Audio";
import { Lesson7Closing } from "@/components/lesson7/Lesson7Closing";
import { Lesson7SessionProvider } from "@/components/lesson7/useLesson7Session";
import { ListeningRoomShell } from "@/components/lesson7/ListeningRoomShell";
import { PredictName } from "@/components/lesson7/PredictName";
import { PredictPick } from "@/components/lesson7/PredictPick";
import { Reflection } from "@/components/lesson7/Reflection";
import { RepReveal } from "@/components/lesson7/RepReveal";
import { TaskDep } from "@/components/lesson7/TaskDep";
import { TwoPaths } from "@/components/lesson7/TwoPaths";
import { WhoDecides } from "@/components/lesson7/WhoDecides";
import { useListeningRoomGates } from "@/components/lesson7/useListeningRoomGates";
import { useLessonSteps } from "@/components/lesson/useLessonSteps";
import { useLessonAnalytics } from "@/lib/analytics/useLessonAnalytics";
import {
  LESSON7_STEP_IDS,
  type Lesson7StepId,
} from "@/lib/lesson7-data";

export function Lesson7Experience() {
  const { step, next, prev, totalSteps } = useLessonSteps(
    LESSON7_STEP_IDS.length,
  );
  useLessonAnalytics({ lessonId: "7", step, totalSteps });
  const { isComplete, markComplete, prefersReducedMotion } =
    useListeningRoomGates(LESSON7_STEP_IDS);
  const current = LESSON7_STEP_IDS[step] as Lesson7StepId;

  const onGate = useCallback(() => {
    markComplete(current);
  }, [markComplete, current]);

  const gateOpen = isComplete(current);
  const shared = { onContinue: next, gateOpen, onGate };

  let content: React.ReactNode = null;
  if (current === "arrive") {
    content = (
      <Arrive key="arrive" {...shared} reducedMotion={prefersReducedMotion} />
    );
  } else if (current === "predict-pick") {
    content = (
      <PredictPick
        key="predict-pick"
        {...shared}
        reducedMotion={prefersReducedMotion}
      />
    );
  } else if (current === "predict-name") {
    content = <PredictName key="predict-name" {...shared} />;
  } else if (current === "hand-rules") {
    content = <HandRules key="hand-rules" {...shared} />;
  } else if (current === "hand-test") {
    content = (
      <HandTest
        key="hand-test"
        {...shared}
        reducedMotion={prefersReducedMotion}
      />
    );
  } else if (current === "hand-wall") {
    content = <HandWall key="hand-wall" {...shared} />;
  } else if (current === "two-paths") {
    content = <TwoPaths key="two-paths" {...shared} />;
  } else if (current === "label-train") {
    content = (
      <LabelTrain
        key="label-train"
        {...shared}
        reducedMotion={prefersReducedMotion}
      />
    );
  } else if (current === "rep-reveal") {
    content = <RepReveal key="rep-reveal" {...shared} />;
  } else if (current === "head-to-head") {
    content = (
      <HeadToHead
        key="head-to-head"
        {...shared}
        reducedMotion={prefersReducedMotion}
      />
    );
  } else if (current === "hidden") {
    content = (
      <Hidden key="hidden" {...shared} reducedMotion={prefersReducedMotion} />
    );
  } else if (current === "task-dep") {
    content = (
      <TaskDep
        key="task-dep"
        {...shared}
        reducedMotion={prefersReducedMotion}
      />
    );
  } else if (current === "who-decides") {
    content = <WhoDecides key="who-decides" {...shared} />;
  } else if (current === "challenge") {
    content = (
      <Challenge
        key="challenge"
        {...shared}
        reducedMotion={prefersReducedMotion}
      />
    );
  } else if (current === "reflection") {
    content = <Reflection key="reflection" {...shared} />;
  } else if (current === "closing") {
    content = (
      <Lesson7Closing
        key="closing"
        onGate={onGate}
        reducedMotion={prefersReducedMotion}
      />
    );
  }

  return (
    <Lesson7AudioProvider>
      <Lesson7SessionProvider>
        <ListeningRoomShell
          step={step}
          totalSteps={totalSteps}
          onPrev={prev}
          onNext={next}
          canNext={current !== "closing" && step < totalSteps - 1}
        >
          {content}
        </ListeningRoomShell>
      </Lesson7SessionProvider>
    </Lesson7AudioProvider>
  );
}
