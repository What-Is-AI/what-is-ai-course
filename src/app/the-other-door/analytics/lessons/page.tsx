import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/AdminShell";
import { BarChart } from "@/components/admin/charts/BarChart";
import { fetchAdminDashboard, formatDuration } from "@/lib/analytics/admin-stats";

export const metadata: Metadata = {
  title: "Lessons · Analytics · What is AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AnalyticsLessonsPage() {
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

  const completionBars = data.lessons.map((l) => ({
    label: l.title,
    value: l.completions,
    color: "#0f766e",
  }));

  const startsBars = data.lessons.map((l) => ({
    label: l.title,
    value: l.starts,
    color: "#6366f1",
  }));

  return (
    <AdminShell
      title="Lessons"
      subtitle="Starts, completions, and time on task (avg/median among finished attempts)"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="admin-panel admin-chart-panel p-6">
          <h2 className="font-display text-lg font-bold text-ink">Lesson starts</h2>
          <BarChart bars={startsBars} horizontal />
        </section>
        <section className="admin-panel admin-chart-panel p-6">
          <h2 className="font-display text-lg font-bold text-ink">Completions</h2>
          <BarChart bars={completionBars} horizontal />
        </section>
      </div>

      <section className="admin-panel mt-8 overflow-x-auto">
        <h2 className="font-display px-6 pt-6 text-lg font-bold text-ink">Full breakdown</h2>
        <table className="admin-table mt-4">
          <thead>
            <tr>
              <th>Lesson</th>
              <th>Starts</th>
              <th>Completed</th>
              <th>Rate</th>
              <th>Abandoned</th>
              <th>In progress</th>
              <th>Avg time</th>
              <th>Median</th>
            </tr>
          </thead>
          <tbody>
            {data.lessons.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-ink-soft">
                  No lesson activity yet.
                </td>
              </tr>
            ) : (
              data.lessons.map((row) => (
                <tr key={row.lessonId}>
                  <td>
                    <span className="font-medium text-ink">{row.title}</span>
                    <span className="ml-2 text-xs text-ink-soft">{row.lessonId}</span>
                  </td>
                  <td>{row.starts}</td>
                  <td>{row.completions}</td>
                  <td>{row.completionRate != null ? `${row.completionRate}%` : "—"}</td>
                  <td>
                    {row.abandoned}
                    {row.abandonRate != null ? (
                      <span className="text-ink-soft"> ({row.abandonRate}%)</span>
                    ) : null}
                  </td>
                  <td>{row.inProgress}</td>
                  <td>{formatDuration(row.avgDurationSec)}</td>
                  <td>{formatDuration(row.medianDurationSec)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </AdminShell>
  );
}
