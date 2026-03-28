"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import API_BASE_URL from "../config/api";

const statusColors = {
  Active: { background: "#16a34a", color: "#fff" },
  Inactive: { background: "#ef4444", color: "#fff" },
  Pending: { background: "#f97316", color: "#fff" }
};

export default function SuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [supplierForm, setSupplierForm] = useState({ name: "", email: "", phone: "", status: "Active" });
  const [nextStep, setNextStep] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/suppliers`)
      .then((res) => res.json())
      .then((data) => setSuppliers(data))
      .catch((err) => console.log(err));
  }, []);

  const filteredSuppliers = useMemo(() => {
    return suppliers
      .filter((s) => {
        const text = `${s.name} ${s.email} ${s.phone}`.toLowerCase();
        const matchesSearch = text.includes(search.toLowerCase());
        const matchesStatus = statusFilter === "All" || s.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
  }, [suppliers, search, statusFilter]);

  async function deleteSupplier(id) {
    if (!confirm("Delete this supplier?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/suppliers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuppliers((prev) => prev.filter((s) => s._id !== id));
        // Refresh dashboard data
        if (window.refreshDashboard) {
          window.refreshDashboard();
        }
      } else {
        alert("Failed to delete supplier");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to delete supplier");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!supplierForm.name || !supplierForm.email || !supplierForm.phone) return;

    try {
      const res = await fetch("http://localhost:5000/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Supplier creation failed");
      setSuppliers((prev) => [data.supplier || data, ...prev]);
      setSupplierForm({ name: "", email: "", phone: "", status: "Active" });
      setNextStep(true);
      alert("Supplier added");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  const total = suppliers.length;
  const active = suppliers.filter((s) => s.status === "Active").length;
  const inactive = suppliers.filter((s) => s.status === "Inactive").length;

  return (
    <div style={pageContainer}>
      <div style={panelBackground}></div>

      <section style={headerSection}>
        <div>
          <h1>Suppliers</h1>
          <p>Manage your vendors</p>
          <button style={navButton} onClick={() => router.push('/dashboard')}>← Dashboard</button>
        </div>
        <button style={primaryButton} onClick={() => document.getElementById("supplier-form").scrollIntoView({ behavior: "smooth" })}>+ Add Supplier</button>
      </section>

      <section style={statsRow}>
        <div style={statCard}> <h4>Total Suppliers</h4><strong>{total}</strong></div>
        <div style={statCard}> <h4>Active</h4><strong>{active}</strong></div>
        <div style={statCard}> <h4>Inactive</h4><strong>{inactive}</strong></div>
      </section>

      <section style={filterRow}>
        <input style={searchInput} placeholder="🔍 Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select style={selectInput} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
        </select>
      </section>

      <section id="supplier-form" style={formSection}>
        <form onSubmit={handleSubmit} style={formContainer}>
          <h3>Add Supplier</h3>
          <input style={inputStyle} placeholder="Company Name" value={supplierForm.name} onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })} required />
          <input style={inputStyle} type="email" placeholder="Email" value={supplierForm.email} onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })} required />
          <input style={inputStyle} placeholder="Phone" value={supplierForm.phone} onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })} required />
          <select style={inputStyle} value={supplierForm.status} onChange={(e) => setSupplierForm({ ...supplierForm, status: e.target.value })}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
          <button style={primaryButton} type="submit">Save Supplier</button>
        </form>
        {nextStep && (
          <div style={nextBox}>
            <p>Supplier created successfully! Click Next to add requests.</p>
            <button style={nextButton} onClick={() => router.push('/requests')}>Next →</button>
          </div>
        )}
      </section>

      <section style={tableWrap}>
        <table style={tableStyle}>
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
            {filteredSuppliers.map((s, idx) => (
              <tr key={s._id} style={rowStyle}>
                <td>{idx + 1}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td><span style={{ ...statusChip, ...statusColors[s.status] }} >{s.status}</span></td>
                <td>
                  <button style={iconButton} title="Edit">✏️</button>
                  <button style={iconButton} title="Delete" onClick={() => deleteSupplier(s._id)}>🗑️</button>
                  <button style={iconButton} title="View">👁️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

const pageContainer = { position: "relative", minHeight: "100vh", padding: "24px 32px", fontFamily: "Inter, sans-serif", color: "#0f172a", background: "linear-gradient(135deg, #eef2ff 30%, #f8fafc 100%)" };
const panelBackground = { position: "absolute", inset: 0, zIndex: -1, backgroundImage: "linear-gradient(135deg, rgba(34, 197, 94, .12), rgba(14, 165, 233, .12)), url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.18 };
const headerSection = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 };
const primaryButton = { padding: "10px 18px", borderRadius: 10, border: "none", background: "#2563eb", color: "white", cursor: "pointer", fontWeight: 700, boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)", transition: "transform .2s" };
const statsRow = { display: "flex", gap: 12, marginBottom: 16 };
const statCard = { flex: 1, background: "white", borderRadius: 14, padding: 18, boxShadow: "0 12px 18px rgba(15, 23, 42, 0.08)", transition: "transform .25s", cursor: "default" };
const filterRow = { display: "flex", gap: 12, alignItems: "center", marginBottom: 14 };
const searchInput = { flex: 1, padding: 10, borderRadius: 10, border: "1px solid #cbd5e1" };
const selectInput = { padding: 10, borderRadius: 10, border: "1px solid #cbd5e1" };
const formSection = { marginBottom: 20 };
const formContainer = { display: "grid", gap: 10, padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.87)", boxShadow: "0 10px 20px rgba(15,23,42,0.08)" };
const inputStyle = { padding: 10, borderRadius: 10, border: "1px solid #cbd5e1" };
const tableWrap = { background: "white", borderRadius: 12, padding: 14, boxShadow: "0 10px 20px rgba(15, 23, 42, 0.08)", overflowX: "auto" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const rowStyle = { transition: "background .2s", cursor: "pointer" };
const statusChip = { padding: "4px 10px", borderRadius: 999, fontWeight: 700 };
const iconButton = { marginRight: 8, border: "none", borderRadius: 8, padding: "5px 7px", cursor: "pointer", background: "#e2e8f0" };
const navButton = { marginTop: 10, padding: "6px 10px", borderRadius: 8, border: "1px solid #93c5fd", background: "#dbeafe", color: "#1e40af", cursor: "pointer", fontWeight: 600 };
const nextBox = { marginTop: 12, padding: 12, borderRadius: 10, background: "#f8fafc", border: "1px solid #93c5fd", display: "flex", justifyContent: "space-between", alignItems: "center" };
const nextButton = { padding: "8px 14px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontWeight: 700 };

// apply hover effects via js by extra class not possible in inline styles; keep simple

