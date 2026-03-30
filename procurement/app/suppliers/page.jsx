"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import Link from "next/link";
import API_BASE_URL from "../config/api";
import DashboardShell from "../components/DashboardShell";

const statusColors = {
  Active: "dashboard-chip--success",
  Inactive: "dashboard-chip--danger",
  Pending: "dashboard-chip--warning",
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [supplierForm, setSupplierForm] = useState({ name: "", email: "", phone: "", status: "Active" });
  const [nextStep, setNextStep] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchSuppliersData = useEffectEvent(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/suppliers`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching suppliers:", error);
      setSuppliers([]);
    }
  });

  useEffect(() => {
    fetchSuppliersData();
  }, [refreshTrigger]);

  useEffect(() => {
    window.refreshSuppliersPage = () => {
      setRefreshTrigger((prev) => prev + 1);
    };
  }, []);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const text = `${supplier.name} ${supplier.email} ${supplier.phone}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || supplier.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [suppliers, search, statusFilter]);

  async function deleteSupplier(id) {
    if (!confirm("Delete this supplier?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/suppliers/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete supplier");
      }
      setSuppliers((prev) => prev.filter((supplier) => supplier._id !== id));
      window.refreshDashboard?.();
    } catch (error) {
      console.error(error);
      alert("Unable to delete supplier");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!supplierForm.name || !supplierForm.email || !supplierForm.phone) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierForm),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Supplier creation failed");
      }
      setSuppliers((prev) => [data.supplier || data, ...prev]);
      setSupplierForm({ name: "", email: "", phone: "", status: "Active" });
      setNextStep(true);
      window.refreshDashboard?.();
      window.refreshOrdersPage?.();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  const total = suppliers.length;
  const active = suppliers.filter((supplier) => supplier.status === "Active").length;
  const inactive = suppliers.filter((supplier) => supplier.status === "Inactive").length;

  return (
    <DashboardShell
      eyebrow="Vendor management"
      title="Suppliers"
      description="Manage supplier records with the same clean flow, glass panels, and guided actions used across the platform."
      actions={
        <button
          className="dashboard-button dashboard-button--primary"
          onClick={() => document.getElementById("supplier-form")?.scrollIntoView({ behavior: "smooth" })}
        >
          Add supplier
        </button>
      }
    >
      <section className="dashboard-summary-grid dashboard-summary-grid--three">
        <article className="dashboard-stat-card"><p>Total suppliers</p><strong>{total}</strong><span>All vendor records in the workspace.</span></article>
        <article className="dashboard-stat-card"><p>Active</p><strong>{active}</strong><span>Suppliers currently available for procurement.</span></article>
        <article className="dashboard-stat-card"><p>Inactive</p><strong>{inactive}</strong><span>Records paused from current workflows.</span></article>
      </section>

      <section className="dashboard-panels-grid dashboard-panels-grid--content">
        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Find records</p>
              <h2>Filter supplier data</h2>
            </div>
            <Link href="/dashboard" className="dashboard-button dashboard-button--secondary">Back to dashboard</Link>
          </div>

          <div className="dashboard-toolbar">
            <input
              className="dashboard-input"
              placeholder="Search by company, email, or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="dashboard-input dashboard-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </article>

        <article className="dashboard-panel" id="supplier-form">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">New supplier</p>
              <h2>Add supplier profile</h2>
            </div>
          </div>

          <form className="dashboard-form-grid" onSubmit={handleSubmit}>
            <input className="dashboard-input" placeholder="Company name" value={supplierForm.name} onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })} required />
            <input className="dashboard-input" type="email" placeholder="Email" value={supplierForm.email} onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })} required />
            <input className="dashboard-input" placeholder="Phone" value={supplierForm.phone} onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })} required />
            <select className="dashboard-input dashboard-select" value={supplierForm.status} onChange={(e) => setSupplierForm({ ...supplierForm, status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
            <button className="dashboard-button dashboard-button--primary" type="submit">Save supplier</button>
          </form>

          {nextStep ? (
            <div className="dashboard-inline-note">
              <p>Supplier created successfully. Continue into the request workflow.</p>
              <Link href="/requests" className="dashboard-button dashboard-button--secondary">Go to requests</Link>
            </div>
          ) : null}
        </article>
      </section>

      <section className="dashboard-panel dashboard-table-panel">
        <div className="dashboard-panel__header">
          <div>
            <p className="dashboard-panel__eyebrow">Supplier records</p>
            <h2>Current vendor list</h2>
          </div>
        </div>

        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier, index) => (
                <tr key={supplier._id}>
                  <td>{index + 1}</td>
                  <td>{supplier.name}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td>
                    <span className={`dashboard-chip ${statusColors[supplier.status] || "dashboard-chip--muted"}`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td>
                    <div className="dashboard-table-actions">
                      <button className="dashboard-icon-button" type="button">Edit</button>
                      <button className="dashboard-icon-button is-danger" type="button" onClick={() => deleteSupplier(supplier._id)}>Delete</button>
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
