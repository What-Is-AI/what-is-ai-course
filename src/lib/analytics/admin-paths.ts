export const ADMIN_BASE_PATH = "/the-other-door";
export const ADMIN_LOGIN_PATH = ADMIN_BASE_PATH;
export const ADMIN_DASHBOARD_PATH = `${ADMIN_BASE_PATH}/analytics`;
export const ADMIN_LOGOUT_PATH = `${ADMIN_BASE_PATH}/logout`;

export const ADMIN_SESSION_COOKIE = "what-is-ai-admin-session";

/** Admin / login routes must not create learning sessions or anonymous users. */
export function isAnalyticsExcludedPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === ADMIN_BASE_PATH || pathname.startsWith(`${ADMIN_BASE_PATH}/`);
}
