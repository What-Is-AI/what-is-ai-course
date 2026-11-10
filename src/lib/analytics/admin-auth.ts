import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

import {
  ADMIN_BASE_PATH,
  ADMIN_SESSION_COOKIE,
} from "@/lib/analytics/admin-paths";

export {
  ADMIN_BASE_PATH,
  ADMIN_LOGIN_PATH,
  ADMIN_DASHBOARD_PATH,
  ADMIN_LOGOUT_PATH,
} from "@/lib/analytics/admin-paths";
const SESSION_MAX_AGE_S = 60 * 60 * 24 * 7; // 7 days

function adminSecret(): string | null {
  return process.env.ANALYTICS_ADMIN_SECRET ?? null;
}

function adminPassword(): string | null {
  return process.env.ANALYTICS_ADMIN_PASSWORD ?? null;
}

export function isAdminConfigured(): boolean {
  return Boolean(adminSecret() && adminPassword());
}

function signPayload(payload: string): string | null {
  const secret = adminSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function createSessionToken(): string | null {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_S;
  const sig = signPayload(String(expiresAt));
  if (!sig) return null;
  return `${expiresAt}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [expiresRaw, sig] = token.split(".");
  if (!expiresRaw || !sig) return false;

  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expected = signPayload(expiresRaw);
  if (!expected) return false;

  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyAdminPassword(input: string): boolean {
  const expected = adminPassword();
  if (!expected) return false;

  try {
    const a = Buffer.from(input);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  if (!isAdminConfigured()) return false;
  const jar = await cookies();
  return verifySessionToken(jar.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function setAdminSessionCookie(): Promise<boolean> {
  const token = createSessionToken();
  if (!token) return false;

  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: ADMIN_BASE_PATH,
    maxAge: SESSION_MAX_AGE_S,
  });
  return true;
}

export async function clearAdminSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: ADMIN_BASE_PATH,
    maxAge: 0,
  });
}
