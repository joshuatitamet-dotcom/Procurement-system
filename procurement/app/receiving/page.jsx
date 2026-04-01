"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import API_BASE_URL from "../config/api";
import DashboardShell from "../components/DashboardShell";

const statusColors = {
  Pending: "dashboard-chip--warning",
  Approved: "dashboard-chip--info",
  Completed: "dashboard-chip--success",
  Cancelled: "dashboard-chip--danger",
};

export default function ReceivingPage() {
  const [orders, setOrders] = useState([]);
  const [busyAction, setBusyAction] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchOrders = useEffectEvent(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`);
      const data = res.ok ? await res.json() : [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching receiving data:", error);
      setOrders([]);
    }
  });

  useEffect(() => {
    fetchOrders();
  }, [refreshTrigger]);

  async function updateOrderStatus(id, status) {
    setBusyAction(id + status);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update order");
      }

      setOrders((prev) => prev.map((order) => (order._id === id ? { ...order, status } : order)));
      window.refreshDashboard?.();
    } catch (error) {
      console.error(error);
      alert("Unable to update receiving status");
    } finally {
      setBusyAction("");
    }
  }

  const metrics = useMemo(() => {
    const pending = orders.filter((order) => order.status === "Pending").length;
    const inTransit = orders.filter((order) => order.status === "Approved").length;
    const received = orders.filter((order) => order.status === "Completed").length;

    return { pending, inTransit, received };
  }, [orders]);

  const activeOrders = orders.filter((order) => order.status !== "Completed" && order.status !== "Cancelled");

  return (
    <DashboardShell
      eyebrow="Delivery lane"
      title="Receiving"
      description="Move approved orders through delivery confirmation so procurement can close the loop before invoicing."
      actions={
        <button
          className="dashboard-button dashboard-button--primary"
          onClick={() => setRefreshTrigger((prev) => prev + 1)}
        >
          Refresh receiving
        </button>
      }
    >
      <section className="dashboard-summary-grid dashboard-summary-grid--three">
        <article className="dashboard-stat-card">
          <p>Pending issue</p>
          <strong>{metrics.pending}</strong>
          <span>Orders created but not yet marked as released for delivery.</span>
        </article>
        <article className="dashboard-stat-card">
          <p>In delivery</p>
          <strong>{metrics.inTransit}</strong>
          <span>Orders approved and currently moving toward fulfillment.</span>
        </article>
        <article className="dashboard-stat-card is-highlight">
          <p>Received</p>
          <strong>{metrics.received}</strong>
          <span>Orders completed and ready for invoice matching.</span>
        </article>
      </section>

      <section className="dashboard-panel dashboard-table-panel">
        <div className="dashboard-panel__header">
          <div>
            <p className="dashboard-panel__eyebrow">Receiving board</p>
            <h2>Track active purchase orders</h2>
          </div>
        </div>

        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Item</th>
                <th>Department</th>
                <th>Status</th>
                <th>Receiving action</th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.length ? (
                activeOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.supplier?.name || "Unknown supplier"}</td>
                    <td>{order.request?.itemName || "Unlinked request"}</td>
                    <td>{order.request?.department || "N/A"}</td>
                    <td>
                      <span className={`dashboard-chip ${statusColors[order.status] || "dashboard-chip--muted"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div className="dashboard-table-actions">
                        {order.status === "Pending" ? (
                          <button
                            className="dashboard-icon-button"
                            type="button"
                            disabled={Boolean(busyAction)}
                            onClick={() => updateOrderStatus(order._id, "Approved")}
                          >
                            {busyAction === order._id + "Approved" ? "Saving..." : "Mark in transit"}
                          </button>
                        ) : null}
                        <button
                          className="dashboard-icon-button"
                          type="button"
                          disabled={Boolean(busyAction)}
                          onClick={() => updateOrderStatus(order._id, "Completed")}
                        >
                          {busyAction === order._id + "Completed" ? "Saving..." : "Confirm receipt"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="report-empty-cell">
                    No active orders currently waiting for receiving actions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}
