"use client";

import Link from "next/link";
import { useLocale, useT } from "@/i18n/LocaleProvider";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getMessageNode } from "@/i18n/translate";
import type { LessonSeoSpine } from "@/lib/seo-lesson-copy";
import { type SeoPageKey } from "@/lib/seo";
import {
  getCourseIndexEntries,
  isCourseIndexKey,
} from "@/lib/seo-json-ld";
import { LESSONS, lessonCopyPrefix } from "@/lib/lessons";

type LessonSeoArticleProps = {
  pageKey: SeoPageKey;
};

function spineMessagePath(pageKey: SeoPageKey): string | null {
  const lesson = LESSONS.find((item) => item.href === `/${pageKey}`);
  if (!lesson) return null;
  return `${lessonCopyPrefix(lesson)}.seoSpine`;
}

function Spine({
  spine,
  crumbName,
  lessonsLabel,
  homeLabel,
  breadcrumbAria,
  overviewAria,
}: {
  spine: LessonSeoSpine;
  crumbName: string;
  lessonsLabel: string;
  homeLabel: string;
  breadcrumbAria: string;
  overviewAria: string;
}) {
  return (
    <article className="lesson-seo-article" aria-label={overviewAria}>
      <div className="lesson-seo-article-inner">
        <nav aria-label={breadcrumbAria} className="lesson-seo-breadcrumb">
          <ol className="lesson-seo-breadcrumb-list">
            <li>
              <Link href="/">{homeLabel}</Link>
            </li>
            <li>
              <Link href="/lessons">{lessonsLabel}</Link>
            </li>
            <li aria-current="page">{crumbName}</li>
          </ol>
        </nav>
        <h1 className="lesson-seo-article-title">{spine.h1}</h1>
        <p className="lesson-seo-article-lead">{spine.lead}</p>
        {spine.sections.map((section) => (
          <section key={section.heading} className="lesson-seo-article-section">
            <h2 className="lesson-seo-article-h2">{section.heading}</h2>
            <p className="lesson-seo-article-body">{section.body}</p>
          </section>
        ))}
      </div>
    </article>
  );
}

/** Crawlable textual spine; follows UI locale when a message spine exists. */
export function LessonSeoArticle({ pageKey }: LessonSeoArticleProps) {
  const { locale } = useLocale();
  const t = useT();
  if (!isCourseIndexKey(pageKey)) return null;

  const path = spineMessagePath(pageKey);
  if (!path) return null;

  const spine =
    getMessageNode<LessonSeoSpine>(locale, path) ??
    getMessageNode<LessonSeoSpine>(DEFAULT_LOCALE, path);
  if (!spine) return null;

  const crumbName =
    spine.h1 ??
    getCourseIndexEntries().find((e) => e.key === pageKey)?.breadcrumbName ??
    spine.h1;

  return (
    <Spine
      spine={spine}
      crumbName={crumbName}
      homeLabel={t("lessonsIndex.breadcrumbHome")}
      lessonsLabel={t("lessonsIndex.breadcrumbCurrent")}
      breadcrumbAria={t("common.breadcrumbAria")}
      overviewAria={t("common.lessonOverviewAria")}
    />
  );
}
