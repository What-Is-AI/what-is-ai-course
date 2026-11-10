import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/AdminShell";
import { FeedbackTable } from "@/components/admin/FeedbackTable";
import { fetchAdminFeedback } from "@/lib/analytics/admin-feedback";

export const metadata: Metadata = {
  title: "Feedback · Analytics · What is AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AnalyticsFeedbackPage() {
  const rows = await fetchAdminFeedback();

  if (!rows) {
    return (
      <main className="admin-shell min-h-screen px-5 py-16 sm:px-8">
        <div className="admin-panel mx-auto max-w-3xl p-8 text-sm text-ink-soft">
          Could not load feedback.
        </div>
      </main>
    );
  }

  return (
    <AdminShell
      title="Feedback & requests"
      subtitle="Anonymous notes from learners · Madrid time · newest first"
    >
      <section className="admin-panel overflow-x-auto p-6">
        <FeedbackTable rows={rows} />
      </section>
    </AdminShell>
  );
}
