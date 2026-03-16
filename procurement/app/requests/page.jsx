"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function RequestsPage() {

  const [requests, setRequests] = useState([]);

  const [form, setForm] = useState({
    itemName: "",
    quantity: "",
    department: ""
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/requests")
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.log(err));
  }, []);

  function handleChange(e){
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e){
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/requests",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if(res.ok){
      setRequests([...requests, data.request]);
      setForm({
        itemName:"",
        quantity:"",
        department:""
      });
      if(res.ok){

   alert("Request created successfully");

   window.location.href="/orders";
}
    }else{
      alert("Error creating request");
    }
  }

  return(
    <div style={{padding:30}}>

      <h1>Procurement Requests</h1>

      <Link href="/dashboard">⬅ Back to Dashboard</Link>

      <form onSubmit={handleSubmit} style={formStyle}>

        <h3>Create Request</h3>

        <input
          style={inputStyle}
          name="itemName"
          placeholder="Item Name"
          value={form.itemName}
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          name="quantity"
          placeholder="Quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />

        <button style={btnStyle}>Submit Request</button>

      </form>


      <table style={{marginTop:30,width:"100%",borderCollapse:"collapse"}}>

        <thead>
          <tr style={{background:"#111",color:"#fff"}}>
            <th style={th}>#</th>
            <th style={th}>Item</th>
            <th style={th}>Quantity</th>
            <th style={th}>Department</th>
            <th style={th}>Status</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((r,i)=>(
            <tr key={r._id}>
              <td style={td}>{i+1}</td>
              <td style={td}>{r.itemName}</td>
              <td style={td}>{r.quantity}</td>
              <td style={td}>{r.department}</td>
              <td style={td}>{r.status}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )

}

const formStyle={
  marginTop:20,
  padding:20,
  border:"1px solid #ddd",
  borderRadius:10,
  maxWidth:500
}

const inputStyle={
  width:"100%",
  padding:10,
  marginBottom:10
}

const btnStyle={
  padding:"10px 15px",
  background:"#111",
  color:"#fff",
  border:"none",
  borderRadius:6
}

const th={padding:10,textAlign:"left"}
const td={padding:10}