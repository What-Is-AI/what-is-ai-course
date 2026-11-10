"use client";

import type { ReactNode } from "react";
import { LessonSeoArticle } from "@/components/seo/LessonSeoArticle";
import { SiteFooter } from "@/components/SiteFooter";
import { DeferSiteFooter } from "@/components/SiteFooterPlacement";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/lesson/SidebarContext";
import type { SeoPageKey } from "@/lib/seo";

function SidebarAlignedTail({
  pageKey,
}: {
  pageKey: SeoPageKey;
}) {
  const { collapsed } = useSidebar();

  return (
    <div className={collapsed ? "lg:pl-20" : "lg:pl-72"}>
      <LessonSeoArticle pageKey={pageKey} />
      <SiteFooter />
    </div>
  );
}

/** Shared sidebar + deferred footer after the SEO spine. */
export function LessonSeoShell({
  pageKey,
  children,
}: {
  pageKey: SeoPageKey;
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <DeferSiteFooter>
        {children}
        <SidebarAlignedTail pageKey={pageKey} />
      </DeferSiteFooter>
    </SidebarProvider>
  );
}
