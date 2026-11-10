import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { OtherDoorLoginForm } from "@/app/the-other-door/OtherDoorLoginForm";
import {
  ADMIN_DASHBOARD_PATH,
  isAdminAuthenticated,
  isAdminConfigured,
} from "@/lib/analytics/admin-auth";

export const metadata: Metadata = {
  title: "The other door · What is AI",
  robots: { index: false, follow: false },
};

export default async function OtherDoorPage() {
  if (!isAdminConfigured()) {
    return (
      <main className="admin-shell flex min-h-screen items-center justify-center px-5">
        <div className="admin-panel max-w-md p-8 text-sm text-ink-soft">
          This door is locked.
        </div>
      </main>
    );
  }

  if (await isAdminAuthenticated()) {
    redirect(ADMIN_DASHBOARD_PATH);
  }

  return (
    <main className="admin-shell flex min-h-screen items-center justify-center px-5 py-16">
      <OtherDoorLoginForm />
    </main>
  );
}
