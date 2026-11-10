import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { StatCard } from "@/components/admin/StatCard";
import { BarChart } from "@/components/admin/charts/BarChart";
import { DayVisitorTable } from "@/components/admin/DayVisitorTable";
import { fetchAdminDayDetail } from "@/lib/analytics/admin-days";
import { formatDuration } from "@/lib/analytics/admin-stats";
import {
  formatMadridDayLabel,
  isMadridDayKey,
  todayMadridDayKey,
} from "@/lib/analytics/admin-data";
import { ADMIN_DASHBOARD_PATH } from "@/lib/analytics/admin-paths";

export const dynamic = "force-dynamic";

type DayPageProps = {
  params: Promise<{ day: string }>;
};

export async function generateMetadata({ params }: DayPageProps): Promise<Metadata> {
  const { day } = await params;
  return {
    title: `${isMadridDayKey(day) ? formatMadridDayLabel(day) : "Day"} · Days · Analytics · What is AI`,
    robots: { index: false, follow: false },
  };
}

export default async function AnalyticsDayPage({ params }: DayPageProps) {
  const { day } = await params;
  if (!isMadridDayKey(day)) notFound();

  const data = await fetchAdminDayDetail(day);

  if (!data) {
    return (
      <main className="admin-shell min-h-screen px-5 py-16 sm:px-8">
        <div className="admin-panel mx-auto max-w-3xl p-8 text-sm text-ink-soft">
          Could not load analytics.
        </div>
      </main>
    );
  }

  const isToday = day === todayMadridDayKey();
  const lessonBars = data.lessons.map((lesson) => ({
    label: lesson.title,
    value: lesson.uniqueVisitors,
    color: "#0f766e",
  }));

  return (
    <AdminShell
      title={formatMadridDayLabel(day)}
      subtitle={`${isToday ? "Today · " : ""}Europe/Madrid · first-time = new browser ID · stay = sessions that started this day`}
    >
      <p className="mb-6">
        <Link href={`${ADMIN_DASHBOARD_PATH}/days`} className="admin-link-btn">
          ← All days
        </Link>
      </p>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Visitors" value={data.summary.visitors} hint="Distinct browsers this day" />
        <StatCard label="First-time" value={data.summary.firstTime} hint="Never seen before" />
        <StatCard label="Returning" value={data.summary.returning} />
        <StatCard
          label="Median stay"
          value={formatDuration(data.summary.medianStaySec)}
          hint={
            data.summary.avgStaySec != null
              ? `avg ${formatDuration(data.summary.avgStaySec)}`
              : undefined
          }
        />
        <StatCard label="Lessons opened" value={data.summary.lessonOpens} />
      </section>

      <section className="admin-panel admin-chart-panel mt-8 p-6">
        <h2 className="font-display text-lg font-bold text-ink">Lessons opened this day</h2>
        <p className="mt-1 text-sm text-ink-soft">Unique visitors who started each lesson</p>
        <div className="mt-4">
          <BarChart bars={lessonBars} horizontal />
        </div>
        {data.lessons.length > 0 ? (
          <table className="admin-table mt-4 border-t border-[var(--line)]">
            <thead>
              <tr>
                <th>Lesson</th>
                <th>Unique visitors</th>
                <th>Opens</th>
              </tr>
            </thead>
            <tbody>
              {data.lessons.map((lesson) => (
                <tr key={lesson.lessonId}>
                  <td>{lesson.title}</td>
                  <td>{lesson.uniqueVisitors}</td>
                  <td>{lesson.opens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </section>

      <section className="admin-panel mt-8 overflow-x-auto">
        <h2 className="font-display px-6 pt-6 text-lg font-bold text-ink">Visitors this day</h2>
        <p className="px-6 pt-1 text-sm text-ink-soft">
          One row per browser. Stay is the sum of sessions that started this day.
        </p>
        <DayVisitorTable rows={data.visitors} />
      </section>
    </AdminShell>
  );
}
