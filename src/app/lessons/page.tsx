import type { Metadata } from "next";
import { LessonsIndex } from "@/components/lessons/LessonsIndex";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { lessonsIndexJsonLd } from "@/lib/seo-json-ld";

export const metadata: Metadata = pageMetadata("lessons");

/**
 * Crawlable course index — plain HTML links to every indexed lesson.
 * Structured data: ItemList (Course), BreadcrumbList, CollectionPage.
 * Visible titles follow the active UI locale via LessonsIndex.
 */
export default function LessonsIndexPage() {
  return (
    <>
      {lessonsIndexJsonLd().map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <LessonsIndex />
    </>
  );
}
