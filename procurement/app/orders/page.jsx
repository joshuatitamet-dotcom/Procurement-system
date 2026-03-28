"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API_BASE_URL from "../config/api";

export default function OrdersPage() {

  const router = useRouter();

  const [orders,setOrders] = useState([]);
  const [suppliers,setSuppliers] = useState([]);
  const [requests,setRequests] = useState([]);

  const [search,setSearch] = useState("");

  const [form,setForm] = useState({
    supplier:"",
    request:""
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchOrdersData = async () => {
    try {
      // Fetch orders
      const ordersRes = await fetch(`${API_BASE_URL}/api/orders`);
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      }

      // Fetch suppliers
      const suppliersRes = await fetch(`${API_BASE_URL}/api/suppliers`);
      if (suppliersRes.ok) {
        const suppliersData = await suppliersRes.json();
        setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
      }

      // Fetch requests
      const requestsRes = await fetch(`${API_BASE_URL}/api/requests`);
      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setRequests(Array.isArray(requestsData) ? requestsData : []);
      }
    } catch (err) {
      console.log('Error fetching data:', err);
    }
  };

  async function deleteOrder(id) {
    if (!confirm("Delete this order?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        // Remove order from UI
        setOrders(prev => prev.filter(o => o._id !== id));
        alert("Order deleted successfully");

        // Refresh dashboard data
        if (window.refreshDashboard) {
          window.refreshDashboard();
        }
      } else {
        alert("Failed to delete order");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  }
async function handleComplete(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: "Completed" })
    });

    if (res.ok) {
      alert("Order Completed");

      // update UI instantly
      setOrders(prev =>
        prev.map(o =>
          o._id === id ? { ...o, status: "Completed" } : o
        )
      );

      // Refresh dashboard data
      if (window.refreshDashboard) {
        window.refreshDashboard();
      }

    } else {
      alert("Failed to update order");
    }

  } catch (err) {
    console.log(err);
    alert("Server error");
  }
}

  useEffect(() => {
    fetchOrdersData();
  }, [refreshTrigger]);

  // Function to refresh data (can be called after navigation from other pages)
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Make refresh function available globally
  useEffect(() => {
    window.refreshOrdersPage = refreshData;
  }, []);


  function handleChange(e){
    setForm({...form,[e.target.name]:e.target.value});
  }

  async function handleSubmit(e){

    e.preventDefault();

    // Validate form
    if (!form.supplier || !form.request) {
      alert("Please select both a supplier and a request");
      return;
    }

    console.log("Submitting order with data:", form);

    const res = await fetch(`${API_BASE_URL}/api/orders`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({status:"Pending",...form})
    });

    const data = await res.json();
    console.log("API response:", data);

    if(res.ok){
      setOrders([...orders,data.order]);
      setShowSuccess(true);
      setForm({ supplier: "", request: "" }); // Reset form

      // Refresh dashboard data
      if (window.refreshDashboard) {
        window.refreshDashboard();
      }

      // Use Next.js router for proper redirect
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000); // Show success message for 2 seconds before redirect
    } else {
      alert(`Failed to create order: ${data.message || 'Unknown error'}`);
    }

  }

  /* SEARCH FILTER */

  const filteredOrders = orders.filter(o =>
    o.supplier?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.request?.itemName?.toLowerCase().includes(search.toLowerCase())
  );


  return(

    <div style={page}>

      {/* HEADER */}

      <div style={header}>

        <div>
          <h1>Purchase Orders</h1>
          <button style={navBtn} onClick={() => router.push('/requests')}>← Requests</button>
        </div>

        

      </div>

      {showSuccess && (
        <div style={successMessage}>
          <span>✅ Order created successfully!</span>
          <button style={closeBtn} onClick={() => setShowSuccess(false)}>×</button>
        </div>
      )}

      {/* KPI CARDS */}

      <div style={cards}>

        <div style={card}>
          <h3>Total Orders</h3>
          <p style={number}>{orders.length}</p>
        </div>

        <div style={card}>
          <h3>Pending</h3>
          <p style={{...number,color:"#f59e0b"}}>
            {orders.filter(o=>o.status==="Pending").length}
          </p>
        </div>

        <div style={card}>
          <h3>Approved</h3>
          <p style={{...number,color:"#2563eb"}}>
            {orders.filter(o=>o.status==="Approved").length}
          </p>
        </div>

        <div style={card}>
          <h3>Completed</h3>
          <p style={{...number,color:"#16a34a"}}>
            {orders.filter(o=>o.status==="Completed").length}
          </p>
        </div>

      </div>


      {/* SEARCH BAR */}

      <div style={{marginTop:30}}>

        <input
          type="text"
          placeholder="Search supplier or item..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          style={searchBox}
        />

      </div>


      {/* CREATE ORDER FORM */}

      <form onSubmit={handleSubmit} style={formBox}>

        <h3>Create Purchase Order</h3>

<select name="request" value={form.request} onChange={handleChange} required style={input}>

          <option value="">Select Request</option>

          {requests.map(r=>(
            <option key={r._id} value={r._id}>
              {r.itemName} - {r.quantity} units ({r.department})
            </option>
          ))}

        </select>

        <select name="supplier" value={form.supplier} onChange={handleChange} required style={input}>

          <option value="">Select Supplier</option>

          {suppliers.map(s=>(
            <option key={s._id} value={s._id}>
              {s.name} ({s.email})
            </option>
          ))}

        </select>

        <button style={createBtn}>Create Order</button>

      </form>

      {/* PURCHASE ORDER TABLE */}

      <table style={table}>

        <thead>

          <tr>

            <th style={th}>PO #</th>
            <th style={th}>Item</th>
            <th style={th}>Supplier</th>
            <th style={th}>Status</th>
            <th style={th}>Progress</th>
            <th style={th}>Actions</th>

          </tr>

        </thead>

        <tbody>

          {filteredOrders.map((o,i)=>(

            <tr key={o._id} style ={row}>           

              <td style={td}>PO-{1000+i}</td>

              <td style={td}>
                {o.request?.itemName}
              </td>

              <td style={td}>
                {o.supplier?.name}
              </td>
              
    

              <td style={td}>
                <span style={statusBadge(o.status)}>
                  {o.status}
                </span>
              </td>

              <td style={td}>
               <div style={progressBar}>
                  <div style={{...progressFill,width:"60%"}}></div>
                </div>
               </td>
               <td style={td}>

        <button onClick={() => handleComplete(o._id)} style={completeBtn}>
          Complete
        </button>

        <button onClick={() => deleteOrder(o._id)} style={deleteBtn}>
          Delete
        </button>

      </td>
               </tr>
 
            
          ))}

        </tbody>

      </table>

  </div>
  )

}


