import type { Metadata } from "next";
import { Lesson5Experience } from "@/components/lesson5/Lesson5Experience";
import { LessonSeoPage } from "@/components/seo/LessonSeoPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("lessons/5");

export default function Lesson5Page() {
  return (
    <LessonSeoPage pageKey="lessons/5">
      <Lesson5Experience />
    </LessonSeoPage>
  );
}
