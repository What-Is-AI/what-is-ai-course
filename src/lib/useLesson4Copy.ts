"use client";

import { useMemo } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  ASSUMPTION_CHOICES,
  CLOSING_TAKEAWAY_IDS,
  CURVE_BETS,
  DIAL_EXAMPLES,
  FIRST_INSTINCTS,
  HISTORY_ERA_IDS,
  LABEL_ASK_CHOICES,
  LOOP_CARDS,
  LOOP_CYCLE_FLASH_IDS,
  NEXT_WORD_ROUNDS,
  TRAIN_STAGES,
  WEATHER_CHOICES,
  dialDelta,
  type Animal,
  type DialDirection,
  type DialExample,
} from "@/lib/lesson4-data";

export function useLesson4Copy() {
  const { t, locale } = useLocale();

  return useMemo(() => {
    const animalLabel = (id: Animal) => t(`lesson4.shared.${id}`);

    const formatPrediction = (label: Animal, confidence: number) =>
      t("lesson4.shared.prediction", {
        label: animalLabel(label),
        confidence,
      });

    const assumptions = ASSUMPTION_CHOICES.map((choice) => ({
      ...choice,
      label: t(`lesson4.assumption.choices.${choice.id}.label`),
      getsSmarterBy: choice.hasGetsSmarterBy
        ? t(`lesson4.assumption.choices.${choice.id}.getsSmarterBy`)
        : null,
    }));

    const instincts = FIRST_INSTINCTS.map((instinct) => ({
      ...instinct,
      label: t(`lesson4.firstPrediction.instincts.${instinct.id}.label`),
      failureCaption: instinct.survives
        ? undefined
        : t(`lesson4.firstPrediction.instincts.${instinct.id}.failureCaption`),
      failureLine: instinct.survives
        ? undefined
        : t(`lesson4.firstPrediction.instincts.${instinct.id}.failureLine`),
      successFrom: instinct.survives
        ? t("lesson4.firstPrediction.instincts.adjust.successFrom")
        : undefined,
      successTo: instinct.survives
        ? t("lesson4.firstPrediction.instincts.adjust.successTo")
        : undefined,
      successLine: instinct.survives
        ? t("lesson4.firstPrediction.instincts.adjust.successLine")
        : undefined,
    }));

    const startGuess = t("lesson4.firstPrediction.instincts.adjust.successFrom");

    const curveBets = CURVE_BETS.map((bet) => ({
      ...bet,
      label: t(`lesson4.train.bets.${bet.id}`),
    }));

    const trainStages = TRAIN_STAGES.map((stage) => ({
      ...stage,
      prediction:
        stage.id === "0"
          ? undefined
          : t(`lesson4.train.stages.${stage.id}.prediction`),
      result:
        stage.id === "0"
          ? undefined
          : t(`lesson4.train.stages.${stage.id}.result`),
      dipGloss: stage.dip
        ? t(`lesson4.train.stages.${stage.id}.dipGloss`)
        : undefined,
    }));

    const loopCards = LOOP_CARDS.map((card) => ({
      ...card,
      label: t(`lesson4.loop.cards.${card.id}.label`),
      gloss: card.decoy
        ? undefined
        : t(`lesson4.loop.cards.${card.id}.gloss`),
    }));

    const loopFlashes = LOOP_CYCLE_FLASH_IDS.map((id) => ({
      id,
      prediction: t(`lesson4.loop.flashes.${id}.prediction`),
      result: t(`lesson4.loop.flashes.${id}.result`),
    }));

    const labelChoices = LABEL_ASK_CHOICES.map((choice) => ({
      ...choice,
      label: t(`lesson4.labeled.choices.${choice.id}`),
    }));

    const nextWordRounds = NEXT_WORD_ROUNDS.map((round) => ({
      ...round,
      prompt: t(`lesson4.labeled.rounds.${round.id}.prompt`),
      options: round.optionIds.map((optionId) => ({
        id: optionId,
        label: t(`lesson4.labeled.rounds.${round.id}.options.${optionId}`),
      })),
      answerLabel: t(
        `lesson4.labeled.rounds.${round.id}.options.${round.answer}`,
      ),
    }));

    const historyEras = HISTORY_ERA_IDS.map((id) => ({
      id,
      year: t(`lesson4.history.eras.${id}.year`),
      label: t(`lesson4.history.eras.${id}.label`),
      blurb: t(`lesson4.history.eras.${id}.blurb`),
    }));

    const weatherChoices = WEATHER_CHOICES.map((choice) => ({
      ...choice,
      label: t(`lesson4.reflection.weather.${choice.id}`),
    }));

    const takeaways = CLOSING_TAKEAWAY_IDS.map((id) =>
      t(`lesson4.closing.takeaways.items.${id}`),
    );

    return {
      t,
      locale,
      animalLabel,
      formatPrediction,
      scoreLine: (example: DialExample, direction: DialDirection) => {
        const { signed, towardTruth } = dialDelta(example, direction);
        return t(
          towardTruth
            ? "lesson4.whichWay.towardTruth"
            : "lesson4.whichWay.furtherTruth",
          { signed },
        );
      },
      assumptions,
      assumptionById: (id: string | null | undefined) =>
        assumptions.find((c) => c.id === id) ?? null,
      instincts,
      startGuess,
      dialExamples: DIAL_EXAMPLES,
      curveBets,
      trainStages,
      loopCards,
      loopFlashes,
      labelChoices,
      nextWordRounds,
      historyEras,
      weatherChoices,
      takeaways,
    };
  }, [t, locale]);
}
