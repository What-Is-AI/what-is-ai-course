import type { Metadata } from "next";
import { Lesson1Experience } from "@/components/lesson1/Lesson1Experience";
import { LessonSeoPage } from "@/components/seo/LessonSeoPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("lessons/1");

export default function Lesson1Page() {
  return (
    <LessonSeoPage pageKey="lessons/1">
      <Lesson1Experience />
    </LessonSeoPage>
  );
}
