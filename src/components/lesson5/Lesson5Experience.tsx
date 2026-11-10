"use client";

import { Arrive } from "@/components/lesson5/Arrive";
import { FirstReveal } from "@/components/lesson5/FirstReveal";
import { FinalChallenge } from "@/components/lesson5/FinalChallenge";
import { ImpossibleSplit } from "@/components/lesson5/ImpossibleSplit";
import { Layers } from "@/components/lesson5/Layers";
import { Lesson5Closing } from "@/components/lesson5/Lesson5Closing";
import { NetworkHistory } from "@/components/lesson5/NetworkHistory";
import { NetworkReflection } from "@/components/lesson5/NetworkReflection";
import { NetworkShell } from "@/components/lesson5/NetworkShell";
import { OneUnit } from "@/components/lesson5/OneUnit";
import { Opening } from "@/components/lesson5/Opening";
import { OverfitSurprise } from "@/components/lesson5/OverfitSurprise";
import { Prediction } from "@/components/lesson5/Prediction";
import { Scale } from "@/components/lesson5/Scale";
import { TuneWeights } from "@/components/lesson5/TuneWeights";
import { Vocabulary } from "@/components/lesson5/Vocabulary";
import { WatchLearning } from "@/components/lesson5/WatchLearning";
import { useLessonSteps } from "@/components/lesson/useLessonSteps";
import { useLessonAnalytics } from "@/lib/analytics/useLessonAnalytics";
import { LESSON5_STEPS } from "@/lib/lesson5-data";

export function Lesson5Experience() {
  const { step, next, prev, totalSteps } = useLessonSteps(LESSON5_STEPS.length);
  useLessonAnalytics({ lessonId: "5", step, totalSteps });
  const current = LESSON5_STEPS[step];

  let content: React.ReactNode = null;
  if (current === "arrive") content = <Arrive key="arrive" onContinue={next} />;
  else if (current === "opening")
    content = <Opening key="opening" onContinue={next} />;
  else if (current === "prediction")
    content = <Prediction key="prediction" onContinue={next} />;
  else if (current === "impossible-split")
    content = <ImpossibleSplit key="impossible-split" onContinue={next} />;
  else if (current === "one-unit")
    content = <OneUnit key="one-unit" onContinue={next} />;
  else if (current === "tune-weights")
    content = <TuneWeights key="tune-weights" onContinue={next} />;
  else if (current === "first-reveal")
    content = <FirstReveal key="first-reveal" onContinue={next} />;
  else if (current === "overfit")
    content = <OverfitSurprise key="overfit" onContinue={next} />;
  else if (current === "layers")
    content = <Layers key="layers" onContinue={next} />;
  else if (current === "vocabulary")
    content = <Vocabulary key="vocabulary" onContinue={next} />;
  else if (current === "watch-learning")
    content = <WatchLearning key="watch-learning" onContinue={next} />;
  else if (current === "scale") content = <Scale key="scale" onContinue={next} />;
  else if (current === "history")
    content = <NetworkHistory key="history" onContinue={next} />;
  else if (current === "reflection")
    content = <NetworkReflection key="reflection" onContinue={next} />;
  else if (current === "final-challenge")
    content = <FinalChallenge key="final-challenge" onContinue={next} />;
  else if (current === "closing")
    content = <Lesson5Closing key="closing" />;

  return (
    <NetworkShell
      step={step}
      totalSteps={totalSteps}
      onPrev={prev}
      onNext={next}
      canNext={current !== "closing" && step < totalSteps - 1}
    >
      {content}
    </NetworkShell>
  );
}
