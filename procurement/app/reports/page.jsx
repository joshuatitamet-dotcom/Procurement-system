"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import API_BASE_URL from "../config/api";
import DashboardShell from "../components/DashboardShell";

const statusChipMap = {
  Pending: "dashboard-chip--warning",
  Approved: "dashboard-chip--info",
  Completed: "dashboard-chip--success",
  Cancelled: "dashboard-chip--danger",
  Rejected: "dashboard-chip--danger"
};

const emptyReport = {
  summary: {
    totalSuppliers: 0,
    totalRequests: 0,
    totalOrders: 0,
    pendingRequests: 0,
    completedOrders: 0,
    approvedRequests: 0
  },
  requestsByStatus: [],
  ordersByStatus: [],
  requestsByDepartment: [],
  recentOrders: [],
  databaseConnected: false
};

function StatusBarChart({ data, total, loading, emptyLabel }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const chartHeight = 220;
  const chartWidth = 420;
  const barWidth = data.length ? chartWidth / data.length - 18 : 0;

  if (!data.length) {
    return <p className="report-empty">{loading ? "Loading chart..." : emptyLabel}</p>;
  }

  return (
    <div className="report-chart-block">
      <svg
        className="report-svg-chart"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        role="img"
        aria-label="Requests by status bar chart"
      >
        <defs>
          <linearGradient id="reportBarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#163544" />
            <stop offset="100%" stopColor="#1f8a70" />
          </linearGradient>
        </defs>
        {data.map((item, index) => {
          const height = Math.max((item.value / maxValue) * 150, 18);
          const x = index * (barWidth + 18) + 10;
          const y = chartHeight - height - 32;

          return (
            <g key={item.label}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={height}
                rx="16"
                className="report-svg-bar"
              />
              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" className="report-svg-value">
                {item.value}
              </text>
              <text x={x + barWidth / 2} y={chartHeight - 10} textAnchor="middle" className="report-svg-label">
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="report-bars">
        {data.map((item) => (
          <div className="report-bar-row" key={`request-${item.label}`}>
            <div className="report-bar-row__labels">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
            <div className="report-bar-track">
              <div
                className="report-bar-fill"
                style={{
                  width: `${Math.max((item.value / Math.max(total || 1, 1)) * 100, 12)}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ data, loading, emptyLabel }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ["#163544", "#1f8a70", "#ef7f45", "#2f9db6", "#d64646"];
  const segments = data.reduce((acc, item) => {
    const previousEnd = acc.length ? acc[acc.length - 1].endValue : 0;
    acc.push({
      ...item,
      startValue: previousEnd,
      endValue: previousEnd + item.value
    });
    return acc;
  }, []);

  if (!data.length) {
    return <p className="report-empty">{loading ? "Loading chart..." : emptyLabel}</p>;
  }

  return (
    <div className="report-donut-layout">
      <svg viewBox="0 0 220 220" className="report-donut-svg" role="img" aria-label="Orders by status donut chart">
        {segments.map((item, index) => {
          const startAngle = (item.startValue / total) * Math.PI * 2 - Math.PI / 2;
          const endAngle = (item.endValue / total) * Math.PI * 2 - Math.PI / 2;

          const outerRadius = 88;
          const innerRadius = 54;
          const x1 = 110 + outerRadius * Math.cos(startAngle);
          const y1 = 110 + outerRadius * Math.sin(startAngle);
          const x2 = 110 + outerRadius * Math.cos(endAngle);
          const y2 = 110 + outerRadius * Math.sin(endAngle);
          const x3 = 110 + innerRadius * Math.cos(endAngle);
          const y3 = 110 + innerRadius * Math.sin(endAngle);
          const x4 = 110 + innerRadius * Math.cos(startAngle);
          const y4 = 110 + innerRadius * Math.sin(startAngle);
          const largeArc = item.value / total > 0.5 ? 1 : 0;

          const path = [
            `M ${x1} ${y1}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
            "Z"
          ].join(" ");

          return <path key={item.label} d={path} fill={colors[index % colors.length]} />;
        })}

        <circle cx="110" cy="110" r="42" fill="rgba(255,255,255,0.96)" />
        <text x="110" y="104" textAnchor="middle" className="report-svg-value">{total}</text>
        <text x="110" y="126" textAnchor="middle" className="report-svg-label">orders</text>
      </svg>

      <div className="report-donut-legend">
        {data.map((item, index) => (
          <div className="report-legend-row" key={`legend-${item.label}`}>
            <span
              className="report-legend-swatch"
              style={{ background: colors[index % colors.length] }}
            />
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [report, setReport] = useState(emptyReport);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchReportsData = useEffectEvent(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/reports`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const payload = await res.json();
      setReport({
        ...emptyReport,
        ...payload,
        summary: { ...emptyReport.summary, ...(payload.summary || {}) }
      });
    } catch (error) {
      console.log("Error fetching reports data:", error);
      setReport(emptyReport);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchReportsData();
  }, [refreshTrigger]);

  const largestDepartmentValue = useMemo(() => {
    return report.requestsByDepartment.reduce((max, item) => Math.max(max, item.value), 0);
  }, [report.requestsByDepartment]);

  return (
    <DashboardShell
      eyebrow="Analytics"
      title="Reports"
      description="View processed procurement data as summary cards, charts, and recent activity lists to understand how the system is performing."
      actions={
        <button
          className="dashboard-button dashboard-button--primary"
          onClick={() => setRefreshTrigger((prev) => prev + 1)}
        >
          Refresh report
        </button>
      }
    >
      <section className="dashboard-summary-grid">
        <article className="dashboard-stat-card">
          <p>Total suppliers</p>
          <strong>{report.summary.totalSuppliers}</strong>
          <span>Registered supplier records feeding procurement operations.</span>
        </article>
        <article className="dashboard-stat-card">
          <p>Total requests</p>
          <strong>{report.summary.totalRequests}</strong>
          <span>All procurement requests captured by the backend.</span>
        </article>
        <article className="dashboard-stat-card">
          <p>Total orders</p>
          <strong>{report.summary.totalOrders}</strong>
          <span>Orders created from approved procurement activity.</span>
        </article>
        <article className="dashboard-stat-card is-highlight">
          <p>Completed orders</p>
          <strong>{report.summary.completedOrders}</strong>
          <span>Orders that have fully moved through the process.</span>
        </article>
      </section>

      <section className="dashboard-panels-grid dashboard-panels-grid--content">
        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Request chart</p>
              <h2>Requests by status</h2>
            </div>
            <span className="dashboard-chip dashboard-chip--info">
              {report.summary.pendingRequests} pending
            </span>
          </div>

          <div className="report-bars">
            <StatusBarChart
              data={report.requestsByStatus}
              total={report.summary.totalRequests}
              loading={loading}
              emptyLabel="No request status data available."
            />
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Order chart</p>
              <h2>Orders by status</h2>
            </div>
            <span className="dashboard-chip dashboard-chip--success">
              {report.summary.completedOrders} completed
            </span>
          </div>

          <DonutChart
            data={report.ordersByStatus}
            loading={loading}
            emptyLabel="No order status data available."
          />
        </article>
      </section>

      <section className="dashboard-panels-grid dashboard-panels-grid--content">
        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Department demand</p>
              <h2>Requests by department</h2>
            </div>
            <span className="dashboard-chip dashboard-chip--warning">
              {report.summary.approvedRequests} approved
            </span>
          </div>

          <div className="report-department-list">
            {report.requestsByDepartment.length ? (
              report.requestsByDepartment.map((item) => (
                <div className="report-department-row" key={`department-${item.label}`}>
                  <div className="report-department-row__labels">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                  <div className="report-department-row__track">
                    <div
                      className="report-department-row__fill"
                      style={{
                        width: `${Math.max((item.value / Math.max(largestDepartmentValue, 1)) * 100, 14)}%`
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="report-empty">{loading ? "Loading departments..." : "No department data available."}</p>
            )}
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">System health</p>
              <h2>Report status</h2>
            </div>
          </div>

          <div className="dashboard-activity-list">
            <div className="dashboard-activity-row">
              <span className={`activity-dot ${report.databaseConnected ? "dot-green" : "dot-amber"}`} />
              <div>
                <p>Database connectivity</p>
                <small>{report.databaseConnected ? "Connected and ready for live reporting" : "Backend is running without database access"}</small>
              </div>
            </div>
            <div className="dashboard-activity-row">
              <span className="activity-dot dot-cyan" />
              <div>
                <p>Report refresh</p>
                <small>{loading ? "Fetching latest processed values" : "Latest report payload loaded successfully"}</small>
              </div>
            </div>
            <div className="dashboard-activity-row">
              <span className="activity-dot dot-amber" />
              <div>
                <p>Active workload</p>
                <small>{report.summary.pendingRequests} requests still need action before ordering</small>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="dashboard-panel dashboard-table-panel">
        <div className="dashboard-panel__header">
          <div>
            <p className="dashboard-panel__eyebrow">Recent list</p>
            <h2>Recent purchase orders</h2>
          </div>
        </div>

        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Item</th>
                <th>Department</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {report.recentOrders.length ? (
                report.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.supplier}</td>
                    <td>{order.item}</td>
                    <td>{order.department}</td>
                    <td>{order.quantity}</td>
                    <td>
                      <span className={`dashboard-chip ${statusChipMap[order.status] || "dashboard-chip--muted"}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="report-empty-cell">
                    {loading ? "Loading recent orders..." : "No recent order data available."}
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
