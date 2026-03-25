"use client";

import Link from "next/link";

export default function DashboardLayout({ children }) {
  return <>{children}</>;
}

/* STYLES */

const sidebar = {
  width: 220,
  height: "100vh",
  background: "#111",
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 15
};

const link = {
  color: "#fff",
  textDecoration: "none",
  padding: 10,
  borderRadius: 6,
  background: "#1f2937"
};

const logoutBtn = {
  marginTop: "auto",
  padding: 10,
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};

const main = {
  flex: 1,
  padding: 20,
  background: "#f4f6f8"
};