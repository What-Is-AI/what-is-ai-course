import { ANALYTICS_ABANDON_MS } from "@/lib/analytics/config";
import { LESSONS } from "@/lib/lessons";
import {
  ADMIN_REPORT_DAYS,
  fetchRawAnalytics,
  madridDayKey,
  recentMadridDayKeys,
  truncateId,
  type RawAttempt,
  type RawSession,
  type RawUser,
} from "@/lib/analytics/admin-data";

const lessonTitle = new Map<string, string>(
  LESSONS.map((l) => [l.id, l.shortTitle]),
);

function titleFor(lessonId: string): string {
  return lessonTitle.get(lessonId) ?? lessonId;
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1]! + sorted[mid]!) / 2)
    : sorted[mid]!;
}

function minIso(a: string, b: string): string {
  return a < b ? a : b;
}

function sessionStaySec(row: RawSession): number {
  const end = row.ended_at ?? row.last_seen_at ?? row.started_at;
  return Math.max(
    0,
    Math.round((new Date(end).getTime() - new Date(row.started_at).getTime()) / 1000),
  );
}

function attemptDuration(row: RawAttempt): number | null {
  if (row.duration_seconds != null) return row.duration_seconds;
  if (!row.last_seen_at) return null;
  return Math.round(
    (new Date(row.last_seen_at).getTime() - new Date(row.started_at).getTime()) / 1000,
  );
}

function effectiveAttemptStatus(row: RawAttempt): string {
  if (row.completion_status !== "started") return row.completion_status;
  if (Date.now() - new Date(row.last_seen_at).getTime() > ANALYTICS_ABANDON_MS) {
    return "abandoned";
  }
  return "started";
}

function firstSeenDayByUser(users: RawUser[], sessions: RawSession[], attempts: RawAttempt[]) {
  const firstSeen = new Map<string, string>();

  for (const user of users) {
    firstSeen.set(user.user_id, madridDayKey(user.created_at));
  }

  const touch = (userId: string, iso: string) => {
    if (firstSeen.has(userId)) return;
    firstSeen.set(userId, madridDayKey(iso));
  };

  for (const session of sessions) touch(session.user_id, session.started_at);
  for (const attempt of attempts) touch(attempt.user_id, attempt.started_at);

  return firstSeen;
}

type LessonAcc = {
  lessonId: string;
  title: string;
  status: string;
  durationSec: number | null;
  startedAt: string;
  opens: number;
};

type VisitorAcc = {
  userId: string;
  firstTime: boolean;
  arrivedAt: string;
  sessionStaySec: number;
  attemptStaySec: number;
  sessionCount: number;
  hasSession: boolean;
  lessons: Map<string, LessonAcc>;
};

function visitorStaySec(acc: VisitorAcc): number {
  // Sessions often under-count (heartbeat gaps); attempts carry real time-on-task.
  return Math.max(acc.sessionStaySec, acc.attemptStaySec);
}

function ensureVisitor(
  byUser: Map<string, VisitorAcc>,
  userId: string,
  day: string,
  firstSeen: Map<string, string>,
  iso: string,
): VisitorAcc {
  const existing = byUser.get(userId);
  if (existing) {
    existing.arrivedAt = minIso(existing.arrivedAt, iso);
    return existing;
  }

  const created: VisitorAcc = {
    userId,
    firstTime: firstSeen.get(userId) === day,
    arrivedAt: iso,
    sessionStaySec: 0,
    attemptStaySec: 0,
    sessionCount: 0,
    hasSession: false,
    lessons: new Map(),
  };
  byUser.set(userId, created);
  return created;
}

function toVisitorRow(acc: VisitorAcc): AdminDayVisitor {
  const staySec = visitorStaySec(acc);
  return {
    userId: truncateId(acc.userId),
    firstTime: acc.firstTime,
    arrivedAt: acc.arrivedAt,
    // Untouched bounce sessions stay at 0; no session/attempt activity → null.
    staySec: staySec > 0 ? staySec : acc.hasSession ? 0 : null,
    sessionCount: acc.sessionCount,
    lessons: [...acc.lessons.values()]
      .sort((a, b) => a.startedAt.localeCompare(b.startedAt))
      .map((lesson) => ({
        lessonId: lesson.lessonId,
        title: lesson.title,
        status: lesson.status,
        durationSec: lesson.durationSec,
        startedAt: lesson.startedAt,
      })),
  };
}

function summarizeDay(day: string, visitors: VisitorAcc[], sessionCount: number): AdminDaySummary {
  // Exclude 0s so homepage bounces don't pin median stay at 0s.
  const stays = visitors.map(visitorStaySec).filter((n) => n > 0);
  const firstTime = visitors.filter((v) => v.firstTime).length;
  const lessonOpens = visitors.reduce(
    (sum, visitor) => sum + [...visitor.lessons.values()].reduce((n, lesson) => n + lesson.opens, 0),
    0,
  );

  return {
    day,
    visitors: visitors.length,
    firstTime,
    returning: visitors.length - firstTime,
    sessions: sessionCount,
    lessonOpens,
    medianStaySec: median(stays),
    avgStaySec:
      stays.length > 0 ? Math.round(stays.reduce((a, b) => a + b, 0) / stays.length) : null,
  };
}

export type AdminDaySummary = {
  day: string;
  visitors: number;
  firstTime: number;
  returning: number;
  sessions: number;
  lessonOpens: number;
  medianStaySec: number | null;
  avgStaySec: number | null;
};

export type AdminDayVisitorLesson = {
  lessonId: string;
  title: string;
  status: string;
  durationSec: number | null;
  startedAt: string;
};

