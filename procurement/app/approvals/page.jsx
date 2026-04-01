"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import API_BASE_URL from "../config/api";
import DashboardShell from "../components/DashboardShell";

const statusColors = {
  Pending: "dashboard-chip--warning",
  Approved: "dashboard-chip--success",
  Rejected: "dashboard-chip--danger",
};

export default function ApprovalsPage() {
  const [requests, setRequests] = useState([]);
  const [isSaving, setIsSaving] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchRequests = useEffectEvent(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/requests`);
      const data = res.ok ? await res.json() : [];
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching approvals:", error);
      setRequests([]);
    }
  });

  useEffect(() => {
    fetchRequests();
  }, [refreshTrigger]);

  async function updateRequestStatus(id, status) {
    setIsSaving(id + status);
    try {
      const res = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update request");
      }

      setRequests((prev) =>
        prev.map((request) => (request._id === id ? { ...request, status } : request))
      );
      window.refreshDashboard?.();
    } catch (error) {
      console.error(error);
      alert("Unable to update approval status");
    } finally {
      setIsSaving("");
    }
  }

  const metrics = useMemo(() => {
    const pending = requests.filter((request) => request.status === "Pending").length;
    const approved = requests.filter((request) => request.status === "Approved").length;
    const rejected = requests.filter((request) => request.status === "Rejected").length;

    return {
      pending,
      approved,
      rejected,
      throughput: approved + rejected,
    };
  }, [requests]);

  const pendingRequests = requests.filter((request) => request.status === "Pending");

  return (
    <DashboardShell
      eyebrow="Decision lane"
      title="Approvals"
      description="Review procurement requests before they move into purchasing, and keep approval decisions separate from request creation."
      actions={
        <button
          className="dashboard-button dashboard-button--primary"
          onClick={() => setRefreshTrigger((prev) => prev + 1)}
        >
          Refresh approvals
        </button>
      }
    >
      <section className="dashboard-summary-grid dashboard-summary-grid--three">
        <article className="dashboard-stat-card">
          <p>Pending review</p>
          <strong>{metrics.pending}</strong>
          <span>Requests still waiting for manager or procurement approval.</span>
        </article>
        <article className="dashboard-stat-card">
          <p>Approved</p>
          <strong>{metrics.approved}</strong>
          <span>Requests cleared and ready to move into purchase ordering.</span>
        </article>
        <article className="dashboard-stat-card is-highlight">
          <p>Closed decisions</p>
          <strong>{metrics.throughput}</strong>
          <span>Requests already resolved through approval or rejection.</span>
        </article>
      </section>

      <section className="dashboard-panels-grid dashboard-panels-grid--content">
        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Approval guide</p>
              <h2>Recommended workflow</h2>
            </div>
          </div>

          <div className="workflow-stage-list">
            <div className="workflow-stage-card is-static">
              <div className="workflow-stage-card__top">
                <p>1. Submit request</p>
                <span className="dashboard-chip dashboard-chip--muted">Requester</span>
              </div>
              <small>Capture item, quantity, and department need in the requests module.</small>
            </div>
            <div className="workflow-stage-card is-static">
              <div className="workflow-stage-card__top">
                <p>2. Approve or reject</p>
                <span className="dashboard-chip dashboard-chip--warning">Approver</span>
              </div>
              <small>Only approved requests should move forward into supplier ordering.</small>
            </div>
            <div className="workflow-stage-card is-static">
              <div className="workflow-stage-card__top">
                <p>3. Convert to PO</p>
                <span className="dashboard-chip dashboard-chip--success">Procurement</span>
              </div>
              <small>Approved requests become purchase orders in the orders module.</small>
            </div>
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Queue health</p>
              <h2>Decision status</h2>
            </div>
          </div>

          <div className="dashboard-activity-list">
            <div className="dashboard-activity-row">
              <span className="activity-dot dot-amber" />
              <div>
                <p>Pending requests need review</p>
                <small>{metrics.pending} items are currently blocking the next procurement step</small>
              </div>
            </div>
            <div className="dashboard-activity-row">
              <span className="activity-dot dot-green" />
              <div>
                <p>Approved requests can move to orders</p>
                <small>{metrics.approved} requests are ready for purchase order creation</small>
              </div>
            </div>
            <div className="dashboard-activity-row">
              <span className="activity-dot dot-cyan" />
              <div>
                <p>Rejected requests need rework</p>
                <small>{metrics.rejected} requests should be corrected before resubmission</small>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="dashboard-panel dashboard-table-panel">
        <div className="dashboard-panel__header">
          <div>
            <p className="dashboard-panel__eyebrow">Approval queue</p>
            <h2>Requests awaiting decision</h2>
          </div>
        </div>

        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.length ? (
                pendingRequests.map((request) => (
                  <tr key={request._id}>
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
                        <button
                          className="dashboard-icon-button"
                          type="button"
                          disabled={Boolean(isSaving)}
                          onClick={() => updateRequestStatus(request._id, "Approved")}
                        >
                          {isSaving === request._id + "Approved" ? "Saving..." : "Approve"}
                        </button>
                        <button
                          className="dashboard-icon-button is-danger"
                          type="button"
                          disabled={Boolean(isSaving)}
                          onClick={() => updateRequestStatus(request._id, "Rejected")}
                        >
                          {isSaving === request._id + "Rejected" ? "Saving..." : "Reject"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="report-empty-cell">
                    No pending approvals right now.
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
