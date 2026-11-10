"use client";

import Link from "next/link";
import { CourseFrame } from "@/components/lesson/CourseFrame";
import { useT } from "@/i18n/LocaleProvider";

export function WhenItGoesLookingComingSoon() {
  const t = useT();

  return (
    <CourseFrame>
      <div className="connected-office relative min-h-screen overflow-hidden">
        <div aria-hidden className="connected-office-wash" />
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-5 py-16 sm:px-8">
          <p className="connected-eyebrow">
            {t("whenItGoesLooking.eyebrow")}
          </p>
          <p className="connected-plaque mt-6">
            {t("whenItGoesLooking.plaque")}
          </p>
          <h1 className="connected-title mt-3">
            {t("whenItGoesLooking.title")}
          </h1>
          <p className="connected-body mt-4 max-w-xl">
            {t("whenItGoesLooking.body")}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/lessons/just-because-it-can" className="connected-btn">
              {t("whenItGoesLooking.backToPrevious")}
            </Link>
            <Link href="/" className="connected-btn-secondary">
              {t("whenItGoesLooking.backHome")}
            </Link>
          </div>
        </div>
      </div>
    </CourseFrame>
  );
}
