"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FeedbackTrigger } from "@/components/FeedbackDialog";
import { useSidebar } from "@/components/lesson/SidebarContext";
import { useT } from "@/i18n/LocaleProvider";
import { openGaConsentBanner } from "@/lib/analytics/consent";
import {
  LESSONS,
  VISIBLE_LESSONS,
  isPracticeLesson,
  lessonCollapsedMark,
  lessonCopyPrefix,
} from "@/lib/lessons";

type CourseSidebarProps = {
  currentLesson?: number | string;
};

function resolveActiveId(
  currentLesson: number | string | undefined,
  pathname: string | null,
) {
  if (typeof currentLesson === "string") {
    return (
      LESSONS.find((lesson) => lesson.id === currentLesson)?.id ??
      LESSONS.find((lesson) => lesson.href === currentLesson)?.id
    );
  }
  if (typeof currentLesson === "number") {
    return LESSONS.find((lesson) => lesson.number === currentLesson)?.id;
  }
  return LESSONS.find((lesson) => pathname?.startsWith(lesson.href))?.id;
}

export function CourseSidebar({ currentLesson }: CourseSidebarProps) {
  const t = useT();
  const pathname = usePathname();
  const { collapsed, toggleCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const activeId = resolveActiveId(currentLesson, pathname);
  const aboutActive = pathname === "/about";
  const homeActive = pathname === "/";
  const lessonsIndexActive = pathname === "/lessons";
  const collapseLabel = collapsed
    ? t("nav.expand")
    : t("nav.collapse");

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lesson-nav-toggle fixed left-4 top-4 z-40 rounded-md border border-line bg-surface-solid px-3 py-2 text-sm font-semibold text-ink shadow-[var(--shadow)] lg:hidden"
      >
        {t("nav.lessons")}
      </button>

      {mobileOpen ? (
        <button
          type="button"
          aria-label={t("nav.closeMenuAria")}
          className="fixed inset-0 z-40 bg-ink/25 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-line bg-surface-solid transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${
          collapsed ? "lg:w-20" : "lg:w-72"
        } w-[min(18rem,88vw)]`}
      >
        <div
          className={`mb-6 flex items-start gap-2 pt-6 ${
            collapsed ? "justify-center px-2" : "justify-between px-4"
          }`}
        >
          {!collapsed ? (
            <div className="px-2">
              <Link
                href="/"
                className="font-display text-lg font-bold tracking-tight text-ink"
              >
                {t("nav.brand")}
              </Link>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-ink-soft">
                <Link
                  href="/lessons"
                  className={
                    lessonsIndexActive
                      ? "text-ink"
                      : "hover:text-ink"
                  }
                >
                  {t("nav.lessons")}
                </Link>
              </p>
            </div>
          ) : null}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-2 py-1 text-sm font-semibold text-ink-soft hover:text-ink lg:hidden"
            >
              {t("nav.close")}
            </button>
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={collapseLabel}
              title={collapseLabel}
              className="hidden rounded-md border border-line bg-surface-solid px-2.5 py-1.5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent lg:inline-flex"
            >
              {collapsed ? "»" : "«"}
            </button>
          </div>
        </div>

        <nav
          className={`flex flex-1 flex-col gap-1 overflow-y-auto ${
            collapsed ? "px-2" : "px-4"
          }`}
          aria-label={t("nav.lessons")}
        >
          {VISIBLE_LESSONS.map((lesson, index) => {
            const practice = isPracticeLesson(lesson);
            const firstPractice =
              practice &&
              VISIBLE_LESSONS.slice(0, index).every(
                (item) => !isPracticeLesson(item),
              );
            const active = activeId === lesson.id;
            const prefix = lessonCopyPrefix(lesson);
            const badge =
              lesson.number != null
                ? t(`${prefix}.meta.badge`, { number: lesson.number })
                : t(`${prefix}.meta.badge`);
            const shortTitle = t(`${prefix}.meta.shortTitle`);
            const mark = lessonCollapsedMark(lesson);
            const collapsedLabel =
              lesson.number != null
                ? mark
                : t(`nav.collapsed.${mark}`);
            return (
              <div key={lesson.id} className="contents">
                {firstPractice ? (
                  collapsed ? (
                    <div
                      className="course-nav-practice-rule"
                      role="separator"
                      aria-hidden
                    />
                  ) : (
                    <p className="course-nav-section" role="presentation">
                      {t("nav.practiceSection")}
                    </p>
                  )
                ) : null}
                <Link
                  href={lesson.href}
                  title={shortTitle}
                  className={`rounded-lg transition ${
                    collapsed ? "px-2 py-3 text-center" : "px-3 py-3"
                  } ${
                    active
                      ? "bg-accent-soft text-ink"
                      : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  {collapsed ? (
                    <span
                      className={`font-display text-base font-bold${
                        practice ? " course-nav-practice-mark" : ""
                      }`}
                    >
                      {collapsedLabel}
                    </span>
                  ) : (
                    <>
                      <span
                        className={`block text-[11px] font-semibold uppercase tracking-[0.14em]${
                          practice
                            ? " course-nav-practice-badge"
                            : " text-ink-soft"
                        }`}
                      >
                        {badge}
                      </span>
                      <span className="mt-1 block text-sm font-semibold leading-snug">
                        {shortTitle}
                      </span>
                    </>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {!collapsed ? (
          <div className="mx-4 mt-4 mb-4 flex flex-col gap-2">
            <FeedbackTrigger collapsed={false} />
            <Link
              href="/about"
              className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${
                aboutActive
                  ? "bg-accent-soft text-ink"
                  : "text-ink-soft hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {t("nav.about")}
            </Link>
            <Link
              href="/"
              className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${
                homeActive
                  ? "bg-accent-soft text-ink"
                  : "text-ink-soft hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {t("nav.home")}
            </Link>
            <button
              type="button"
              className="rounded-lg px-3 py-2 text-left text-xs font-medium text-ink-soft transition hover:bg-ink/5 hover:text-ink"
              onClick={openGaConsentBanner}
            >
              {t("nav.cookies")}
            </button>
          </div>
        ) : (
          <div className="mx-2 mt-4 mb-4 flex flex-col gap-2">
            <FeedbackTrigger collapsed />
            <Link
              href="/about"
              title={t("nav.about")}
              className={`rounded-lg px-2 py-3 text-center text-sm font-bold transition ${
                aboutActive
                  ? "bg-accent-soft text-ink"
                  : "text-ink-soft hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {t("nav.aboutShort")}
            </Link>
            <Link
              href="/"
              title={t("nav.home")}
              className={`rounded-lg px-2 py-3 text-center text-sm font-bold transition ${
                homeActive
                  ? "bg-accent-soft text-ink"
                  : "text-ink-soft hover:bg-ink/5 hover:text-ink"
              }`}
            >
              ⌂
            </Link>
            <button
              type="button"
              title={t("nav.cookies")}
              className="rounded-lg px-2 py-2 text-center text-[0.65rem] font-semibold text-ink-soft transition hover:bg-ink/5 hover:text-ink"
              onClick={openGaConsentBanner}
            >
              C
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
