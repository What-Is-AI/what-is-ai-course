"use client";

import { useMemo } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  ALTITUDE_CHOICES,
  APPROACH_CHOICE_IDS,
  CAUSE_CHOICES,
  CONTEXT_CARD_IDS,
  CONTEXT_CHIP_IDS,
  PREDICTION_SLIDER_IDS,
  TRANSFER_CHOICE_IDS,
  TRANSFER_SCENARIOS,
} from "@/lib/working-with-llms-data";

export function useWorkingWithLlmsCopy() {
  const { t, locale } = useLocale();

  return useMemo(() => {
    const sliderOptions = PREDICTION_SLIDER_IDS.map((id) => ({
      id,
      label: t(`workingWithLlms.hook.slider.${id}`),
    }));

    const causeChoices = CAUSE_CHOICES.map((choice) => ({
      ...choice,
      label: t(`workingWithLlms.diagnose.causes.${choice.id}`),
    }));

    const contextChips = CONTEXT_CHIP_IDS.map((id) => ({
      id,
      label: t(`workingWithLlms.whyContext.chips.${id}.label`),
      effect: t(`workingWithLlms.whyContext.chips.${id}.effect`),
    }));

    const contextCards = CONTEXT_CARD_IDS.map((id) => ({
      id,
      label: t(`workingWithLlms.build.cards.${id}.label`),
      body: t(`workingWithLlms.build.cards.${id}.body`),
    }));

    const approachChoices = APPROACH_CHOICE_IDS.map((id) => ({
      id,
      label: t(`workingWithLlms.oneShot.approaches.${id}`),
    }));

    const transferChoices = TRANSFER_CHOICE_IDS.map((id) => ({
      id,
      label: t(`workingWithLlms.transfer.choices.${id}`),
    }));

    const transferScenarios = TRANSFER_SCENARIOS.map((scenario) => ({
      ...scenario,
      scenario: t(
        `workingWithLlms.transfer.scenarios.${scenario.id}.scenario`,
      ),
      note: t(`workingWithLlms.transfer.scenarios.${scenario.id}.note`),
    }));

    const altitudeChoices = ALTITUDE_CHOICES.map((choice) => ({
      ...choice,
      label: t(`workingWithLlms.altitude.choices.${choice.id}.label`),
      detail: t(`workingWithLlms.altitude.choices.${choice.id}.detail`),
    }));

    return {
      t,
      locale,
      sliderOptions,
      causeChoices,
      contextChips,
      contextCards,
      approachChoices,
      transferChoices,
      transferChoiceLabel: (id: string) =>
        transferChoices.find((c) => c.id === id)?.label ?? id,
      transferScenarios,
      altitudeChoices,
    };
  }, [t, locale]);
}
