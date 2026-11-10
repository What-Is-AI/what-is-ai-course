import { formatMadridTime, type AdminFeedbackRow } from "@/lib/analytics/admin-feedback";

export function FeedbackTable({ rows }: { rows: AdminFeedbackRow[] }) {
  return (
    <table className="admin-table mt-4">
      <thead>
        <tr>
          <th>When</th>
          <th>Type</th>
          <th>Visitor</th>
          <th>Context</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-ink-soft">
              No feedback yet.
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr key={row.id}>
              <td className="whitespace-nowrap align-top text-sm">
                {formatMadridTime(row.createdAt)}
              </td>
              <td className="align-top">
                <span className={`admin-pill admin-pill-${row.kind}`}>{row.kind}</span>
              </td>
              <td className="align-top font-mono text-xs">{row.userId}</td>
              <td className="align-top text-sm text-ink-soft">
                {row.lessonTitle ? (
                  <span className="block text-ink">{row.lessonTitle}</span>
                ) : null}
                {row.pagePath ? <span className="block">{row.pagePath}</span> : "—"}
              </td>
              <td className="max-w-xl whitespace-pre-wrap align-top text-sm">{row.message}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
