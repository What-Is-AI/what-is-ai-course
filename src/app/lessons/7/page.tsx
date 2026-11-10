import type { Metadata } from "next";
import { Lesson7Experience } from "@/components/lesson7/Lesson7Experience";
import { LessonSeoPage } from "@/components/seo/LessonSeoPage";
import { pageMetadata } from "@/lib/seo";

/**
 * Lesson 7 — From Features to Representations (The Listening Room).
 */
export const metadata: Metadata = pageMetadata("lessons/7");

export default function Lesson7Page() {
  return (
    <LessonSeoPage pageKey="lessons/7">
      <Lesson7Experience />
    </LessonSeoPage>
  );
}
