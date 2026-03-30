"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import API_BASE_URL from "../config/api";

const navLinks = [
  { label: "Dashboard", path: "/dashboard", glyph: "DB" },
  { label: "Suppliers", path: "/suppliers", glyph: "SP" },
  { label: "Requests", path: "/requests", glyph: "RQ" },
  { label: "Orders", path: "/orders", glyph: "PO" },
];

export default function DashboardShell({ eyebrow, title, description, actions, children }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(error);
    }

    router.push("/login");
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-shell__glow dashboard-shell__glow--one" />
      <div className="dashboard-shell__glow dashboard-shell__glow--two" />

      <aside className="dashboard-sidebar">
        <div>
          <p className="dashboard-sidebar__brand">FlowProcure</p>
          <p className="dashboard-sidebar__tag">Operations command center</p>
        </div>

        <nav className="dashboard-nav">
          {navLinks.map(({ label, path, glyph }) => {
            const isActive = pathname === path;

            return (
              <Link key={path} href={path} className={`dashboard-nav__link ${isActive ? "is-active" : ""}`}>
                <span className="dashboard-nav__glyph">{glyph}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="dashboard-sidebar__footer">
          <div className="dashboard-sidebar__profile">
            <div className="dashboard-sidebar__avatar">FM</div>
            <div>
              <p>Flow Manager</p>
              <span>Procurement workspace</span>
            </div>
          </div>

          <button className="dashboard-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-header__eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="dashboard-header__description">{description}</p>
          </div>

          {actions ? <div className="dashboard-header__actions">{actions}</div> : null}
        </header>

        {children}
      </main>
    </div>
  );
}
