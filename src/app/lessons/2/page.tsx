import type { Metadata } from "next";
import { Lesson2Experience } from "@/components/lesson2/Lesson2Experience";
import { LessonSeoPage } from "@/components/seo/LessonSeoPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("lessons/2");

export default function Lesson2Page() {
  return (
    <LessonSeoPage pageKey="lessons/2">
      <Lesson2Experience />
    </LessonSeoPage>
  );
}
