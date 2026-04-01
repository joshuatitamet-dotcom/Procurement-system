"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import API_BASE_URL from "../config/api";
import DashboardShell from "../components/DashboardShell";

function formatDate(value) {
  if (!value) return "No timestamp";
  return new Date(value).toLocaleString();
}

export default function AuditLogPage() {
  const [records, setRecords] = useState({
    suppliers: [],
    requests: [],
    orders: [],
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchAuditData = useEffectEvent(async () => {
    try {
      const [suppliersRes, requestsRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/suppliers`),
        fetch(`${API_BASE_URL}/api/requests`),
        fetch(`${API_BASE_URL}/api/orders`),
      ]);

      const [suppliers, requests, orders] = await Promise.all([
        suppliersRes.ok ? suppliersRes.json() : [],
        requestsRes.ok ? requestsRes.json() : [],
        ordersRes.ok ? ordersRes.json() : [],
      ]);

      setRecords({
        suppliers: Array.isArray(suppliers) ? suppliers : [],
        requests: Array.isArray(requests) ? requests : [],
        orders: Array.isArray(orders) ? orders : [],
      });
    } catch (error) {
      console.log("Error fetching audit log:", error);
      setRecords({ suppliers: [], requests: [], orders: [] });
    }
  });

  useEffect(() => {
    fetchAuditData();
  }, [refreshTrigger]);

  const events = useMemo(() => {
    const supplierEvents = records.suppliers.map((supplier) => ({
      id: `supplier-${supplier._id}`,
      type: "Supplier",
      title: supplier.name,
      detail: `Supplier record is ${supplier.status || "Active"}.`,
      createdAt: supplier.createdAt,
    }));

    const requestEvents = records.requests.map((request) => ({
      id: `request-${request._id}`,
      type: "Request",
      title: request.itemName,
      detail: `${request.department} requested ${request.quantity} units with ${request.status} status.`,
      createdAt: request.createdAt,
    }));

    const orderEvents = records.orders.map((order) => ({
      id: `order-${order._id}`,
      type: "Order",
      title: order.request?.itemName || "Purchase order",
      detail: `${order.supplier?.name || "Unknown supplier"} order is currently ${order.status}.`,
      createdAt: order.createdAt,
    }));

    return [...supplierEvents, ...requestEvents, ...orderEvents]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 18);
  }, [records]);

  return (
    <DashboardShell
      eyebrow="Traceability"
      title="Audit Log"
      description="Surface a simple operational history so teams can trace what entered the system, what changed status, and what moved into ordering."
      actions={
        <button
          className="dashboard-button dashboard-button--primary"
          onClick={() => setRefreshTrigger((prev) => prev + 1)}
        >
          Refresh log
        </button>
      }
    >
      <section className="dashboard-summary-grid dashboard-summary-grid--three">
        <article className="dashboard-stat-card">
          <p>Supplier events</p>
          <strong>{records.suppliers.length}</strong>
          <span>Supplier records currently contributing to the audit stream.</span>
        </article>
        <article className="dashboard-stat-card">
          <p>Request events</p>
          <strong>{records.requests.length}</strong>
          <span>Submitted procurement requests tracked in the system.</span>
        </article>
        <article className="dashboard-stat-card is-highlight">
          <p>Order events</p>
          <strong>{records.orders.length}</strong>
          <span>Purchase orders available for operational traceability.</span>
        </article>
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-panel__header">
          <div>
            <p className="dashboard-panel__eyebrow">Recent activity</p>
            <h2>Latest procurement events</h2>
          </div>
        </div>

        <div className="audit-log-list">
          {events.length ? (
            events.map((event) => (
              <div className="audit-log-row" key={event.id}>
                <div className="audit-log-row__meta">
                  <span className="dashboard-chip dashboard-chip--muted">{event.type}</span>
                  <strong>{event.title}</strong>
                </div>
                <p>{event.detail}</p>
                <small>{formatDate(event.createdAt)}</small>
              </div>
            ))
          ) : (
            <p className="report-empty">No audit events available.</p>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
