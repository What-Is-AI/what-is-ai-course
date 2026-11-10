import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { isAnalyticsConfigured } from "@/lib/analytics/config";

let client: SupabaseClient | null = null;

export function getAnalyticsClient(): SupabaseClient | null {
  if (!isAnalyticsConfigured()) return null;

  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  return client;
}
