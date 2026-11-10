"use server";

import { redirect } from "next/navigation";

import {
  ADMIN_DASHBOARD_PATH,
  isAdminConfigured,
  setAdminSessionCookie,
  verifyAdminPassword,
} from "@/lib/analytics/admin-auth";

export type LoginState = { error?: string };

export async function loginAdmin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return { error: "This door is not configured on this deployment." };
  }

  const password = String(formData.get("password") ?? "");
  if (!password || !verifyAdminPassword(password)) {
    return { error: "The unexamined key is not worth turning" };
  }

  const ok = await setAdminSessionCookie();
  if (!ok) return { error: "Could not start session." };

  redirect(ADMIN_DASHBOARD_PATH);
}
