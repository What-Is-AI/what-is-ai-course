import type { Metadata } from "next";
import { Lesson6Experience } from "@/components/lesson6/Lesson6Experience";
import { LessonSeoPage } from "@/components/seo/LessonSeoPage";
import { pageMetadata } from "@/lib/seo";

/**
 * Lesson 6 — Deep Learning (The Depth).
 */
export const metadata: Metadata = pageMetadata("lessons/6");

export default function Lesson6Page() {
  return (
    <LessonSeoPage pageKey="lessons/6">
      <Lesson6Experience />
    </LessonSeoPage>
  );
}
