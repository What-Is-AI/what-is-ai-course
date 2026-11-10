import type { Metadata } from "next";
import { Lesson4Experience } from "@/components/lesson4/Lesson4Experience";
import { LessonSeoPage } from "@/components/seo/LessonSeoPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("lessons/4");

export default function Lesson4Page() {
  return (
    <LessonSeoPage pageKey="lessons/4">
      <Lesson4Experience />
    </LessonSeoPage>
  );
}
