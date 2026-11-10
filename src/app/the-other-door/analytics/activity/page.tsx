import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/AdminShell";
import { ActivityTable } from "@/components/admin/ActivityTable";
import { fetchAdminDashboard } from "@/lib/analytics/admin-stats";

export const metadata: Metadata = {
  title: "Activity · Analytics · What is AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AnalyticsActivityPage() {
  const data = await fetchAdminDashboard();

  if (!data) {
    return (
      <main className="admin-shell min-h-screen px-5 py-16 sm:px-8">
        <div className="admin-panel mx-auto max-w-3xl p-8 text-sm text-ink-soft">
          Could not load analytics.
        </div>
      </main>
    );
  }

  return (
    <AdminShell
      title="Activity log"
      subtitle="Latest 50 lesson attempts · Madrid time"
    >
      <section className="admin-panel overflow-x-auto">
        <ActivityTable rows={data.activityLog} showUser />
      </section>
    </AdminShell>
  );
}
