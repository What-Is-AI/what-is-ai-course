import { formatDuration } from "@/lib/analytics/admin-stats";
import { formatMadridClock } from "@/lib/analytics/admin-data";
import type { AdminDayVisitor } from "@/lib/analytics/admin-days";

export function DayVisitorTable({ rows }: { rows: AdminDayVisitor[] }) {
  return (
    <table className="admin-table mt-4">
      <thead>
        <tr>
          <th>Visitor</th>
          <th>Kind</th>
          <th>Arrived</th>
          <th>Stay</th>
          <th>Lessons opened</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-ink-soft">
              No visitors this day.
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr key={`${row.userId}-${row.arrivedAt}`}>
              <td className="font-mono text-sm">{row.userId}</td>
              <td>
                <span className={`admin-pill ${row.firstTime ? "admin-pill-first" : "admin-pill-returning"}`}>
                  {row.firstTime ? "First-time" : "Returning"}
                </span>
              </td>
              <td className="whitespace-nowrap text-sm">{formatMadridClock(row.arrivedAt)}</td>
              <td>
                {formatDuration(row.staySec)}
                {row.sessionCount > 1 ? (
                  <span className="text-ink-soft"> · {row.sessionCount} sessions</span>
                ) : null}
              </td>
              <td>
                {row.lessons.length === 0 ? (
                  <span className="text-ink-soft">None</span>
                ) : (
                  <ul className="admin-lesson-chips">
                    {row.lessons.map((lesson) => (
                      <li key={`${row.userId}-${lesson.lessonId}`} className="admin-lesson-chip">
                        <span>{lesson.title}</span>
                        <span className={`admin-pill admin-pill-${lesson.status}`}>{lesson.status}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
