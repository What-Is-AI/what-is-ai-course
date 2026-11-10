export const ANALYTICS_USER_KEY = "analytics-user-id";
export const ANALYTICS_SESSION_KEY = "analytics-session-id";
export const ANALYTICS_SESSION_LAST_SEEN_KEY = "analytics-session-last-seen";

export const ANALYTICS_HEARTBEAT_MS = 45_000;
export const ANALYTICS_SESSION_IDLE_MS = 1_800_000; // 30 minutes
export const ANALYTICS_ABANDON_MS = 900_000; // 15 minutes

export function isAnalyticsConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
