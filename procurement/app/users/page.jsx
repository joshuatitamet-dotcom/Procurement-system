"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import API_BASE_URL from "../config/api";
import DashboardShell from "../components/DashboardShell";

const roleDescriptions = {
  admin: "Owns configuration, user access, and full procurement visibility.",
  requester: "Raises purchase needs and follows approval outcomes.",
  approver: "Reviews requests before they become orders.",
  finance: "Matches invoices and tracks payment readiness.",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchUsers = useEffectEvent(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`);
      const data = res.ok ? await res.json() : [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching users:", error);
      setUsers([]);
    }
  });

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const roleSummary = useMemo(() => {
    return users.reduce((acc, user) => {
      const role = (user.role || "admin").toLowerCase();
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
  }, [users]);

  return (
    <DashboardShell
      eyebrow="Access control"
      title="Users & Roles"
      description="Keep procurement duties clear by separating who requests, approves, orders, receives, and handles finance follow-up."
      actions={
        <button
          className="dashboard-button dashboard-button--primary"
          onClick={() => setRefreshTrigger((prev) => prev + 1)}
        >
          Refresh users
        </button>
      }
    >
      <section className="dashboard-summary-grid dashboard-summary-grid--three">
        <article className="dashboard-stat-card">
          <p>Total users</p>
          <strong>{users.length}</strong>
          <span>Accounts registered across the procurement workspace.</span>
        </article>
        <article className="dashboard-stat-card">
          <p>Verified users</p>
          <strong>{users.filter((user) => user.isVerified).length}</strong>
          <span>Users who completed email verification and can access the system.</span>
        </article>
        <article className="dashboard-stat-card is-highlight">
          <p>Admin users</p>
          <strong>{roleSummary.admin || 0}</strong>
          <span>Current accounts with broad control across the workflow.</span>
        </article>
      </section>

      <section className="dashboard-panels-grid dashboard-panels-grid--content">
        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Role model</p>
              <h2>Recommended responsibilities</h2>
            </div>
          </div>

          <div className="workflow-stage-list">
            {["requester", "approver", "admin", "finance"].map((role) => (
              <div className="workflow-stage-card is-static" key={role}>
                <div className="workflow-stage-card__top">
                  <p>{role.charAt(0).toUpperCase() + role.slice(1)}</p>
                  <span className="dashboard-chip dashboard-chip--muted">{roleSummary[role] || 0}</span>
                </div>
                <small>{roleDescriptions[role]}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">User directory</p>
              <h2>Current access list</h2>
            </div>
          </div>

          <div className="dashboard-activity-list">
            {users.length ? (
              users.map((user) => (
                <div className="dashboard-activity-row" key={user._id || user.email}>
                  <span className={`activity-dot ${user.isVerified ? "dot-green" : "dot-amber"}`} />
                  <div>
                    <p>{user.email}</p>
                    <small>{(user.role || "admin").toUpperCase()} access</small>
                  </div>
                </div>
              ))
            ) : (
              <p className="report-empty">No users were returned by the backend.</p>
            )}
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}
