"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import API_BASE_URL from "../config/api";
import DashboardShell from "../components/DashboardShell";

const statusColors = {
  Pending: "dashboard-chip--warning",
  Approved: "dashboard-chip--info",
  Completed: "dashboard-chip--success",
  Cancelled: "dashboard-chip--danger",
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [form, setForm] = useState({ supplier: "", request: "" });

  const fetchOrdersData = useEffectEvent(async () => {
    try {
      const [ordersRes, suppliersRes, requestsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/orders`),
        fetch(`${API_BASE_URL}/api/suppliers`),
        fetch(`${API_BASE_URL}/api/requests`),
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      }
      if (suppliersRes.ok) {
        const suppliersData = await suppliersRes.json();
        setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
      }
      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setRequests(Array.isArray(requestsData) ? requestsData : []);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  });

  useEffect(() => {
    fetchOrdersData();
  }, [refreshTrigger]);

  useEffect(() => {
    window.refreshOrdersPage = () => {
      setRefreshTrigger((prev) => prev + 1);
    };
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.supplier || !form.request) {
      alert("Please select both a supplier and a request");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Pending", ...form }),
    });

    const data = await res.json();
    if (res.ok) {
      setOrders((prev) => [data.order, ...prev]);
      setShowSuccess(true);
      setForm({ supplier: "", request: "" });
      window.refreshDashboard?.();
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } else {
      alert(`Failed to create order: ${data.message || "Unknown error"}`);
    }
  }

  async function deleteOrder(id) {
    if (!confirm("Delete this order?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete order");
      }
      setOrders((prev) => prev.filter((order) => order._id !== id));
      window.refreshDashboard?.();
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  }

  async function handleComplete(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" }),
      });

      if (!res.ok) {
        throw new Error("Failed to update order");
      }

      setOrders((prev) => prev.map((order) => (order._id === id ? { ...order, status: "Completed" } : order)));
      window.refreshDashboard?.();
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const supplierName = order.supplier?.name?.toLowerCase() || "";
      const itemName = order.request?.itemName?.toLowerCase() || "";
      return supplierName.includes(search.toLowerCase()) || itemName.includes(search.toLowerCase());
    });
  }, [orders, search]);

  return (
    <DashboardShell
      eyebrow="Purchase flow"
      title="Orders"
      description="Build and manage purchase orders with the same refined controls, feedback states, and dashboard styling."
      actions={
        <button
          className="dashboard-button dashboard-button--primary"
          onClick={() => document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth" })}
        >
          Create order
        </button>
      }
    >
      {showSuccess ? (
        <div className="dashboard-inline-note is-success">
          <p>Order created successfully. Redirecting to the dashboard.</p>
          <button className="dashboard-button dashboard-button--secondary" onClick={() => setShowSuccess(false)}>Stay here</button>
        </div>
      ) : null}

      <section className="dashboard-summary-grid">
        <article className="dashboard-stat-card"><p>Total orders</p><strong>{orders.length}</strong><span>Orders created across the system.</span></article>
        <article className="dashboard-stat-card is-highlight"><p>Pending</p><strong>{orders.filter((order) => order.status === "Pending").length}</strong><span>Orders still waiting for completion.</span></article>
        <article className="dashboard-stat-card"><p>Approved</p><strong>{orders.filter((order) => order.status === "Approved").length}</strong><span>Orders approved for processing.</span></article>
        <article className="dashboard-stat-card"><p>Completed</p><strong>{orders.filter((order) => order.status === "Completed").length}</strong><span>Orders already closed out.</span></article>
      </section>

      <section className="dashboard-panels-grid dashboard-panels-grid--content">
        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Find orders</p>
              <h2>Search active purchase orders</h2>
            </div>
            <Link href="/requests" className="dashboard-button dashboard-button--secondary">Back to requests</Link>
          </div>

          <div className="dashboard-toolbar">
            <input className="dashboard-input" placeholder="Search by supplier or item" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </article>

        <article className="dashboard-panel" id="order-form">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">New order</p>
              <h2>Create purchase order</h2>
            </div>
          </div>

          <form className="dashboard-form-grid" onSubmit={handleSubmit}>
            <select className="dashboard-input dashboard-select" name="request" value={form.request} onChange={handleChange} required>
              <option value="">Select request</option>
              {requests.map((request) => (
                <option key={request._id} value={request._id}>
                  {request.itemName} - {request.quantity} units ({request.department})
                </option>
              ))}
            </select>

            <select className="dashboard-input dashboard-select" name="supplier" value={form.supplier} onChange={handleChange} required>
              <option value="">Select supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name} ({supplier.email})
                </option>
              ))}
            </select>

            <button className="dashboard-button dashboard-button--primary" type="submit">Create order</button>
          </form>
        </article>
      </section>

      <section className="dashboard-panel dashboard-table-panel">
        <div className="dashboard-panel__header">
          <div>
            <p className="dashboard-panel__eyebrow">Order records</p>
            <h2>Purchase order table</h2>
          </div>
        </div>

        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>PO #</th>
                <th>Item</th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={order._id}>
                  <td>PO-{1000 + index}</td>
                  <td>{order.request?.itemName}</td>
                  <td>{order.supplier?.name}</td>
                  <td>
                    <span className={`dashboard-chip ${statusColors[order.status] || "dashboard-chip--muted"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="dashboard-progress">
                      <div
                        className={`dashboard-progress__fill ${order.status === "Completed" ? "is-complete" : order.status === "Approved" ? "is-approved" : ""}`}
                        style={{ width: order.status === "Completed" ? "100%" : order.status === "Approved" ? "75%" : "45%" }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="dashboard-table-actions">
                      <button className="dashboard-icon-button" type="button" onClick={() => handleComplete(order._id)}>Complete</button>
                      <button className="dashboard-icon-button is-danger" type="button" onClick={() => deleteOrder(order._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}
