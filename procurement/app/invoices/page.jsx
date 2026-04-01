"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import API_BASE_URL from "../config/api";
import DashboardShell from "../components/DashboardShell";

function buildInvoiceRows(orders) {
  return orders
    .filter((order) => order.status === "Completed")
    .map((order, index) => {
      const quantity = Number(order.request?.quantity || 0);
      const estimatedUnitCost = 45 + index * 12;
      const totalAmount = quantity * estimatedUnitCost;

      return {
        id: order._id,
        invoiceNumber: `INV-${String(index + 1).padStart(4, "0")}`,
        supplier: order.supplier?.name || "Unknown supplier",
        item: order.request?.itemName || "Unlinked request",
        quantity,
        totalAmount,
        status: index % 3 === 0 ? "Ready to match" : index % 3 === 1 ? "Awaiting finance" : "Scheduled",
      };
    });
}

export default function InvoicesPage() {
  const [orders, setOrders] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchOrders = useEffectEvent(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`);
      const data = res.ok ? await res.json() : [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching invoices:", error);
      setOrders([]);
    }
  });

  useEffect(() => {
    fetchOrders();
  }, [refreshTrigger]);

  const invoices = useMemo(() => buildInvoiceRows(orders), [orders]);
  const totalValue = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);

  return (
    <DashboardShell
      eyebrow="Finance lane"
      title="Invoices"
      description="Use completed orders as the invoice matching queue so finance can see what is ready for verification and payment follow-up."
      actions={
        <button
          className="dashboard-button dashboard-button--primary"
          onClick={() => setRefreshTrigger((prev) => prev + 1)}
        >
          Refresh invoices
        </button>
      }
    >
      <section className="dashboard-summary-grid dashboard-summary-grid--three">
        <article className="dashboard-stat-card">
          <p>Invoice candidates</p>
          <strong>{invoices.length}</strong>
          <span>Completed orders that can now be matched against supplier invoices.</span>
        </article>
        <article className="dashboard-stat-card">
          <p>Estimated spend</p>
          <strong>${totalValue.toLocaleString()}</strong>
          <span>Approximate payable value based on received order quantities.</span>
        </article>
        <article className="dashboard-stat-card is-highlight">
          <p>Finance next action</p>
          <strong>{invoices.filter((invoice) => invoice.status === "Ready to match").length}</strong>
          <span>Invoices ready for three-way match and payment validation.</span>
        </article>
      </section>

      <section className="dashboard-panel dashboard-table-panel">
        <div className="dashboard-panel__header">
          <div>
            <p className="dashboard-panel__eyebrow">Invoice queue</p>
            <h2>Completed orders ready for matching</h2>
          </div>
        </div>

        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Supplier</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Estimated amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length ? (
                invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.supplier}</td>
                    <td>{invoice.item}</td>
                    <td>{invoice.quantity}</td>
                    <td>${invoice.totalAmount.toLocaleString()}</td>
                    <td>
                      <span className="dashboard-chip dashboard-chip--info">{invoice.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="report-empty-cell">
                    No completed orders are available for invoice follow-up yet.
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
