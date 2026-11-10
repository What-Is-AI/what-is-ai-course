import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { LessonSeoShell } from "@/components/seo/LessonSeoShell";
import type { SeoPageKey } from "@/lib/seo";
import { isCourseIndexKey, lessonPageJsonLd } from "@/lib/seo-json-ld";

type LessonSeoPageProps = {
  pageKey: SeoPageKey;
  children: ReactNode;
};

/**
 * Wraps a lesson experience with a crawlable textual spine + lean JSON-LD
 * (Course, BreadcrumbList, WebPage). Spine is always in the initial HTML.
 * Footer sits after the spine, padded to clear the course sidebar.
 */
export function LessonSeoPage({ pageKey, children }: LessonSeoPageProps) {
  return (
    <>
      {isCourseIndexKey(pageKey)
        ? lessonPageJsonLd(pageKey).map((data, i) => (
            <JsonLd key={i} data={data} />
          ))
        : null}
      <LessonSeoShell pageKey={pageKey}>{children}</LessonSeoShell>
    </>
  );
}
