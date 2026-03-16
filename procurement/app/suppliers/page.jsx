"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
  });

  // LOAD suppliers from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/suppliers")
      .then((res) => res.json())
      .then((data) => setSuppliers(data))
      .catch((err) => console.log(err));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/suppliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuppliers([...suppliers, data.supplier]);

        setForm({
          name: "",
          email: "",
          phone: "",
          status: "Active",
        });
        if(res.ok){

   alert("Supplier added successfully");

   window.location.href="/requests";
}
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server error");
    }
  }

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Suppliers</h1>
      <p>Register and manage suppliers</p>

    

      {/* Add Supplier Form */}
      <form onSubmit={handleSubmit} style={formStyle}>
        <h3>Add Supplier</h3>

        <input
          style={inputStyle}
          type="text"
          name="name"
          placeholder="Company Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={inputStyle}
        >
          <option>Active</option>
          <option>Pending</option>
        </select>

        <button style={btnPrimary}>Add Supplier</button>
      </form>

      {/* Suppliers Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 30 }}>
        <thead>
          <tr style={{ background: "#111", color: "#fff" }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Company</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.map((s, i) => (
            <tr key={s._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={tdStyle}>{i + 1}</td>
              <td style={tdStyle}>{s.name}</td>
              <td style={tdStyle}>{s.email}</td>
              <td style={tdStyle}>{s.phone}</td>
              <td style={tdStyle}>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const formStyle = {
  marginTop: 20,
  padding: 20,
  border: "1px solid #ddd",
  borderRadius: 10,
  maxWidth: 500,
};

const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const btnPrimary = {
  padding: "10px 18px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  background: "#111",
  color: "#fff",
};

const thStyle = { padding: 10, textAlign: "left" };
const tdStyle = { padding: 10 };
