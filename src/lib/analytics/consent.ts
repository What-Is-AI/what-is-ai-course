import { getAnalyticsClient } from "@/lib/analytics/client";
import { isAnalyticsConfigured } from "@/lib/analytics/config";
import { ensureAnonymousUser, getOrCreateUserId } from "@/lib/analytics/identity";
import { fireAndForget } from "@/lib/analytics/safe";
import { loadLocal, saveLocal } from "@/lib/storage";

/** Set in Vercel / `.env.local` as `NEXT_PUBLIC_GA_MEASUREMENT_ID`. Empty = GA off. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

/** Bump when banner copy / purposes change so users are re-prompted. */
export const GA_CONSENT_POLICY_VERSION = "1";

const STORAGE_KEY = "ga-consent";
export const GA_CONSENT_CHANGE_EVENT = "what-is-ai:ga-consent-change";
export const GA_CONSENT_OPEN_EVENT = "what-is-ai:ga-consent-open";

export type GaConsentChoice = "granted" | "denied";

type StoredConsent = {
  choice: GaConsentChoice;
  version: string;
  at: string;
};

export function getGaConsent(): GaConsentChoice | null {
  const stored = loadLocal<StoredConsent | null>(STORAGE_KEY, null);
  if (!stored) return null;
  if (stored.version !== GA_CONSENT_POLICY_VERSION) return null;
  if (stored.choice !== "granted" && stored.choice !== "denied") return null;
  return stored.choice;
}

function clearGaCookies(): void {
  if (typeof document === "undefined") return;
  const expire = "Thu, 01 Jan 1970 00:00:00 GMT";
  const host = window.location.hostname;
  const domains = [undefined, host, `.${host}`];

  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name || (!name.startsWith("_ga") && name !== "_gid")) continue;
    for (const domain of domains) {
      const domainPart = domain ? `; domain=${domain}` : "";
      document.cookie = `${name}=; expires=${expire}; path=/${domainPart}`;
    }
  }
}

function persistLocal(choice: GaConsentChoice): void {
  saveLocal(STORAGE_KEY, {
    choice,
    version: GA_CONSENT_POLICY_VERSION,
    at: new Date().toISOString(),
  } satisfies StoredConsent);
}

function notifyChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(GA_CONSENT_CHANGE_EVENT));
}

async function recordConsentEvent(choice: GaConsentChoice): Promise<void> {
  if (!isAnalyticsConfigured()) return;

  const supabase = getAnalyticsClient();
  if (!supabase) return;

  const userId = getOrCreateUserId();
  if (userId) await ensureAnonymousUser(userId);

  const { error } = await supabase.from("consent_events").insert({
    user_id: userId,
    purpose: "google_analytics",
    action: choice === "granted" ? "grant" : "withdraw",
    policy_version: GA_CONSENT_POLICY_VERSION,
  });

  if (error) throw error;
}

/** Save choice, optionally clear GA cookies, audit to Supabase. */
export function setGaConsent(choice: GaConsentChoice): void {
  persistLocal(choice);
  if (choice === "denied") clearGaCookies();
  notifyChange();
  fireAndForget(recordConsentEvent(choice));
}

/** Re-open the banner so the user can change their mind. */
export function openGaConsentBanner(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(GA_CONSENT_OPEN_EVENT));
}
