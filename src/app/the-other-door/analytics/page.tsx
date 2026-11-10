import type { Metadata } from "next";
import Link from "next/link";

import { AdminShell } from "@/components/admin/AdminShell";
import { StatCard } from "@/components/admin/StatCard";
import { BarChart } from "@/components/admin/charts/BarChart";
import { DonutChart } from "@/components/admin/charts/DonutChart";
import { LineChart } from "@/components/admin/charts/LineChart";
import { ActivityTable } from "@/components/admin/ActivityTable";
import { DaysTable } from "@/components/admin/DaysTable";
import { fetchAdminDashboard, formatDuration } from "@/lib/analytics/admin-stats";
import { ADMIN_REPORT_DAYS, todayMadridDayKey } from "@/lib/analytics/admin-data";
import { ADMIN_DASHBOARD_PATH } from "@/lib/analytics/admin-paths";

export const metadata: Metadata = {
  title: "Overview · Analytics · What is AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AnalyticsOverviewPage() {
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

  const todayKey = todayMadridDayKey();
  const today = data.daySummaries.find((row) => row.day === todayKey);

  return (
    <AdminShell
      title="Overview"
      subtitle={`Last ${ADMIN_REPORT_DAYS} days · Europe/Madrid · anonymous aggregates only`}
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Unique browsers" value={data.uniqueUsers} />
        <StatCard label="Sessions" value={data.totalSessions} />
        <StatCard label="Repeat visitors" value={data.repeatUsers} hint="2+ sessions" />
        <StatCard label="Lesson opens" value={data.totalAttempts} />
        <StatCard label="Answers logged" value={data.totalAnswers} />
      </section>

      <section className="admin-today mt-8">
        <div className="admin-today-head">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Today</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Distinct visitors this calendar day — not mixed with the 30-day totals above
            </p>
          </div>
          <Link href={`${ADMIN_DASHBOARD_PATH}/days/${todayKey}`} className="admin-link-btn">
            Open today →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Visitors" value={today?.visitors ?? 0} hint="Distinct browsers today" />
          <StatCard label="First-time" value={today?.firstTime ?? 0} hint="New browser IDs" />
          <StatCard label="Median stay" value={formatDuration(today?.medianStaySec ?? null)} />
          <StatCard label="Lessons opened" value={today?.lessonOpens ?? 0} />
        </div>
      </section>

      <section className="admin-panel admin-chart-panel mt-8 p-6">
        <h2 className="font-display text-lg font-bold text-ink">Daily visitors</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Unique browsers per day, split into first-time and returning
        </p>
        <div className="mt-4">
          <LineChart
            data={data.daySummaries.map((row) => ({
              label: row.day,
              visitors: row.visitors,
              firstTime: row.firstTime,
              returning: row.returning,
            }))}
            series={[
              { key: "visitors", label: "Visitors", color: "#0f766e" },
              { key: "firstTime", label: "First-time", color: "#6366f1" },
              { key: "returning", label: "Returning", color: "#d97706" },
            ]}
          />
        </div>
      </section>

      <section className="admin-panel mt-8 overflow-x-auto">
        <div className="admin-today-head px-6 pt-6">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Recent days</h2>
            <p className="mt-1 text-sm text-ink-soft">Open a day to see who came, how long, and which lessons</p>
          </div>
          <Link href={`${ADMIN_DASHBOARD_PATH}/days`} className="admin-link-btn">
            All days →
          </Link>
        </div>
        <DaysTable rows={[...data.daySummaries].reverse().slice(0, 7)} />
      </section>

      <section className="admin-panel admin-chart-panel mt-8 p-6">
        <h2 className="font-display text-lg font-bold text-ink">Activity trend</h2>
        <p className="mt-1 text-sm text-ink-soft">Daily sessions, lesson opens, and answers</p>
        <div className="mt-4">
          <LineChart
            data={data.trend}
            series={[
              { key: "sessions", label: "Sessions", color: "#6366f1" },
              { key: "attempts", label: "Lesson opens", color: "#0f766e" },
              { key: "answers", label: "Answers", color: "#d97706" },
            ]}
          />
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="admin-panel admin-chart-panel p-6">
          <h2 className="font-display text-lg font-bold text-ink">Completion status</h2>
          <p className="mt-1 text-sm text-ink-soft">All lesson attempts</p>
          <div className="mt-4">
            <DonutChart slices={data.statusSlices} />
          </div>
        </section>

        <section className="admin-panel admin-chart-panel p-6">
          <h2 className="font-display text-lg font-bold text-ink">Return visits</h2>
          <p className="mt-1 text-sm text-ink-soft">Sessions per anonymous visitor</p>
          <div className="mt-4">
            <BarChart bars={data.sessionHistogram} />
          </div>
        </section>
      </div>

      <section className="admin-panel mt-8 overflow-x-auto">
        <h2 className="font-display px-6 pt-6 text-lg font-bold text-ink">Recent activity</h2>
        <ActivityTable rows={data.recentAttempts} />
      </section>
    </AdminShell>
  );
}
