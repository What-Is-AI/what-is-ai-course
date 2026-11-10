"use client";

import { useMemo } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  ACCESS_SCOPE_IDS,
  GATE_QUESTION_IDS,
  GATE_VERDICT_IDS,
  GO_DEEPER_BODY_IDS,
  GUT_BUCKET_IDS,
  PREDICTION_CHOICE_IDS,
  PRINCIPLE_BODY_IDS,
  REFLECTION_PROMPT_IDS,
  SANDBOX_SET_IDS,
  SORT_CARD_IDS,
  TRANSFER_CHOICE_IDS,
} from "@/lib/practical1-data";

export function usePractical1Copy() {
  const { t, locale } = useLocale();

  return useMemo(() => {
    const accessScopes = ACCESS_SCOPE_IDS.map((id) => ({
      id,
      label: t(`practical1.keys.scopes.${id}.label`),
      note: t(`practical1.keys.scopes.${id}.note`),
    }));

    const predictionChoices = PREDICTION_CHOICE_IDS.map((id) => ({
      id,
      label: t(`practical1.prediction.choices.${id}`),
    }));

    const gutBuckets = GUT_BUCKET_IDS.map((id) => ({
      id,
      label: t(`practical1.shared.gutBuckets.${id}`),
    }));

    const gateVerdicts = GATE_VERDICT_IDS.map((id) => ({
      id,
      label: t(`practical1.shared.gateVerdicts.${id}`),
    }));

    const sortCards = SORT_CARD_IDS.map((id) => ({
      id,
      title: t(`practical1.sort.cards.${id}.title`),
      detail: t(`practical1.sort.cards.${id}.detail`),
      plainLine: t(`practical1.sort.cards.${id}.plainLine`),
      deciding: t(`practical1.sort.cards.${id}.deciding`),
    }));

    const gateQuestions = GATE_QUESTION_IDS.map((id) => ({
      id,
      title: t(`practical1.gate.questions.${id}.title`),
      body: t(`practical1.gate.questions.${id}.body`),
    }));

    const principleBody = PRINCIPLE_BODY_IDS.map((id) =>
      t(`practical1.principle.body.${id}`),
    );

    const goDeeperBody = GO_DEEPER_BODY_IDS.map((id) =>
      t(`practical1.principle.goDeeper.body.${id}`),
    );

    const sandboxSet = SANDBOX_SET_IDS.map((id) => ({
      id,
      label: t(`practical1.sandbox.set.${id}`),
    }));

    const reflectionPrompts = REFLECTION_PROMPT_IDS.map((id) => ({
      id,
      label: t(`practical1.reflection.prompts.${id}.label`),
      placeholder: t(`practical1.reflection.prompts.${id}.placeholder`),
    }));

    const transferChoices = TRANSFER_CHOICE_IDS.map((id) => ({
      id,
      label: t(`practical1.gate.transfer.choices.${id}`),
    }));

    return {
      t,
      locale,
      accessScopes,
      predictionChoices,
      gutBuckets,
      gateVerdicts,
      sortCards,
      gateQuestions,
      principleBody,
      goDeeperBody,
      sandboxSet,
      reflectionPrompts,
      transferChoices,
      gutBucketLabel: (id: string) =>
        gutBuckets.find((b) => b.id === id)?.label ?? id,
      gateVerdictLabel: (id: string) =>
        gateVerdicts.find((b) => b.id === id)?.label ?? id,
      predictionLabel: (id: string) =>
        predictionChoices.find((c) => c.id === id)?.label ?? id,
      sortCard: (id: string) => sortCards.find((c) => c.id === id),
    };
  }, [t, locale]);
}
