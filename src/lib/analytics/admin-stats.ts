import { ANALYTICS_ABANDON_MS } from "@/lib/analytics/config";
import { LESSONS } from "@/lib/lessons";
import { buildDailyVisitModel, type AdminDaySummary } from "@/lib/analytics/admin-days";
import {
  ADMIN_REPORT_DAYS,
  fetchRawAnalytics,
  madridDayKey,
  recentMadridDayKeys,
  truncateId,
  type RawAttempt,
} from "@/lib/analytics/admin-data";

const lessonTitle = new Map<string, string>(
  LESSONS.map((l) => [l.id, l.shortTitle]),
);

function titleFor(lessonId: string): string {
  return lessonTitle.get(lessonId) ?? lessonId;
}

function pct(n: number, d: number): number | null {
  if (d === 0) return null;
  return Math.round((1000 * n) / d) / 10;
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1]! + sorted[mid]!) / 2)
    : sorted[mid]!;
}

function effectiveAttemptStatus(row: RawAttempt): string {
  if (row.completion_status !== "started") return row.completion_status;
  if (Date.now() - new Date(row.last_seen_at).getTime() > ANALYTICS_ABANDON_MS) {
    return "abandoned";
  }
  return "started";
}

function attemptDuration(row: RawAttempt): number | null {
  if (row.duration_seconds != null) return row.duration_seconds;
  if (!row.last_seen_at) return null;
  return Math.round(
    (new Date(row.last_seen_at).getTime() - new Date(row.started_at).getTime()) / 1000,
  );
}

function maxIso(a: string, b: string): string {
  return a > b ? a : b;
}

export type AdminDashboard = {
  uniqueUsers: number;
  totalSessions: number;
  totalAttempts: number;
  totalAnswers: number;
  repeatUsers: number;
  trend: { label: string; attempts: number; sessions: number; answers: number }[];
  statusSlices: { label: string; value: number; color: string }[];
  lessons: AdminLessonRow[];
  topQuestions: AdminQuestionRow[];
  recentAttempts: AdminActivityRow[];
  allQuestions: AdminQuestionDetail[];
  visitors: AdminVisitorRow[];
  sessionHistogram: { label: string; value: number }[];
  activityLog: AdminActivityRow[];
  daySummaries: AdminDaySummary[];
};

export type AdminLessonRow = {
  lessonId: string;
  title: string;
  starts: number;
  completions: number;
  abandoned: number;
  inProgress: number;
  completionRate: number | null;
  abandonRate: number | null;
  avgDurationSec: number | null;
  medianDurationSec: number | null;
};

export type AdminQuestionRow = {
  lessonId: string;
  questionId: string;
  answers: number;
  correctRate: number | null;
  topOption: string | null;
};

export type AdminQuestionDetail = AdminQuestionRow & {
  options: { id: string; count: number; pct: number }[];
};

export type AdminActivityRow = {
  userId: string;
  lessonId: string;
  title: string;
  startedAt: string;
  durationSec: number | null;
  status: string;
};

export type AdminVisitorRow = {
  userId: string;
  sessions: number;
  attempts: number;
  answers: number;
  lastSeen: string;
};

