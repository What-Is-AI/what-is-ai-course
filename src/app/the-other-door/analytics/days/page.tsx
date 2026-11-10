import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/AdminShell";
import { DaysTable } from "@/components/admin/DaysTable";
import { fetchAdminDashboard } from "@/lib/analytics/admin-stats";
import { ADMIN_REPORT_DAYS } from "@/lib/analytics/admin-data";

export const metadata: Metadata = {
  title: "Days · Analytics · What is AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AnalyticsDaysPage() {
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

  const rows = [...data.daySummaries].reverse();

  return (
    <AdminShell
      title="Days"
      subtitle={`Last ${ADMIN_REPORT_DAYS} days · Europe/Madrid · one row per calendar day`}
    >
      <section className="admin-panel overflow-x-auto">
        <h2 className="font-display px-6 pt-6 text-lg font-bold text-ink">Visitors by day</h2>
        <p className="px-6 pt-1 text-sm text-ink-soft">
          First-time is a new browser ID. Stay is session time that started that day. Open a day for
          the visitor list.
        </p>
        <DaysTable rows={rows} />
      </section>
    </AdminShell>
  );
}
