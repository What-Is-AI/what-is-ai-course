import type { Metadata } from "next";
import { DelegateRealWorkExperience } from "@/components/delegate-real-work/DelegateRealWorkExperience";
import { LessonSeoPage } from "@/components/seo/LessonSeoPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("lessons/delegate-real-work");

export default function DelegateRealWorkPage() {
  return (
    <LessonSeoPage pageKey="lessons/delegate-real-work">
      <DelegateRealWorkExperience />
    </LessonSeoPage>
  );
}
