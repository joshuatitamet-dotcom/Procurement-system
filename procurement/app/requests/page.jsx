"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import Link from "next/link";
import API_BASE_URL from "../config/api";
import DashboardShell from "../components/DashboardShell";

const statusColors = {
  Pending: "dashboard-chip--warning",
  Approved: "dashboard-chip--success",
  Rejected: "dashboard-chip--danger",
};

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [requestForm, setRequestForm] = useState({ itemName: "", quantity: "", department: "", status: "Pending" });
  const [editingRequestId, setEditingRequestId] = useState("");
  const [nextStep, setNextStep] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchRequestsData = useEffectEvent(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/requests`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching requests:", error);
      setRequests([]);
    }
  });

  useEffect(() => {
    fetchRequestsData();
  }, [refreshTrigger]);

  useEffect(() => {
    window.refreshRequestsPage = () => {
      setRefreshTrigger((prev) => prev + 1);
    };
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const text = `${request.itemName} ${request.quantity} ${request.department}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || request.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  async function deleteRequest(id) {
    if (!confirm("Delete this request?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/requests/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete request");
      }
      setRequests((prev) => prev.filter((request) => request._id !== id));
      window.refreshDashboard?.();
    } catch (error) {
      console.error(error);
      alert("Unable to delete request");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!requestForm.itemName || !requestForm.quantity || !requestForm.department) return;

    try {
      const isEditing = Boolean(editingRequestId);
      const res = await fetch(`${API_BASE_URL}/api/requests${isEditing ? `/${editingRequestId}` : ""}`, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestForm),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Request save failed");
      }
      const savedRequest = data.request || data;
      setRequests((prev) =>
        isEditing
          ? prev.map((request) => (request._id === editingRequestId ? savedRequest : request))
          : [savedRequest, ...prev]
      );
      setRequestForm({ itemName: "", quantity: "", department: "", status: "Pending" });
      setEditingRequestId("");
      setNextStep(true);
      window.refreshDashboard?.();
      window.refreshOrdersPage?.();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  const total = requests.length;
  const pending = requests.filter((request) => request.status === "Pending").length;
  const approved = requests.filter((request) => request.status === "Approved").length;

  function handleEditRequest(request) {
    setRequestForm({
      itemName: request.itemName || "",
      quantity: request.quantity || "",
      department: request.department || "",
      status: request.status || "Pending",
    });
    setEditingRequestId(request._id);
    setNextStep(false);
    document.getElementById("request-form")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleCancelEdit() {
    setRequestForm({ itemName: "", quantity: "", department: "", status: "Pending" });
    setEditingRequestId("");
  }

  return (
    <DashboardShell
      eyebrow="Request flow"
      title="Requests"
      description="Capture procurement demand with guided forms, cleaner filtering, and the same design language as the rest of the system."
      actions={
        <button
          className="dashboard-button dashboard-button--primary"
          onClick={() => document.getElementById("request-form")?.scrollIntoView({ behavior: "smooth" })}
        >
          Add request
        </button>
      }
    >
      <section className="dashboard-summary-grid dashboard-summary-grid--three">
        <article className="dashboard-stat-card"><p>Total requests</p><strong>{total}</strong><span>All procurement requests submitted so far.</span></article>
        <article className="dashboard-stat-card is-highlight"><p>Pending</p><strong>{pending}</strong><span>Requests still waiting for a decision.</span></article>
        <article className="dashboard-stat-card"><p>Approved</p><strong>{approved}</strong><span>Requests already cleared for ordering.</span></article>
      </section>

      <section className="dashboard-panels-grid dashboard-panels-grid--content">
        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Find requests</p>
              <h2>Search and filter</h2>
            </div>
            <Link href="/suppliers" className="dashboard-button dashboard-button--secondary">Back to suppliers</Link>
          </div>

          <div className="dashboard-toolbar">
            <input className="dashboard-input" placeholder="Search by item, quantity, or department" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="dashboard-input dashboard-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </article>

        <article className="dashboard-panel" id="request-form">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">{editingRequestId ? "Edit request" : "New request"}</p>
              <h2>{editingRequestId ? "Update procurement request" : "Create a procurement request"}</h2>
            </div>
          </div>

          <form className="dashboard-form-grid" onSubmit={handleSubmit}>
            <input className="dashboard-input" placeholder="Item name" value={requestForm.itemName} onChange={(e) => setRequestForm({ ...requestForm, itemName: e.target.value })} required />
            <input className="dashboard-input" type="number" placeholder="Quantity" value={requestForm.quantity} onChange={(e) => setRequestForm({ ...requestForm, quantity: e.target.value })} required />
            <input className="dashboard-input" placeholder="Department" value={requestForm.department} onChange={(e) => setRequestForm({ ...requestForm, department: e.target.value })} required />
            <select className="dashboard-input dashboard-select" value={requestForm.status} onChange={(e) => setRequestForm({ ...requestForm, status: e.target.value })}>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="dashboard-form-actions">
              <button className="dashboard-button dashboard-button--primary" type="submit">
                {editingRequestId ? "Update request" : "Save request"}
              </button>
              {editingRequestId ? (
                <button className="dashboard-button dashboard-button--secondary" type="button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          {nextStep ? (
            <div className="dashboard-inline-note">
              <p>Request created successfully. Continue into purchase order creation.</p>
              <Link href="/orders" className="dashboard-button dashboard-button--secondary">Go to orders</Link>
            </div>
          ) : null}
        </article>
      </section>

      <section className="dashboard-panel dashboard-table-panel">
        <div className="dashboard-panel__header">
          <div>
            <p className="dashboard-panel__eyebrow">Request records</p>
            <h2>Current procurement requests</h2>
          </div>
        </div>

        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => (
                <tr key={request._id}>
                  <td>{index + 1}</td>
                  <td>{request.itemName}</td>
                  <td>{request.quantity}</td>
                  <td>{request.department}</td>
                  <td>
                    <span className={`dashboard-chip ${statusColors[request.status] || "dashboard-chip--muted"}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <div className="dashboard-table-actions">
                      <button className="dashboard-icon-button" type="button" onClick={() => handleEditRequest(request)}>Edit</button>
                      <button className="dashboard-icon-button is-danger" type="button" onClick={() => deleteRequest(request._id)}>Delete</button>
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
