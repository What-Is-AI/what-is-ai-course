"use client";

import { useMemo } from "react";
import { useT } from "@/i18n/LocaleProvider";
import {
  APPROACH_PROBLEMS,
  CAT_RULE_IDS,
  CHAIR_EXAMPLE_IDS,
  DOG_SHARED_RULE_IDS,
  INTERNET_STICKY_IDS,
  RULE_EXCEPTION_IDS,
  TRAIN_SAMPLES,
  TRAIN_TEST_IMAGE,
  TRAIN_TRAP_TEST_IMAGE,
  TWIST_GUESS_IDS,
  counterexamplesForRules,
  customPinnedRules,
  isCatRuleId,
  pinnedHasSuggestion,
  type CatRuleId,
  type CounterexampleMeta,
} from "@/lib/lesson2-data";

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

export function useLesson2Copy() {
  const t = useT();

  return useMemo(() => {
    const suggestionLabels = Object.fromEntries(
      CAT_RULE_IDS.map((id) => [
        id,
        t(`lesson2.rules.suggestions.${id}`),
      ]),
    ) as Record<CatRuleId, string>;

    function displayRule(rule: string) {
      const trimmed = rule.trim();
      if (isCatRuleId(trimmed)) return suggestionLabels[trimmed];
      return rule;
    }

    function formatQuotedRules(rules: string[]) {
      return formatList(
        rules.map((rule) => `“${displayRule(rule)}”`),
        t,
      );
    }

    function noteForCounterexample(
      ex: CounterexampleMeta,
      rules: string[],
    ): string {
      const customs = customPinnedRules(rules, suggestionLabels);
      let base = t(`lesson2.rules.counterexamples.${ex.id}.note`);

      if (
        ex.id === "lion-cub" &&
        pinnedHasSuggestion(rules, "smallBody", suggestionLabels.smallBody)
      ) {
        base = t("lesson2.rules.counterexamples.lion-cub.noteSmallBody");
      } else if (ex.id === "dog") {
        const shared = DOG_SHARED_RULE_IDS.filter((id) =>
          pinnedHasSuggestion(rules, id, suggestionLabels[id]),
        ).map((id) => suggestionLabels[id]);
        if (shared.length >= 2) {
          base = t("lesson2.rules.counterexamples.dog.noteShared", {
            list: formatList(shared, t),
          });
        } else {
          base = t("lesson2.rules.counterexamples.dog.noteFallback");
        }
      }

      if (customs.length === 0) return base;
      const list = formatQuotedRules(customs);
      const noun = t(
        customs.length === 1
          ? "lesson2.rules.coda.ruleOne"
          : "lesson2.rules.coda.ruleMany",
      );
      const codaKey =
        ex.result === "false-positive"
          ? "lesson2.rules.coda.falsePositive"
          : ex.result === "false-negative"
            ? "lesson2.rules.coda.falseNegative"
            : "lesson2.rules.coda.ambiguous";
      return `${base}${t(codaKey, { noun, list })}`;
    }

    const suggestions = CAT_RULE_IDS.map((id) => ({
      id,
      label: suggestionLabels[id],
    }));

    const exceptions = RULE_EXCEPTION_IDS.map((id) => ({
      id,
      label: t(`lesson2.explosion.exceptions.${id}`),
    }));

    const samples = TRAIN_SAMPLES.map((sample) => ({
      ...sample,
      hint: t(`lesson2.train.samples.${sample.id}`),
    }));

    const problems = APPROACH_PROBLEMS.map((problem) => ({
      ...problem,
      label: t(`lesson2.approach.problems.${problem.id}.label`),
      note: t(`lesson2.approach.problems.${problem.id}.note`),
    }));

    const twistGuesses = TWIST_GUESS_IDS.map((id) => ({
      id,
      label: t(`lesson2.twist.guesses.${id}`),
    }));

    const chairExamples = CHAIR_EXAMPLE_IDS.map((id) =>
      t(`lesson2.chair.examples.${id}`),
    );

    const internetStickies = INTERNET_STICKY_IDS.map((id) =>
      t(`lesson2.closing.internet.stickies.${id}`),
    );

    return {
      t,
      suggestionLabels,
      suggestions,
      displayRule,
      noteForCounterexample,
      examplesForRules: (rules: string[]) =>
        counterexamplesForRules(rules, suggestionLabels).map((ex) => ({
          ...ex,
          label: t(`lesson2.rules.counterexamples.${ex.id}.label`),
          note: noteForCounterexample(ex, rules),
        })),
      resultLabel: (result: CounterexampleMeta["result"]) =>
        t(`lesson2.shared.results.${result}`),
      exceptions,
      samples,
      testImage: {
        ...TRAIN_TEST_IMAGE,
        hint: t("lesson2.train.test.hint"),
      },
      trapImage: {
        ...TRAIN_TRAP_TEST_IMAGE,
        hint: t("lesson2.train.trap.hint"),
        alt: t("lesson2.train.trap.alt"),
      },
      problems,
      twistGuesses,
      chairExamples,
      internetStickies,
      approachLabel: (id: "rules" | "learning" | "hybrid") =>
        t(`lesson2.shared.approaches.${id}`),
      animalLabel: (id: "cat" | "dog") => t(`lesson2.train.label.${id}`),
    };
  }, [t]);
}
