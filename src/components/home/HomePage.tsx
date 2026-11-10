"use client";

import Link from "next/link";
import { CourseFrame } from "@/components/lesson/CourseFrame";
import { useT } from "@/i18n/LocaleProvider";
import { VISIBLE_LESSONS, lessonCopyPrefix } from "@/lib/lessons";

export function HomePage() {
  const t = useT();

  return (
    <CourseFrame>
      <div className="course-page min-h-screen">
        <div className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-16 pt-16 sm:px-8 lg:pt-14">
          <header>
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              {t("nav.brand")}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
              {t("home.tagline")}
            </p>
            <div className="mt-8">
              <Link href="/lessons/1" className="btn-primary">
                {t("home.startCta", { number: 1 })}
              </Link>
            </div>
          </header>

          <section className="mt-16" aria-labelledby="lessons-heading">
            <h2
              id="lessons-heading"
              className="text-sm font-medium text-ink-soft"
            >
              <Link
                href="/lessons"
                className="hover:text-ink hover:underline underline-offset-2"
              >
                {t("nav.lessons")}
              </Link>
            </h2>
            <ol className="mt-3 divide-y divide-line border-y border-line">
              {VISIBLE_LESSONS.map((lesson) => {
                const prefix = lessonCopyPrefix(lesson);
                const badge =
                  lesson.number != null
                    ? t(`${prefix}.meta.badge`, { number: lesson.number })
                    : t(`${prefix}.meta.badge`);
                return (
                  <li key={lesson.id}>
                    <Link href={lesson.href} className="course-home-row">
                      <span className="course-home-row-index">{badge}</span>
                      <span className="min-w-0 flex-1">
                        <span className="font-display block text-xl font-bold tracking-tight text-ink">
                          {t(`${prefix}.meta.title`)}
                        </span>
                        <span className="mt-1 block text-[0.975rem] leading-snug text-ink-soft">
                          {t(`${prefix}.meta.mystery`)}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      </div>
    </CourseFrame>
  );
}
