import type { Metadata } from "next";
import { WorkingWithLlmsExperience } from "@/components/working-with-llms/WorkingWithLlmsExperience";
import { LessonSeoPage } from "@/components/seo/LessonSeoPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("lessons/working-with-llms");

export default function WorkingWithLlmsPage() {
  return (
    <LessonSeoPage pageKey="lessons/working-with-llms">
      <WorkingWithLlmsExperience />
    </LessonSeoPage>
  );
}
