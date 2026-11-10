import { ANALYTICS_USER_KEY } from "@/lib/analytics/config";
import { getAnalyticsClient } from "@/lib/analytics/client";
import { loadLocal, saveLocal } from "@/lib/storage";

export function getOrCreateUserId(): string | null {
  if (typeof window === "undefined") return null;

  const existing = loadLocal<string | null>(ANALYTICS_USER_KEY, null);
  if (existing) return existing;

  const userId = crypto.randomUUID();
  saveLocal(ANALYTICS_USER_KEY, userId);
  return userId;
}

export async function ensureAnonymousUser(userId: string): Promise<void> {
  const supabase = getAnalyticsClient();
  if (!supabase) return;

  const { error } = await supabase
    .from("anonymous_users")
    .insert({ user_id: userId });

  // RLS allows insert-only; upsert needs SELECT and fails. Duplicate user is fine.
  if (error && error.code !== "23505") throw error;
}
