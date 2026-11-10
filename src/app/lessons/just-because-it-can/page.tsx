import type { Metadata } from "next";
import { Practical1Experience } from "@/components/practical1/Practical1Experience";
import { LessonSeoPage } from "@/components/seo/LessonSeoPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("lessons/just-because-it-can");

export default function JustBecauseItCanPage() {
  return (
    <LessonSeoPage pageKey="lessons/just-because-it-can">
      <Practical1Experience />
    </LessonSeoPage>
  );
}
