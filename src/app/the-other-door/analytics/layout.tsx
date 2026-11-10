import { redirect } from "next/navigation";

import { ADMIN_LOGIN_PATH, isAdminAuthenticated } from "@/lib/analytics/admin-auth";

export default async function OtherDoorAnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect(ADMIN_LOGIN_PATH);
  }

  return <div className="admin-shell min-h-screen">{children}</div>;
}
