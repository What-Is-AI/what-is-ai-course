import Link from "next/link";

import { formatDuration } from "@/lib/analytics/admin-stats";
import { formatMadridDayLabel, todayMadridDayKey } from "@/lib/analytics/admin-data";
import { ADMIN_DASHBOARD_PATH } from "@/lib/analytics/admin-paths";
import type { AdminDaySummary } from "@/lib/analytics/admin-days";

export function DaysTable({ rows }: { rows: AdminDaySummary[] }) {
  const today = todayMadridDayKey();

  return (
    <table className="admin-table mt-4">
      <thead>
        <tr>
          <th>Day</th>
          <th>Visitors</th>
          <th>First-time</th>
          <th>Returning</th>
          <th>Median stay</th>
          <th>Lessons opened</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-ink-soft">
              No days in this window.
            </td>
          </tr>
        ) : (
          rows.map((row) => {
            const href = `${ADMIN_DASHBOARD_PATH}/days/${row.day}`;
            const isToday = row.day === today;
            return (
              <tr key={row.day} className={row.visitors === 0 ? "admin-row-muted" : undefined}>
                <td>
                  <Link href={href} className="admin-day-link">
                    {formatMadridDayLabel(row.day)}
                  </Link>
                  {isToday ? <span className="admin-pill admin-pill-today">Today</span> : null}
                </td>
                <td>{row.visitors}</td>
                <td>{row.firstTime}</td>
                <td>{row.returning}</td>
                <td>{formatDuration(row.medianStaySec)}</td>
                <td>{row.lessonOpens}</td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
