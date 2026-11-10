"use client";

import { useMemo } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  HAND_OFF_BUCKET_IDS,
  HANDOFF_SETUP_IDS,
  INJECTION_CHOICES,
  JUDGMENT_ITEMS,
  MEET_BODY_IDS,
  NEXT_STEP_IDS,
  PILE_SET_DRESSING_IDS,
  PREDICTION_CHOICES,
  REFLECTION_PROMPT_IDS,
  TAKEAWAY_IDS,
  USUAL_TOOL_IDS,
  WATCH_FRAME_IDS,
} from "@/lib/delegate-real-work-data";

export function useDelegateRealWorkCopy() {
  const { t, locale } = useLocale();

  return useMemo(() => {
    const setDressing = PILE_SET_DRESSING_IDS.map((id) =>
      t(`delegateRealWork.pile.setDressing.${id}`),
    );

    const predictionChoices = PREDICTION_CHOICES.map((choice) => ({
      ...choice,
      label: t(`delegateRealWork.prediction.choices.${choice.id}`),
    }));

    const usualTools = USUAL_TOOL_IDS.map((id) => ({
      id,
      tool: t(`delegateRealWork.usualTools.items.${id}.tool`),
      why: t(`delegateRealWork.usualTools.items.${id}.why`),
    }));

    const meetBody = MEET_BODY_IDS.map((id) =>
      t(`delegateRealWork.meet.body.${id}`),
    );

    const watchFrames = WATCH_FRAME_IDS.map((id) => ({
      id,
      frame: t(`delegateRealWork.watch.frames.${id}.frame`),
      detail: t(`delegateRealWork.watch.frames.${id}.detail`),
    }));

    const injectionChoices = INJECTION_CHOICES.map((choice) => ({
      ...choice,
      label: t(`delegateRealWork.injection.choices.${choice.id}.label`),
      verdict: t(`delegateRealWork.injection.choices.${choice.id}.verdict`),
    }));

    const handoffSetup = HANDOFF_SETUP_IDS.map((id) =>
      t(`delegateRealWork.handoff.setup.${id}`),
    );

    const nextStepRows = NEXT_STEP_IDS.map((id) => ({
      id,
      upgrade: t(`delegateRealWork.nextSteps.rows.${id}.upgrade`),
      adds: t(`delegateRealWork.nextSteps.rows.${id}.adds`),
      needs: t(`delegateRealWork.nextSteps.rows.${id}.needs`),
    }));

    const judgmentBuckets = HAND_OFF_BUCKET_IDS.map((id) => ({
      id,
      label: t(`delegateRealWork.judgment.buckets.${id}`),
    }));

    const judgmentItems = JUDGMENT_ITEMS.map((item) => ({
      ...item,
      task: t(`delegateRealWork.judgment.items.${item.id}.task`),
      note: t(`delegateRealWork.judgment.items.${item.id}.note`),
    }));

    const reflectionPrompts = REFLECTION_PROMPT_IDS.map((id) => ({
      id,
      label: t(`delegateRealWork.reflection.prompts.${id}.label`),
      placeholder: t(`delegateRealWork.reflection.prompts.${id}.placeholder`),
    }));

    const takeaways = TAKEAWAY_IDS.map((id) =>
      t(`delegateRealWork.takeaways.items.${id}`),
    );

    return {
      t,
      locale,
      setDressing,
      predictionChoices,
      usualTools,
      meetBody,
      watchFrames,
      injectionChoices,
      handoffSetup,
      nextStepRows,
      judgmentBuckets,
      judgmentBucketLabel: (id: string) =>
        judgmentBuckets.find((b) => b.id === id)?.label ?? id,
      judgmentItems,
      reflectionPrompts,
      takeaways,
    };
  }, [t, locale]);
}
