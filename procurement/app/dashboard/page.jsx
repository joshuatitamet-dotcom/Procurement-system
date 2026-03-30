"use client";

import { useEffect, useEffectEvent, useState } from "react";
import API_BASE_URL from "../config/api";
import DashboardShell from "../components/DashboardShell";

export default function Dashboard() {
  const [data, setData] = useState({
    suppliers: 0,
    requests: 0,
    orders: 0,
    pending: 0,
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchDashboardData = useEffectEvent(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const payload = await res.json();
      if (payload && typeof payload === "object") {
        setData({
          suppliers: payload.suppliers || 0,
          requests: payload.requests || 0,
          orders: payload.orders || 0,
          pending: payload.pending || 0,
        });
      } else {
        setData({ suppliers: 0, requests: 0, orders: 0, pending: 0 });
      }
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
      setData({ suppliers: 0, requests: 0, orders: 0, pending: 0 });
    }
  });

  useEffect(() => {
    fetchDashboardData();
  }, [refreshTrigger]);

  useEffect(() => {
    window.refreshDashboard = () => {
      setRefreshTrigger((prev) => prev + 1);
    };
  }, []);

  return (
    <DashboardShell
      eyebrow="Overview"
      title="Dashboard"
      description="Monitor supplier growth, request flow, and order activity from one polished control center."
    >
      <section className="dashboard-summary-grid">
        <article className="dashboard-stat-card">
          <p>Suppliers</p>
          <strong>{data.suppliers}</strong>
          <span>Active records tracked in your vendor pipeline.</span>
        </article>

        <article className="dashboard-stat-card">
          <p>Requests</p>
          <strong>{data.requests}</strong>
          <span>Items currently moving through procurement review.</span>
        </article>

        <article className="dashboard-stat-card">
          <p>Orders</p>
          <strong>{data.orders}</strong>
          <span>Purchase orders created across your operation.</span>
        </article>

        <article className="dashboard-stat-card is-highlight">
          <p>Pending requests</p>
          <strong>{data.pending}</strong>
          <span>Actions needing attention from your team right now.</span>
        </article>
      </section>

      <section className="dashboard-panels-grid">
        <article className="dashboard-panel dashboard-panel--hero">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Live pulse</p>
              <h2>Operational readiness stays visible all day.</h2>
            </div>
            <span className="dashboard-chip dashboard-chip--success">Live</span>
          </div>

          <div className="dashboard-wave">
            <div className="dashboard-wave__layer dashboard-wave__layer--one" />
            <div className="dashboard-wave__layer dashboard-wave__layer--two" />
            <div className="dashboard-wave__copy">
              <p>Procurement activity</p>
              <strong>{data.requests + data.orders}</strong>
              <span>open records across requests and orders</span>
            </div>
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Priority lane</p>
              <h2>Where to focus next</h2>
            </div>
          </div>

          <div className="dashboard-activity-list">
            <div className="dashboard-activity-row">
              <span className="activity-dot dot-green" />
              <div>
                <p>Supplier onboarding remains stable</p>
                <small>{data.suppliers} supplier records available</small>
              </div>
            </div>
            <div className="dashboard-activity-row">
              <span className="activity-dot dot-amber" />
              <div>
                <p>Pending approvals need review</p>
                <small>{data.pending} request items still awaiting action</small>
              </div>
            </div>
            <div className="dashboard-activity-row">
              <span className="activity-dot dot-cyan" />
              <div>
                <p>Orders continue moving</p>
                <small>{data.orders} orders logged in the purchasing pipeline</small>
              </div>
            </div>
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}
