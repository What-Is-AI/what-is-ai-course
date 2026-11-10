import { ADMIN_DASHBOARD_PATH } from "@/lib/analytics/admin-paths";

export const ADMIN_NAV = [
  { href: ADMIN_DASHBOARD_PATH, label: "Overview", exact: true },
  { href: `${ADMIN_DASHBOARD_PATH}/days`, label: "Days" },
  { href: `${ADMIN_DASHBOARD_PATH}/lessons`, label: "Lessons" },
  { href: `${ADMIN_DASHBOARD_PATH}/questions`, label: "Questions" },
  { href: `${ADMIN_DASHBOARD_PATH}/visitors`, label: "Visitors" },
  { href: `${ADMIN_DASHBOARD_PATH}/activity`, label: "Activity" },
  { href: `${ADMIN_DASHBOARD_PATH}/feedback`, label: "Feedback" },
] as const;
