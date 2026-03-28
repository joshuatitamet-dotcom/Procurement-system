"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const statusColors = {
  Pending: { background: "#f97316", color: "#fff" },
  Approved: { background: "#16a34a", color: "#fff" },
  Rejected: { background: "#ef4444", color: "#fff" }
};

export default function RequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [requestForm, setRequestForm] = useState({ itemName: "", quantity: "", department: "", status: "Pending" });
  const [nextStep, setNextStep] = useState(false);

  useEffect(() => {
    fetch("https://procurement-system-2.onrender.com/api/dashboard")
    fetch("/api/requests")
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.log(err));
  }, []);

  const filteredRequests = useMemo(() => {
    return requests
      .filter((r) => {
        const text = `${r.itemName} ${r.quantity} ${r.department}`.toLowerCase();
        const matchesSearch = text.includes(search.toLowerCase());
        const matchesStatus = statusFilter === "All" || r.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
  }, [requests, search, statusFilter]);

  async function deleteRequest(id) {
    if (!confirm("Delete this request?")) return;
    try {
      await fetch(`http://localhost:5000/api/requests/${id}`, { method: "DELETE" });
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      console.error(error);
      alert("Unable to delete request");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!requestForm.itemName || !requestForm.quantity || !requestForm.department) return;
    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request creation failed");
      setRequests((prev) => [data.request || data, ...prev]);
      setRequestForm({ itemName: "", quantity: "", department: "", status: "Pending" });
      setNextStep(true);
      alert("Request added");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  const total = requests.length;
  const pending = requests.filter((r) => r.status === "Pending").length;
  const approved = requests.filter((r) => r.status === "Approved").length;

  return (
    <div style={pageContainer}>
      <div style={panelBackground}></div>

      <section style={headerSection}>
        <div>
          <h1>Procurement Requests</h1>
          <p>Manage your requests</p>
          <button style={navButton} onClick={() => router.push('/suppliers')}>← Suppliers</button>
        </div>
        <button style={primaryButton} onClick={() => document.getElementById("request-form").scrollIntoView({ behavior: "smooth" })}>+ Add Request</button>
      </section>

      <section style={statsRow}>
        <div style={statCard}> <h4>Total Requests</h4><strong>{total}</strong></div>
        <div style={statCard}> <h4>Pending</h4><strong>{pending}</strong></div>
        <div style={statCard}> <h4>Approved</h4><strong>{approved}</strong></div>
      </section>

      <section style={filterRow}>
        <input style={searchInput} placeholder="🔍 Search requests..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select style={selectInput} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </section>

      <section id="request-form" style={formSection}>
        <form onSubmit={handleSubmit} style={formContainer}>
          <h3>Add Request</h3>
          <input style={inputStyle} placeholder="Item Name" value={requestForm.itemName} onChange={(e) => setRequestForm({ ...requestForm, itemName: e.target.value })} required />
          <input style={inputStyle} type="number" placeholder="Quantity" value={requestForm.quantity} onChange={(e) => setRequestForm({ ...requestForm, quantity: e.target.value })} required />
          <input style={inputStyle} placeholder="Department" value={requestForm.department} onChange={(e) => setRequestForm({ ...requestForm, department: e.target.value })} required />
          <select style={inputStyle} value={requestForm.status} onChange={(e) => setRequestForm({ ...requestForm, status: e.target.value })}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button style={primaryButton} type="submit">Save Request</button>
        </form>
        {nextStep && (
          <div style={nextBox}>
            <p>Request created successfully! Click Next to create an order.</p>
            <button style={nextButton} onClick={() => router.push('/orders')}>Next →</button>
          </div>
        )}
      </section>

      <section style={tableWrap}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((r, idx) => (
              <tr key={r._id} style={rowStyle}>
                <td>{idx + 1}</td>
                <td>{r.itemName}</td>
                <td>{r.quantity}</td>
                <td>{r.department}</td>
                <td><span style={{ ...statusChip, ...statusColors[r.status] }} >{r.status}</span></td>
                <td>
                  <button style={iconButton} title="Edit">✏️</button>
                  <button style={iconButton} title="Delete" onClick={() => deleteRequest(r._id)}>🗑️</button>
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