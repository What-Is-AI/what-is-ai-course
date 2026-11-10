import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/AdminShell";
import { BarChart } from "@/components/admin/charts/BarChart";
import { fetchAdminDashboard, formatMadridTime } from "@/lib/analytics/admin-stats";

export const metadata: Metadata = {
  title: "Visitors · Analytics · What is AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AnalyticsVisitorsPage() {
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

  const topBySessions = [...data.visitors]
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 10)
    .map((v) => ({
      label: v.userId,
      value: v.sessions,
      color: "#6366f1",
    }));

  return (
    <AdminShell
      title="Visitors"
      subtitle="Anonymous browser IDs — truncated for display"
    >
      <section className="admin-panel admin-chart-panel p-6">
        <h2 className="font-display text-lg font-bold text-ink">Top visitors by sessions</h2>
        <div className="mt-4">
          <BarChart bars={topBySessions} horizontal />
        </div>
      </section>

      <section className="admin-panel mt-8 overflow-x-auto">
        <h2 className="font-display px-6 pt-6 text-lg font-bold text-ink">All visitors</h2>
        <table className="admin-table mt-4">
          <thead>
            <tr>
              <th>Visitor ID</th>
              <th>Sessions</th>
              <th>Lesson opens</th>
              <th>Answers</th>
              <th>Last seen</th>
            </tr>
          </thead>
          <tbody>
            {data.visitors.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-ink-soft">
                  No visitors yet.
                </td>
              </tr>
            ) : (
              data.visitors.map((row) => (
                <tr key={row.userId}>
                  <td className="font-mono text-sm">{row.userId}</td>
                  <td>{row.sessions}</td>
                  <td>{row.attempts}</td>
                  <td>{row.answers}</td>
                  <td className="whitespace-nowrap text-sm">{formatMadridTime(row.lastSeen)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </AdminShell>
  );
}
