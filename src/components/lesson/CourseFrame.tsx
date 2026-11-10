"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SiteFooter } from "@/components/SiteFooter";
import { useDeferSiteFooter } from "@/components/SiteFooterPlacement";
import { CourseSidebar } from "@/components/lesson/CourseSidebar";
import {
  SidebarProvider,
  useOptionalSidebar,
  useSidebar,
} from "@/components/lesson/SidebarContext";

function CourseFrameInner({
  children,
  currentLesson,
}: {
  children: React.ReactNode;
  currentLesson?: number | string;
}) {
  const { collapsed } = useSidebar();
  const deferFooter = useDeferSiteFooter();

  return (
    <div
      className={`relative z-10 flex min-h-screen flex-col ${
        collapsed ? "lg:pl-20" : "lg:pl-72"
      }`}
    >
      <CourseSidebar currentLesson={currentLesson} />
      <div className="lang-switch-slot">
        <LanguageSwitcher />
      </div>
      {children}
      {deferFooter ? null : <SiteFooter />}
    </div>
  );
}

export function CourseFrame({
  children,
  currentLesson,
}: {
  children: React.ReactNode;
  currentLesson?: number | string;
}) {
  const existing = useOptionalSidebar();
  const inner = (
    <CourseFrameInner currentLesson={currentLesson}>{children}</CourseFrameInner>
  );
  if (existing) return inner;
  return <SidebarProvider>{inner}</SidebarProvider>;
}
