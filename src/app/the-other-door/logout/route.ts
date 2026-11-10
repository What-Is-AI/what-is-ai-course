import { NextResponse } from "next/server";

import {
  ADMIN_LOGIN_PATH,
  clearAdminSessionCookie,
} from "@/lib/analytics/admin-auth";

export async function POST(request: Request) {
  await clearAdminSessionCookie();
  return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url), {
    status: 303,
  });
}