export async function fetchAdminDashboard(): Promise<AdminDashboard | null> {
  const raw = await fetchRawAnalytics();
  if (!raw) return null;

  const { users, attempts, answers, sessions } = raw;
  const { summaries: daySummaries } = buildDailyVisitModel({ users, sessions, attempts });

  const activeUserIds = new Set<string>();
  for (const s of sessions) activeUserIds.add(s.user_id);
  for (const a of attempts) activeUserIds.add(a.user_id);
  for (const a of answers) activeUserIds.add(a.user_id);

  const sessionsPerUser = new Map<string, number>();
  for (const s of sessions) {
    sessionsPerUser.set(s.user_id, (sessionsPerUser.get(s.user_id) ?? 0) + 1);
  }
  const repeatUsers = [...sessionsPerUser.values()].filter((n) => n > 1).length;

  const statusCounts = { completed: 0, abandoned: 0, started: 0 };
  for (const a of attempts) {
    const status = effectiveAttemptStatus(a);
    if (status === "completed") statusCounts.completed += 1;
    else if (status === "abandoned") statusCounts.abandoned += 1;
    else statusCounts.started += 1;
  }

  const dayMap = new Map<string, { attempts: number; sessions: number; answers: number }>();
  const touch = (day: string, key: "attempts" | "sessions" | "answers") => {
    const b = dayMap.get(day) ?? { attempts: 0, sessions: 0, answers: 0 };
    b[key] += 1;
    dayMap.set(day, b);
  };
  for (const a of attempts) touch(madridDayKey(a.started_at), "attempts");
  for (const s of sessions) touch(madridDayKey(s.started_at), "sessions");
  for (const a of answers) touch(madridDayKey(a.answered_at), "answers");

  const trend = recentMadridDayKeys(ADMIN_REPORT_DAYS).map((label) => ({
    label,
    ...(dayMap.get(label) ?? { attempts: 0, sessions: 0, answers: 0 }),
  }));

  const byLesson = new Map<
    string,
    { starts: number; completions: number; abandoned: number; inProgress: number; durations: number[] }
  >();
  for (const row of attempts) {
    const status = effectiveAttemptStatus(row);
    const b = byLesson.get(row.lesson_id) ?? {
      starts: 0,
      completions: 0,
      abandoned: 0,
      inProgress: 0,
      durations: [],
    };
    b.starts += 1;
    if (status === "completed") b.completions += 1;
    else if (status === "abandoned") b.abandoned += 1;
    else b.inProgress += 1;

    // Time-on-task for finished attempts (completed wall-clock, abandoned via last_seen).
    if (status === "completed" || status === "abandoned") {
      const d = attemptDuration(row);
      if (d != null && d > 0) b.durations.push(d);
    }
    byLesson.set(row.lesson_id, b);
  }

  const lessons: AdminLessonRow[] = [...byLesson.entries()]
    .map(([lessonId, s]) => ({
      lessonId,
      title: titleFor(lessonId),
      starts: s.starts,
      completions: s.completions,
      abandoned: s.abandoned,
      inProgress: s.inProgress,
      completionRate: pct(s.completions, s.starts),
      abandonRate: pct(s.abandoned, s.starts),
      avgDurationSec:
        s.durations.length > 0
          ? Math.round(s.durations.reduce((a, b) => a + b, 0) / s.durations.length)
          : null,
      medianDurationSec: median(s.durations),
    }))
    .sort((a, b) => a.lessonId.localeCompare(b.lessonId, undefined, { numeric: true }));

  const questionMap = new Map<
    string,
    {
      lessonId: string;
      questionId: string;
      answers: number;
      correct: number;
      gradable: number;
      options: Map<string, number>;
    }
  >();
  for (const row of answers) {
    const key = `${row.lesson_id}:${row.question_id}`;
    const b = questionMap.get(key) ?? {
      lessonId: row.lesson_id,
      questionId: row.question_id,
      answers: 0,
      correct: 0,
      gradable: 0,
      options: new Map<string, number>(),
    };
    b.answers += 1;
    if (row.is_correct != null) {
      b.gradable += 1;
      if (row.is_correct) b.correct += 1;
    }
    b.options.set(row.selected_option_id, (b.options.get(row.selected_option_id) ?? 0) + 1);
    questionMap.set(key, b);
  }

  const allQuestions: AdminQuestionDetail[] = [...questionMap.values()]
    .map((q) => {
      const top = [...q.options.entries()].sort((a, b) => b[1] - a[1])[0];
      const options = [...q.options.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([id, count]) => ({
          id,
          count,
          pct: Math.round((1000 * count) / q.answers) / 10,
        }));
      return {
        lessonId: q.lessonId,
        questionId: q.questionId,
        answers: q.answers,
        correctRate: q.gradable > 0 ? pct(q.correct, q.gradable) : null,
        topOption: top?.[0] ?? null,
        options,
      };
    })
    .sort((a, b) => b.answers - a.answers);

  const topQuestions = allQuestions.slice(0, 12).map(({ options: _, ...rest }) => rest);

  const activityLog: AdminActivityRow[] = [...attempts]
    .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
    .map((row) => ({
      userId: truncateId(row.user_id),
      lessonId: row.lesson_id,
      title: titleFor(row.lesson_id),
      startedAt: row.started_at,
      durationSec: attemptDuration(row),
      status: effectiveAttemptStatus(row),
    }));

  const attemptsPerUser = new Map<string, number>();
  const answersPerUser = new Map<string, number>();
  const lastSeen = new Map<string, string>();
  const userCreatedAt = new Map(users.map((u) => [u.user_id, u.created_at]));

  for (const s of sessions) {
    lastSeen.set(s.user_id, maxIso(lastSeen.get(s.user_id) ?? s.last_seen_at, s.last_seen_at));
  }
  for (const a of attempts) {
    attemptsPerUser.set(a.user_id, (attemptsPerUser.get(a.user_id) ?? 0) + 1);
    lastSeen.set(a.user_id, maxIso(lastSeen.get(a.user_id) ?? a.last_seen_at, a.last_seen_at));
  }
  for (const a of answers) {
    answersPerUser.set(a.user_id, (answersPerUser.get(a.user_id) ?? 0) + 1);
    lastSeen.set(a.user_id, maxIso(lastSeen.get(a.user_id) ?? a.answered_at, a.answered_at));
  }

  const visitors: AdminVisitorRow[] = [...activeUserIds]
    .map((userId) => ({
      userId: truncateId(userId),
      sessions: sessionsPerUser.get(userId) ?? 0,
      attempts: attemptsPerUser.get(userId) ?? 0,
      answers: answersPerUser.get(userId) ?? 0,
      lastSeen: lastSeen.get(userId) ?? userCreatedAt.get(userId) ?? "",
    }))
    .sort((a, b) => b.sessions - a.sessions || b.attempts - a.attempts);

  const hist = { one: 0, few: 0, many: 0 };
  for (const n of sessionsPerUser.values()) {
    if (n === 1) hist.one += 1;
    else if (n <= 3) hist.few += 1;
    else hist.many += 1;
  }
  const sessionHistogram = [
    { label: "1 session", value: hist.one },
    { label: "2–3 sessions", value: hist.few },
    { label: "4+ sessions", value: hist.many },
  ];

  return {
    uniqueUsers: activeUserIds.size,
    totalSessions: sessions.length,
    totalAttempts: attempts.length,
    totalAnswers: answers.length,
    repeatUsers,
    trend,
    statusSlices: [
      { label: "Completed", value: statusCounts.completed, color: "#0f766e" },
      { label: "Abandoned", value: statusCounts.abandoned, color: "#dc2626" },
      { label: "In progress", value: statusCounts.started, color: "#94a3b8" },
    ],
    lessons,
    topQuestions,
    recentAttempts: activityLog.slice(0, 10),
    allQuestions,
    visitors,
    sessionHistogram,
    activityLog: activityLog.slice(0, 50),
    daySummaries,
  };
}

export async function fetchAdminOverview() {
  const d = await fetchAdminDashboard();
  if (!d) return null;
  return {
    uniqueUsers: d.uniqueUsers,
    totalSessions: d.totalSessions,
    totalAttempts: d.totalAttempts,
    totalAnswers: d.totalAnswers,
    repeatUsers: d.repeatUsers,
    lessons: d.lessons,
    recentAttempts: d.recentAttempts,
    topQuestions: d.topQuestions,
  };
}

export function formatDuration(seconds: number | null): string {
  if (seconds == null || seconds < 0) return "—";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export function formatMadridTime(iso: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}