export type AdminDayVisitor = {
  userId: string;
  firstTime: boolean;
  arrivedAt: string;
  staySec: number | null;
  sessionCount: number;
  lessons: AdminDayVisitorLesson[];
};

export type AdminDayLessonRow = {
  lessonId: string;
  title: string;
  opens: number;
  uniqueVisitors: number;
};

export type AdminDayDetail = {
  day: string;
  summary: AdminDaySummary;
  visitors: AdminDayVisitor[];
  lessons: AdminDayLessonRow[];
};

export function buildDailyVisitModel(raw: {
  users: RawUser[];
  sessions: RawSession[];
  attempts: RawAttempt[];
}): { summaries: AdminDaySummary[]; visitorsByDay: Map<string, AdminDayVisitor[]> } {
  const firstSeen = firstSeenDayByUser(raw.users, raw.sessions, raw.attempts);
  const days = new Map<string, Map<string, VisitorAcc>>();
  const sessionsByDay = new Map<string, number>();

  const dayUsers = (day: string) => {
    const existing = days.get(day);
    if (existing) return existing;
    const created = new Map<string, VisitorAcc>();
    days.set(day, created);
    return created;
  };

  for (const session of raw.sessions) {
    const day = madridDayKey(session.started_at);
    sessionsByDay.set(day, (sessionsByDay.get(day) ?? 0) + 1);
    const visitor = ensureVisitor(dayUsers(day), session.user_id, day, firstSeen, session.started_at);
    visitor.sessionCount += 1;
    visitor.sessionStaySec += sessionStaySec(session);
    visitor.hasSession = true;
  }

  for (const attempt of raw.attempts) {
    const day = madridDayKey(attempt.started_at);
    const visitor = ensureVisitor(dayUsers(day), attempt.user_id, day, firstSeen, attempt.started_at);
    const prev = visitor.lessons.get(attempt.lesson_id);
    const next: LessonAcc = {
      lessonId: attempt.lesson_id,
      title: titleFor(attempt.lesson_id),
      status: effectiveAttemptStatus(attempt),
      durationSec: attemptDuration(attempt),
      startedAt: attempt.started_at,
      opens: (prev?.opens ?? 0) + 1,
    };
    if (!prev || attempt.started_at >= prev.startedAt) {
      visitor.lessons.set(attempt.lesson_id, next);
    } else {
      prev.opens += 1;
    }

    const span = attemptDuration(attempt);
    if (span != null) visitor.attemptStaySec += span;
  }

  const summaries = recentMadridDayKeys(ADMIN_REPORT_DAYS).map((day) => {
    const visitors = [...(days.get(day)?.values() ?? [])];
    return summarizeDay(day, visitors, sessionsByDay.get(day) ?? 0);
  });

  const visitorsByDay = new Map<string, AdminDayVisitor[]>();
  for (const [day, byUser] of days) {
    visitorsByDay.set(
      day,
      [...byUser.values()]
        .map(toVisitorRow)
        .sort((a, b) => Number(b.firstTime) - Number(a.firstTime) || a.arrivedAt.localeCompare(b.arrivedAt)),
    );
  }

  return { summaries, visitorsByDay };
}

export function buildDayDetail(
  raw: {
    users: RawUser[];
    sessions: RawSession[];
    attempts: RawAttempt[];
  },
  day: string,
): AdminDayDetail {
  const { summaries, visitorsByDay } = buildDailyVisitModel(raw);
  const visitors = visitorsByDay.get(day) ?? [];
  const fromWindow = summaries.find((row) => row.day === day);

  const stays = visitors
    .map((v) => v.staySec)
    .filter((n): n is number => n != null && n > 0);
  const firstTime = visitors.filter((v) => v.firstTime).length;
  const lessonOpens = raw.attempts.filter((a) => madridDayKey(a.started_at) === day).length;
  const sessionCount =
    fromWindow?.sessions ?? raw.sessions.filter((s) => madridDayKey(s.started_at) === day).length;

  const lessonMap = new Map<string, AdminDayLessonRow>();
  for (const visitor of visitors) {
    for (const lesson of visitor.lessons) {
      const row = lessonMap.get(lesson.lessonId) ?? {
        lessonId: lesson.lessonId,
        title: lesson.title,
        opens: 0,
        uniqueVisitors: 0,
      };
      row.uniqueVisitors += 1;
      lessonMap.set(lesson.lessonId, row);
    }
  }

  for (const attempt of raw.attempts) {
    if (madridDayKey(attempt.started_at) !== day) continue;
    const row = lessonMap.get(attempt.lesson_id) ?? {
      lessonId: attempt.lesson_id,
      title: titleFor(attempt.lesson_id),
      opens: 0,
      uniqueVisitors: 0,
    };
    row.opens += 1;
    lessonMap.set(attempt.lesson_id, row);
  }

  return {
    day,
    summary: {
      day,
      visitors: visitors.length,
      firstTime,
      returning: visitors.length - firstTime,
      sessions: sessionCount,
      lessonOpens,
      medianStaySec: median(stays),
      avgStaySec:
        stays.length > 0 ? Math.round(stays.reduce((a, b) => a + b, 0) / stays.length) : null,
    },
    visitors,
    lessons: [...lessonMap.values()].sort(
      (a, b) => b.opens - a.opens || a.title.localeCompare(b.title),
    ),
  };
}

export async function fetchAdminDayDetail(day: string): Promise<AdminDayDetail | null> {
  const raw = await fetchRawAnalytics();
  if (!raw) return null;
  return buildDayDetail(raw, day);
}
