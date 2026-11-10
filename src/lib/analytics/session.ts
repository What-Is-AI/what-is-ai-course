import {
  ANALYTICS_SESSION_IDLE_MS,
  ANALYTICS_SESSION_KEY,
  ANALYTICS_SESSION_LAST_SEEN_KEY,
  ANALYTICS_USER_KEY,
} from "@/lib/analytics/config";
import { getAnalyticsClient } from "@/lib/analytics/client";
import { ensureAnonymousUser } from "@/lib/analytics/identity";
import { abandonStaleOpenAttempt } from "@/lib/analytics/openAttempt";
import { loadLocal, saveLocal } from "@/lib/storage";

type SessionRecord = {
  sessionId: string;
  userId: string;
};

function readStoredSession(): SessionRecord | null {
  const sessionId = loadLocal<string | null>(ANALYTICS_SESSION_KEY, null);
  const userId = loadLocal<string | null>(ANALYTICS_USER_KEY, null);
  if (!sessionId || !userId) return null;
  return { sessionId, userId };
}

function writeStoredSession(session: SessionRecord): void {
  saveLocal(ANALYTICS_SESSION_KEY, session.sessionId);
  saveLocal(ANALYTICS_SESSION_LAST_SEEN_KEY, Date.now());
}

function isSessionIdle(): boolean {
  const lastSeen = loadLocal<number | null>(ANALYTICS_SESSION_LAST_SEEN_KEY, null);
  if (lastSeen == null) return true;
  return Date.now() - lastSeen > ANALYTICS_SESSION_IDLE_MS;
}

export async function ensureSession(userId: string): Promise<string | null> {
  const supabase = getAnalyticsClient();
  if (!supabase) return null;

  await ensureAnonymousUser(userId);
  await abandonStaleOpenAttempt();

  const existing = readStoredSession();
  if (existing && existing.userId === userId && !isSessionIdle()) {
    await touchSession(existing.sessionId);
    return existing.sessionId;
  }

  if (existing && existing.userId === userId && isSessionIdle()) {
    await endSession(existing.sessionId);
  }

  const sessionId = crypto.randomUUID();
  const now = new Date().toISOString();

  const { error } = await supabase.from("learning_sessions").insert({
    session_id: sessionId,
    user_id: userId,
    started_at: now,
    last_seen_at: now,
  });

  if (error) throw error;

  writeStoredSession({ sessionId, userId });
  return sessionId;
}

export async function touchSession(sessionId: string): Promise<void> {
  const supabase = getAnalyticsClient();
  if (!supabase) return;

  saveLocal(ANALYTICS_SESSION_LAST_SEEN_KEY, Date.now());

  const { error } = await supabase.rpc("touch_learning_session", {
    p_session_id: sessionId,
  });
  if (error) throw error;
}

export async function endSession(sessionId: string): Promise<void> {
  const supabase = getAnalyticsClient();
  if (!supabase) return;

  const { error } = await supabase.rpc("end_learning_session", {
    p_session_id: sessionId,
  });
  if (error) throw error;
}

export function clearStoredSession(): void {
  if (typeof window === "undefined") return;
  saveLocal(ANALYTICS_SESSION_KEY, null);
}
