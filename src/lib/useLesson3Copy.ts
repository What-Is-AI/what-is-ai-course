"use client";

import { useMemo } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  CORPUS_BARS,
  CORPUS_OPTION_IDS,
  DATA_CARDS,
  DATASET_OPTIONS,
  DETECTIVE_DATASETS,
  DETECTIVE_LIMIT,
  DOCTOR_REASON_IDS,
  DOCTORS,
  HARD_IMAGES,
  INTERNET_ERA,
  TRAINER_CASES,
  detectiveFeedback,
  type DataAnswer,
  type DetectiveBucket,
} from "@/lib/lesson3-data";

function formatList(
  items: string[],
  t: (key: string, vars?: Record<string, string | number>) => string,
) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) {
    return t("lesson2.shared.and", { a: items[0], b: items[1] });
  }
  return t("lesson2.shared.listMany", {
    items: items.slice(0, -1).join(", "),
    last: items[items.length - 1],
  });
}

export function useLesson3Copy() {
  const { t, locale } = useLocale();

  return useMemo(() => {
    const doctors = DOCTORS.map((doctor) => {
      const tagline =
        doctor.id === "c"
          ? t("lesson3.doctors.doctors.c.tagline")
          : undefined;
      return {
        ...doctor,
        label: t(`lesson3.doctors.doctors.${doctor.id}.label`),
        tagline,
      };
    });

    const reasons = DOCTOR_REASON_IDS.map((id) => ({
      id,
      label: t(`lesson3.doctors.reasons.${id}`),
    }));

    const hardImages = HARD_IMAGES.map((image) => ({
      ...image,
      label: t(`lesson3.sameBrain.images.${image.id}.label`),
      note: t(`lesson3.sameBrain.images.${image.id}.note`),
    }));

    const dataCards = DATA_CARDS.map((card) => ({
      ...card,
      label: t(`lesson3.data.cards.${card.id}.label`),
      note: t(`lesson3.data.cards.${card.id}.note`),
    }));

    const datasets = DATASET_OPTIONS.map((option) => ({
      ...option,
      label: t(`lesson3.quality.datasets.${option.id}.label`),
      note: t(`lesson3.quality.datasets.${option.id}.note`),
    }));

    const eras = INTERNET_ERA.map((era) => ({
      year: era.year,
      label: t(`lesson3.internet.eras.${era.year}.label`),
      blurb: t(`lesson3.internet.eras.${era.year}.blurb`),
    }));

    const detectiveSets = DETECTIVE_DATASETS.map((dataset) => ({
      ...dataset,
      label: t(`lesson3.detective.datasets.${dataset.id}.label`),
      note: t(`lesson3.detective.datasets.${dataset.id}.note`),
    }));

    const corpusOptions = CORPUS_OPTION_IDS.map((id) => ({
      id,
      label: t(`lesson3.closing.corpus.options.${id}`),
    }));

    const corpusBars = CORPUS_BARS.map((bar) => ({
      ...bar,
      label: t(`lesson3.closing.corpus.chart.${bar.id}.label`),
      note: bar.hasNote
        ? t(`lesson3.closing.corpus.chart.${bar.id}.note`)
        : null,
      inside: bar.hasInside
        ? t(`lesson3.closing.corpus.chart.${bar.id}.inside`)
        : null,
    }));

    const trainerCases = TRAINER_CASES.map((c) => ({
      ...c,
      label: t(`lesson3.quality.trainer.cases.${c.id}.label`),
      short: t(`lesson3.quality.trainer.cases.${c.id}.short`),
      alt: t(`lesson3.quality.trainer.cases.${c.id}.alt`),
    }));

    const answerLabel = (answer: DataAnswer) =>
      t(`lesson3.shared.${answer}`);

    return {
      t,
      locale,
      doctors,
      reasons,
      hardImages,
      dataCards,
      datasets,
      eras,
      detectiveSets,
      detectiveLimit: DETECTIVE_LIMIT,
      detectiveFeedbackFor: (buckets: DetectiveBucket[]) => {
        const result = detectiveFeedback(buckets);
        if (result.key === "heavy") {
          return t("lesson3.detective.feedback.heavy", {
            bucket: t(`lesson3.detective.buckets.${result.bucket}`),
          });
        }
        return t(`lesson3.detective.feedback.${result.key}`);
      },
      formatKeptList: (labels: string[]) => formatList(labels, t),
      corpusOptions,
      corpusBars,
      trainerCases,
      answerLabel,
    };
  }, [t, locale]);
}
