import { LESSONS } from "@/lib/lessons";
import {
  fetchRawFeedback,
  truncateId,
  type RawFeedback,
} from "@/lib/analytics/admin-data";
import { formatMadridTime } from "@/lib/analytics/admin-stats";

const lessonTitle = new Map<string, string>(
  LESSONS.map((l) => [l.id, l.shortTitle]),
);

export type AdminFeedbackRow = {
  id: string;
  userId: string;
  kind: "feedback" | "request";
  message: string;
  pagePath: string | null;
  lessonTitle: string | null;
  createdAt: string;
};

function mapFeedback(row: RawFeedback): AdminFeedbackRow {
  return {
    id: row.feedback_id,
    userId: truncateId(row.user_id),
    kind: row.kind,
    message: row.message,
    pagePath: row.page_path,
    lessonTitle: row.lesson_id ? (lessonTitle.get(row.lesson_id) ?? row.lesson_id) : null,
    createdAt: row.created_at,
  };
}

export async function fetchAdminFeedback(): Promise<AdminFeedbackRow[] | null> {
  const rows = await fetchRawFeedback();
  if (!rows) return null;
  return rows.map(mapFeedback);
}

export { formatMadridTime };
