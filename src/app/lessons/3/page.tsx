import type { Metadata } from "next";
import { Lesson3Experience } from "@/components/lesson3/Lesson3Experience";
import { LessonSeoPage } from "@/components/seo/LessonSeoPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("lessons/3");

export default function Lesson3Page() {
  return (
    <LessonSeoPage pageKey="lessons/3">
      <Lesson3Experience />
    </LessonSeoPage>
  );
}