/* STYLES */

const page={
  padding:30,
  background:"#f4f6f8",
  minHeight:"100vh",
  fontFamily:"Arial"
}

const header={
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center"
}

const navBtn={
  padding:"8px 14px",
  background:"#dbeafe",
  color:"#1e40af",
  border:"1px solid #93c5fd",
  borderRadius:6,
  cursor:"pointer",
  fontWeight:600
}

const successMessage = {
  background: "#d1fae5",
  color: "#065f46",
  padding: "12px 16px",
  borderRadius: 8,
  marginTop: 20,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid #a7f3d0",
  fontWeight: 500
};

const closeBtn = {
  background: "none",
  border: "none",
  fontSize: 20,
  cursor: "pointer",
  color: "#065f46",
  padding: 0,
  marginLeft: 10
};

const cards={
  display:"grid",
  gridTemplateColumns:"repeat(4,1fr)",
  gap:20,
  marginTop:25
}

const card={
  background:"#fff",
  padding:20,
  borderRadius:10,
  boxShadow:"0 2px 6px rgba(0,0,0,0.1)"
}

const number={
  fontSize:26,
  fontWeight:"bold"
}

const searchBox={
  width:"100%",
  padding:10,
  borderRadius:6,
  border:"1px solid #ccc"
}
const completeBtn = {
  padding: "6px 10px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};
const formBox={
  marginTop:30,
  padding:20,
  background:"#fff",
  borderRadius:10,
  maxWidth:400
}

const input={
  width:"100%",
  padding:10,
  marginBottom:10,
  borderRadius:6,
  border:"1px solid #ccc"
}

const createBtn={
  padding:"10px 18px",
  border:"none",
  borderRadius:8,
  background:"#2563eb",
  color:"#fff",
  cursor:"pointer"
}

const table={
  marginTop:30,
  width:"100%",
  borderCollapse:"collapse",
  background:"#fff"
}

const th={
  padding:12,
  textAlign:"left",
  background:"#2563eb",
  color:"#fff"
}

const td={
  padding:12,
  borderBottom:"1px solid #eee"
}

const row={
  transition:"0.2s"
}

const progressBar={
  width:120,
  height:8,
  background:"#e5e7eb",
  borderRadius:5
}

const progressFill={
  height:"100%",
  background:"#16a34a",
  borderRadius:5
}
const deleteBtn = {
  padding: "6px 10px",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};
function statusBadge(status){

  const colors={
    Pending:"#f59e0b",
    Approved:"#2563eb",
    Completed:"#16a34a",
    Cancelled:"#ef4444"
  }

  return{
    background:colors[status] || "#9ca3af",
    color:"#fff",
    padding:"4px 8px",
    borderRadius:6,
    fontSize:12
  }

}