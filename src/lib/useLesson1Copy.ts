"use client";

import { useMemo } from "react";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import {
  BUCKET_IDS,
  DEPENDS_TOGGLE,
  DOMAIN_IDS,
  ORIGIN_IDS,
  SCENARIOS,
  SORT_ROUND1_ACTIVE,
  SORT_ROUND2_ACTIVE,
  TIMELINE,
  TIMELINE_SOURCES_META,
  type Bucket,
  type Domain,
  type Origin,
  type ScenarioKind,
} from "@/lib/lesson1-data";

export function useLesson1Copy() {
  const t = useT();
  const { tOptional } = useLocale();

  return useMemo(() => {
    const empty = t("lesson1.shared.empty");
    const buckets = BUCKET_IDS.map((id) => ({
      id,
      label: t(`lesson1.shared.buckets.${id}`),
    }));
    const domains = DOMAIN_IDS.map((id) => ({
      id,
      label: t(`lesson1.shared.domains.${id}`),
    }));
    const origins = ORIGIN_IDS.map((id) => ({
      id,
      label: t(`lesson1.shared.origins.${id}`),
    }));

    function bucketLabel(bucket?: Bucket) {
      if (!bucket) return empty;
      return t(`lesson1.shared.buckets.${bucket}`);
    }
    function domainLabel(domain?: Domain) {
      if (!domain) return empty;
      return t(`lesson1.shared.domains.${domain}`);
    }
    function originLabel(origin?: Origin) {
      if (!origin) return empty;
      return t(`lesson1.shared.origins.${origin}`);
    }
    function domainBlurb(domain: Domain) {
      return t(`lesson1.shared.domainBlurbs.${domain}`);
    }
    function originBlurb(origin: Origin) {
      return t(`lesson1.shared.originBlurbs.${origin}`);
    }
    function scenarioKindLabel(kind: ScenarioKind) {
      return t(`lesson1.shared.scenarioKinds.${kind}`);
    }

    const round1 = SORT_ROUND1_ACTIVE.map((item) => ({
      ...item,
      label: t(`lesson1.items.${item.id}.label`),
      note: t(`lesson1.items.${item.id}.note`),
      refs: item.refs?.map((ref) => ({
        term: t(`lesson1.items.${item.id}.refs.${ref.id}.term`),
        tip: t(`lesson1.items.${item.id}.refs.${ref.id}.tip`),
        href: ref.href,
      })),
    }));

    const round2 = SORT_ROUND2_ACTIVE.map((item) => ({
      ...item,
      label: t(`lesson1.round2Items.${item.id}.label`),
      note: t(`lesson1.round2Items.${item.id}.note`),
      whatIs: t(`lesson1.round2Items.${item.id}.whatIs`),
    }));

    const depends = DEPENDS_TOGGLE.map((item) => ({
      ...item,
      label: t(`lesson1.dependsItems.${item.id}.label`),
      note: t(`lesson1.dependsItems.${item.id}.note`),
      eraThen: {
        ...item.eraThen,
        label: t(`lesson1.dependsItems.${item.id}.eraThen`),
      },
      eraNow: {
        ...item.eraNow,
        label: t(`lesson1.dependsItems.${item.id}.eraNow`),
      },
    }));

    const timeline = TIMELINE.map((item) => ({
      ...item,
      label: t(`lesson1.timelineItems.${item.id}.label`),
      blurb: t(`lesson1.timelineItems.${item.id}.blurb`),
    }));

    const timelineSources = TIMELINE_SOURCES_META.map((source) => ({
      ...source,
      cite: t(`lesson1.timelineSources.${source.id}.cite`),
      note: tOptional(`lesson1.timelineSources.${source.id}.note`),
      flag: tOptional(`lesson1.timelineSources.${source.id}.flag`),
    }));

    const scenarios = SCENARIOS.map((scenario) => ({
      ...scenario,
      prompt: t(`lesson1.scenarios.${scenario.id}.prompt`),
      reveal: t(`lesson1.scenarios.${scenario.id}.reveal`),
      label: t(`lesson1.cases.labels.${scenario.id}`),
      options: scenario.optionIds.map((id) => ({
        id,
        label: t(`lesson1.scenarios.${scenario.id}.options.${id}`),
      })),
    }));

    return {
      t,
      empty,
      buckets,
      domains,
      origins,
      bucketLabel,
      domainLabel,
      originLabel,
      domainBlurb,
      originBlurb,
      scenarioKindLabel,
      round1,
      round2,
      depends,
      timeline,
      timelineSources,
      scenarios,
    };
  }, [t, tOptional]);
}
