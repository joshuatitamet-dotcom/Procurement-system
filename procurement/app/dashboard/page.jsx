"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import Link from "next/link";
import API_BASE_URL from "../config/api";
import DashboardShell from "../components/DashboardShell";

const emptyData = {
  suppliers: [],
  requests: [],
  orders: [],
};

export default function Dashboard() {
  const [data, setData] = useState(emptyData);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchDashboardData = useEffectEvent(async () => {
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

      setData({
        suppliers: Array.isArray(suppliers) ? suppliers : [],
        requests: Array.isArray(requests) ? requests : [],
        orders: Array.isArray(orders) ? orders : [],
      });
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
      setData(emptyData);
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

  const metrics = useMemo(() => {
    const totalSuppliers = data.suppliers.length;
    const activeSuppliers = data.suppliers.filter((supplier) => supplier.status === "Active").length;
    const totalRequests = data.requests.length;
    const pendingApprovals = data.requests.filter((request) => request.status === "Pending").length;
    const approvedRequests = data.requests.filter((request) => request.status === "Approved").length;
    const rejectedRequests = data.requests.filter((request) => request.status === "Rejected").length;
    const totalOrders = data.orders.length;
    const pendingOrders = data.orders.filter((order) => order.status === "Pending").length;
    const approvedOrders = data.orders.filter((order) => order.status === "Approved").length;
    const completedOrders = data.orders.filter((order) => order.status === "Completed").length;
    const invoicesToMatch = completedOrders;
    const fulfillmentRate = totalOrders ? Math.round((completedOrders / totalOrders) * 100) : 0;

    return {
      totalSuppliers,
      activeSuppliers,
      totalRequests,
      pendingApprovals,
      approvedRequests,
      rejectedRequests,
      totalOrders,
      pendingOrders,
      approvedOrders,
      completedOrders,
      invoicesToMatch,
      fulfillmentRate,
    };
  }, [data]);

  const workflowStages = [
    {
      label: "Supplier base",
      value: metrics.totalSuppliers,
      helper: `${metrics.activeSuppliers} active suppliers ready for sourcing`,
      tone: "dashboard-chip--success",
      href: "/suppliers",
    },
    {
      label: "Requests raised",
      value: metrics.totalRequests,
      helper: `${metrics.pendingApprovals} requests still need approval review`,
      tone: "dashboard-chip--warning",
      href: "/requests",
    },
    {
      label: "Approvals cleared",
      value: metrics.approvedRequests,
      helper: `${metrics.rejectedRequests} rejected requests need rework`,
      tone: "dashboard-chip--info",
      href: "/approvals",
    },
    {
      label: "Orders issued",
      value: metrics.totalOrders,
      helper: `${metrics.pendingOrders} orders still open in the purchasing lane`,
      tone: "dashboard-chip--muted",
      href: "/orders",
    },
    {
      label: "Deliveries closed",
      value: metrics.completedOrders,
      helper: `${metrics.invoicesToMatch} completed orders now ready for invoice matching`,
      tone: "dashboard-chip--success",
      href: "/receiving",
    },
  ];

  const actionCards = [
    {
      title: "Review approvals",
      detail: `${metrics.pendingApprovals} requests are waiting for a decision before purchasing can proceed.`,
      href: "/approvals",
      action: "Open approvals",
    },
    {
      title: "Issue purchase orders",
      detail: `${metrics.approvedRequests} approved requests can be converted into supplier orders.`,
      href: "/orders",
      action: "Create order",
    },
    {
      title: "Match completed deliveries",
      detail: `${metrics.invoicesToMatch} completed orders are ready for receiving and invoice follow-up.`,
      href: "/invoices",
      action: "Track invoices",
    },
  ];

  return (
    <DashboardShell
      eyebrow="Control tower"
      title="Procurement Workflow"
      description="Track the full journey from supplier readiness to request approval, ordering, delivery, invoicing, and reporting from one command view."
      actions={
        <div className="dashboard-header__actions">
          <Link href="/requests" className="dashboard-button dashboard-button--secondary">
            New request
          </Link>
          <Link href="/orders" className="dashboard-button dashboard-button--primary">
            Create order
          </Link>
        </div>
      }
    >
      <section className="dashboard-summary-grid">
        <article className="dashboard-stat-card">
          <p>Suppliers ready</p>
          <strong>{metrics.activeSuppliers}</strong>
          <span>Approved supplier records available for sourcing and ordering.</span>
        </article>

        <article className="dashboard-stat-card">
          <p>Approval queue</p>
          <strong>{metrics.pendingApprovals}</strong>
          <span>Requests waiting for manager or procurement review.</span>
        </article>

        <article className="dashboard-stat-card">
          <p>Open orders</p>
          <strong>{metrics.pendingOrders + metrics.approvedOrders}</strong>
          <span>Purchase orders still moving through supply and delivery.</span>
        </article>

        <article className="dashboard-stat-card is-highlight">
          <p>Fulfillment rate</p>
          <strong>{metrics.fulfillmentRate}%</strong>
          <span>Share of total orders that have already been completed.</span>
        </article>
      </section>

      <section className="dashboard-panels-grid">
        <article className="dashboard-panel dashboard-panel--hero">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Pipeline view</p>
              <h2>Workflow stages stay visible from request to payment.</h2>
            </div>
            <span className="dashboard-chip dashboard-chip--success">Live workflow</span>
          </div>

          <div className="dashboard-wave">
            <div className="dashboard-wave__layer dashboard-wave__layer--one" />
            <div className="dashboard-wave__layer dashboard-wave__layer--two" />
            <div className="dashboard-wave__copy">
              <p>Operational flow</p>
              <strong>{metrics.totalRequests + metrics.totalOrders}</strong>
              <span>requests and orders currently tracked across the system</span>
            </div>
          </div>

          <div className="workflow-stage-list">
            {workflowStages.map((stage) => (
              <Link className="workflow-stage-card" href={stage.href} key={stage.label}>
                <div className="workflow-stage-card__top">
                  <p>{stage.label}</p>
                  <span className={`dashboard-chip ${stage.tone}`}>{stage.value}</span>
                </div>
                <small>{stage.helper}</small>
              </Link>
            ))}
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Priority lane</p>
              <h2>What procurement should do next</h2>
            </div>
          </div>

          <div className="dashboard-activity-list">
            <div className="dashboard-activity-row">
              <span className="activity-dot dot-green" />
              <div>
                <p>Supplier pool is available</p>
                <small>{metrics.activeSuppliers} active suppliers can support new requests</small>
              </div>
            </div>
            <div className="dashboard-activity-row">
              <span className="activity-dot dot-amber" />
              <div>
                <p>Approvals need attention</p>
                <small>{metrics.pendingApprovals} requests are blocked until review is complete</small>
              </div>
            </div>
            <div className="dashboard-activity-row">
              <span className="activity-dot dot-cyan" />
              <div>
                <p>Delivery and invoice follow-up</p>
                <small>{metrics.invoicesToMatch} completed orders are ready for matching and closeout</small>
              </div>
            </div>
          </div>

          <div className="dashboard-action-stack">
            {actionCards.map((card) => (
              <Link key={card.title} href={card.href} className="dashboard-action-card">
                <p>{card.title}</p>
                <span>{card.detail}</span>
                <strong>{card.action}</strong>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}
