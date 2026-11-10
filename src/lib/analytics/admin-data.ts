import { getAdminSupabase } from "@/lib/analytics/admin-client";
import type { SupabaseClient } from "@supabase/supabase-js";

export const ADMIN_REPORT_DAYS = 90;

export type RawAttempt = {
  lesson_id: string;
  completion_status: string;
  duration_seconds: number | null;
  started_at: string;
  last_seen_at: string;
  user_id: string;
  attempt_id: string;
};

export type RawAnswer = {
  lesson_id: string;
  question_id: string;
  selected_option_id: string;
  is_correct: boolean | null;
  answered_at: string;
  user_id: string;
};

export type RawSession = {
  session_id: string;
  user_id: string;
  started_at: string;
  last_seen_at: string;
  ended_at: string | null;
};

export type RawUser = {
  user_id: string;
  created_at: string;
};

export type RawFeedback = {
  feedback_id: string;
  user_id: string;
  kind: "feedback" | "request";
  message: string;
  page_path: string | null;
  lesson_id: string | null;
  created_at: string;
};

const PAGE_SIZE = 1000;

export function reportWindowStart(days = ADMIN_REPORT_DAYS): string {
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - days);
  return start.toISOString();
}

async function fetchAllRows<T>(
  supabase: SupabaseClient,
  table: string,
  select: string,
  sinceIso?: string,
  dateColumn?: string,
): Promise<T[]> {
  const rows: T[] = [];
  let from = 0;

  while (true) {
    let query = supabase.from(table).select(select).order(dateColumn ?? "created_at", {
      ascending: true,
    });

    if (sinceIso && dateColumn) {
      query = query.gte(dateColumn, sinceIso);
    }

    const { data, error } = await query.range(from, from + PAGE_SIZE - 1);
    if (error) throw error;

    const page = (data ?? []) as T[];
    rows.push(...page);

    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}

export async function fetchRawAnalytics(sinceIso = reportWindowStart()) {
  const supabase = getAdminSupabase();
  if (!supabase) return null;

  try {
    const [users, attempts, answers, sessions] = await Promise.all([
      fetchAllRows<RawUser>(supabase, "anonymous_users", "user_id, created_at"),
      fetchAllRows<RawAttempt>(
        supabase,
        "lesson_attempts",
        "attempt_id, user_id, lesson_id, completion_status, duration_seconds, started_at, last_seen_at",
        sinceIso,
        "started_at",
      ),
      fetchAllRows<RawAnswer>(
        supabase,
        "question_answers",
        "user_id, lesson_id, question_id, selected_option_id, is_correct, answered_at",
        sinceIso,
        "answered_at",
      ),
      fetchAllRows<RawSession>(
        supabase,
        "learning_sessions",
        "session_id, user_id, started_at, last_seen_at, ended_at",
        sinceIso,
        "started_at",
      ),
    ]);

    return { users, attempts, answers, sessions, sinceIso };
  } catch {
    return null;
  }
}

export async function fetchRawFeedback() {
  const supabase = getAdminSupabase();
  if (!supabase) return null;

  try {
    const rows = await fetchAllRows<RawFeedback>(
      supabase,
      "user_feedback",
      "feedback_id, user_id, kind, message, page_path, lesson_id, created_at",
    );
    return rows.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  } catch {
    return null;
  }
}

export function madridDayKey(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
  }).format(new Date(iso));
}

export function todayMadridDayKey(): string {
  return madridDayKey(new Date().toISOString());
}

export function isMadridDayKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function formatMadridDayLabel(dayKey: string): string {
  const [year, month, day] = dayKey.split("-").map(Number);
  if (!year || !month || !day) return dayKey;
  const noonUtc = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(noonUtc);
}

export function formatMadridClock(iso: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function recentMadridDayKeys(count = ADMIN_REPORT_DAYS): string[] {
  const keys: string[] = [];
  const now = Date.now();

  for (let i = count - 1; i >= 0; i--) {
    keys.push(madridDayKey(new Date(now - i * 86_400_000).toISOString()));
  }

  return keys;
}

export function truncateId(id: string): string {
  return id.slice(0, 8);
}
