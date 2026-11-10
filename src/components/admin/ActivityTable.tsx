import { formatDuration, formatMadridTime, type AdminActivityRow } from "@/lib/analytics/admin-stats";

export function ActivityTable({
  rows,
  showUser = false,
}: {
  rows: AdminActivityRow[];
  showUser?: boolean;
}) {
  const colSpan = showUser ? 5 : 4;

  return (
    <table className="admin-table mt-4">
      <thead>
        <tr>
          <th>When</th>
          {showUser ? <th>Visitor</th> : null}
          <th>Lesson</th>
          <th>Duration</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={colSpan} className="text-ink-soft">
              No attempts yet.
            </td>
          </tr>
        ) : (
          rows.map((row, i) => (
            <tr key={`${row.startedAt}-${row.lessonId}-${i}`}>
              <td className="whitespace-nowrap text-sm">{formatMadridTime(row.startedAt)}</td>
              {showUser ? <td className="font-mono text-xs">{row.userId}</td> : null}
              <td>{row.title}</td>
              <td>{formatDuration(row.durationSec)}</td>
              <td>
                <span className={`admin-pill admin-pill-${row.status}`}>{row.status}</span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
