"use client";

import Link from "next/link";
import { CourseFrame } from "@/components/lesson/CourseFrame";
import { useT } from "@/i18n/LocaleProvider";
import { COURSE_INDEX_KEYS } from "@/lib/seo-json-ld";

/** Locale-aware course index (titles/descriptions from messages). */
export function LessonsIndex() {
  const t = useT();

  return (
    <CourseFrame>
      <main className="course-page min-h-screen">
        <div className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-16 pt-16 sm:px-8 lg:pt-14">
          <header>
            <nav
              aria-label={t("common.breadcrumbAria")}
              className="lesson-seo-breadcrumb"
            >
              <ol className="lesson-seo-breadcrumb-list">
                <li>
                  <Link href="/">{t("lessonsIndex.breadcrumbHome")}</Link>
                </li>
                <li aria-current="page">{t("lessonsIndex.breadcrumbCurrent")}</li>
              </ol>
            </nav>
            <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              {t("lessonsIndex.title")}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
              {t("lessonsIndex.lead")}
            </p>
          </header>

          <ol className="mt-12 divide-y divide-line border-y border-line">
            {COURSE_INDEX_KEYS.map((key, index) => (
              <li key={key}>
                <Link href={`/${key}`} className="course-home-row">
                  <span className="course-home-row-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display block text-xl font-bold tracking-tight text-ink">
                      {t(`lessonsIndex.entries.${key}.title`)}
                    </span>
                    <span className="mt-1 block text-[0.975rem] leading-snug text-ink-soft">
                      {t(`lessonsIndex.entries.${key}.description`)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-sm text-ink-soft">
            {t("lessonsIndex.preferIntro")}{" "}
            <Link
              href="/"
              className="font-medium text-ink underline-offset-2 hover:underline"
            >
              {t("lessonsIndex.startHome")}
            </Link>
            {" · "}
            <Link
              href="/about"
              className="font-medium text-ink underline-offset-2 hover:underline"
            >
              {t("lessonsIndex.aboutCourse")}
            </Link>
          </p>
        </div>
      </main>
    </CourseFrame>
  );
}
