import type { Metadata } from "next";
import { Lesson8Experience } from "@/components/lesson8/Lesson8Experience";
import { LessonSeoPage } from "@/components/seo/LessonSeoPage";
import { pageMetadata } from "@/lib/seo";

/**
 * Lesson 8 — Transformers (The Reading Room).
 */
export const metadata: Metadata = pageMetadata("lessons/8");

export default function Lesson8Page() {
  return (
    <LessonSeoPage pageKey="lessons/8">
      <Lesson8Experience />
    </LessonSeoPage>
  );
}
