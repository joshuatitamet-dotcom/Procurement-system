"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();

  const [data, setData] = useState({
    suppliers: 0,
    requests: 0,
    orders: 0,
    pending: 0
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  async function handleLogout() {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error(error);
    }
    router.push("/login");
  }

  const navLinks = [
    { label: "Dashboard", path: "/dashboard", icon: "🏠" },
    { label: "Suppliers", path: "/suppliers", icon: "📦" },
    { label: "Requests", path: "/requests", icon: "📝" },
    { label: "Orders", path: "/orders", icon: "🛒" }
  ];

  return (
    <div style={appContainer}>
      <div style={backgroundOverlay}></div>
      <aside style={sidebar}>
        <h2 style={logo}>ProcurePro</h2>
        <p style={sidebarLabel}>Supply Chain Control</p>

        <nav>
          <ul style={navList}>
            {navLinks.map(({ label, path, icon }) => {
              const isActive = pathname === path;
              return (
                <li key={path} style={{ ...navItem, ...(isActive ? activeNavItem : {}) }}>
                  <Link href={path} style={navLink}>
                    <span style={iconStyle}>{icon}</span>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button style={logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main style={page}>
        <h1 style={title}>Dashboard</h1>

        <div style={cards}>
          <div style={card}>
            <h3>Suppliers</h3>
            <p style={number}>{data.suppliers}</p>
          </div>

          <div style={card}>
            <h3>Requests</h3>
            <p style={number}>{data.requests}</p>
          </div>

          <div style={card}>
            <h3>Orders</h3>
            <p style={number}>{data.orders}</p>
          </div>

          <div style={card}>
            <h3>Pending Requests</h3>
            <p style={{ ...number, color: "#f59e0b" }}>{data.pending}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

/* STYLES */

const appContainer = {
  display: "flex",
  minHeight: "100vh",
  background: "#0b1220",
  color: "#f1f5f9",
  position: "relative",
  overflow: "hidden"
};

const backgroundOverlay = {
  position: "absolute",
  inset: 0,
  backgroundImage: "linear-gradient(rgba(9, 15, 31, 0.85), rgba(14, 22, 44, 0.92)), url('https://images.unsplash.com/photo-1605902711622-cfb43c443f39?auto=format&fit=crop&w=1200&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  filter: "blur(1.2px)",
  animation: "moveBackground 35s ease infinite",
  transform: "scale(1.05)",
  zIndex: 0
};

const sidebar = {
  width: 240,
  padding: 24,
  background: "rgba(7, 13, 30, 0.85)",
  borderRight: "1px solid rgba(148, 163, 184, 0.25)",
  zIndex: 2,
  position: "relative"
};

const logo = {
  marginBottom: 8,
  color: "#67e8f9",
  fontSize: 24,
  fontWeight: "bold"
};

const sidebarLabel = {
  marginBottom: 20,
  color: "#cbd5e1",
  fontSize: 13
};

const navLink = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "inherit",
  textDecoration: "none",
  fontWeight: 600
};

const logoutBtn = {
  marginTop: 20,
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "none",
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer"
};

const navList = {
  listStyleType: "none",
  padding: 0,
  margin: 0
};

const navItem = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "12px 14px",
  borderRadius: 8,
  marginBottom: 10,
  color: "#cbd5e1",
  cursor: "pointer",
  transition: "all 0.2s ease"
};

const iconStyle = {
  fontSize: 18
};

const activeNavItem = {
  background: "linear-gradient(90deg, rgba(56,189,248,.25), rgba(14,165,233,.1))",
  color: "#fff",
  boxShadow: "0 0 20px rgba(56, 189, 248, 0.35)"
};

const icon = {
  fontSize: 18
};

const page = {
  padding: 30,
  minHeight: "100vh",
  flex: 1,
  zIndex: 2,
  position: "relative",
  overflow: "auto"
};

const title = {
  marginBottom: 16,
  color: "#e2e8f0"
};

const cards = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
  gap: 24,
  marginTop: 20
};

const card = {
  background: "rgba(10, 17, 34, 0.85)",
  padding: 20,
  borderRadius: 14,
  border: "1px solid rgba(100, 116, 139, 0.4)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
  backdropFilter: "blur(4px)"
};

const number = {
  fontSize: 32,
  fontWeight: "bold",
  color: "#7dd3fc",
  margin: "12px 0 0"
};

// keyframes style added to document for animation
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
@keyframes moveBackground {
  0% { background-position: 50% 20%; }
  50% { background-position: 35% 40%; }
  100% { background-position: 50% 20%; }
}
`;
  document.head.appendChild(style);
}