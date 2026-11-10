"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_LOGOUT_PATH } from "@/lib/analytics/admin-paths";
import { ADMIN_NAV } from "@/lib/analytics/admin-nav";

export function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <p className="admin-sidebar-kicker">Private</p>
          <p className="admin-sidebar-title">Analytics</p>
        </div>
        <nav className="admin-sidebar-nav" aria-label="Analytics sections">
          {ADMIN_NAV.map((item) => {
            const active =
              "exact" in item && item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-sidebar-link${active ? " admin-sidebar-link-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <form action={ADMIN_LOGOUT_PATH} method="post" className="admin-sidebar-footer">
          <button type="submit" className="admin-link-btn admin-sidebar-signout">
            Sign out
          </button>
        </form>
      </aside>

      <div className="admin-main">
        <header className="admin-main-header">
          <div>
            <h1 className="font-display admin-main-title">{title}</h1>
            {subtitle ? <p className="admin-main-subtitle">{subtitle}</p> : null}
          </div>
        </header>
        {children}
      </div>
    </div>
  );

}
