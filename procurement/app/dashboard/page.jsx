"use client";

import Link from "next/link";

export default function Dashboard() {

  return (

    <div style={container}>

      {/* SIDEBAR */}

      <div style={sidebar}>

        <h2 style={logo}>Procurement</h2>

        <Link href="/dashboard" style={link}>Dashboard</Link>

        <Link href="/suppliers" style={link}>Suppliers</Link>

        <Link href="/requests" style={link}>Procurement Requests</Link>

        <Link href="/orders" style={link}>Purchase Orders</Link>

        <Link href="/login" style={logout}>Logout</Link>

      </div>


      {/* MAIN CONTENT */}

      <div style={main}>

        <h1>Dashboard</h1>
        <p>Procurement Management Overview</p>


        {/* STAT CARDS */}

        <div style={cardsContainer}>

          <div style={card}>
            <h3>Total Suppliers</h3>
            <p style={number}>12</p>
          </div>

          <div style={card}>
            <h3>Procurement Requests</h3>
            <p style={number}>8</p>
          </div>

          <div style={card}>
            <h3>Pending Approvals</h3>
            <p style={{...number,color:"#eab308"}}>3</p>
          </div>

          <div style={card}>
            <h3>Purchase Orders</h3>
            <p style={number}>5</p>
          </div>

        </div>


        {/* RECENT ACTIVITY */}

        <div style={{marginTop:40}}>

          <h2>Recent Requests</h2>

          <table style={table}>

            <thead>
              <tr>
                <th style={th}>Request ID</th>
                <th style={th}>Item</th>
                <th style={th}>Department</th>
                <th style={th}>Status</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td style={td}>REQ-01</td>
                <td style={td}>Laptops</td>
                <td style={td}>IT</td>
                <td style={{...td,color:"orange"}}>Pending</td>
              </tr>

              <tr>
                <td style={td}>REQ-02</td>
                <td style={td}>Printer</td>
                <td style={td}>Admin</td>
                <td style={{...td,color:"green"}}>Approved</td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}


/* LAYOUT */

const container={
  display:"flex",
  height:"100vh",
  fontFamily:"Arial"
}


/* SIDEBAR */

const sidebar={
  width:230,
  background:"#1e293b",
  color:"#fff",
  padding:25,
  display:"flex",
  flexDirection:"column"
}

const logo={
  marginBottom:30
}

const link={
  color:"#fff",
  textDecoration:"none",
  marginBottom:15,
  padding:"8px 0"
}

const logout={
  marginTop:"auto",
  color:"#f87171",
  textDecoration:"none"
}


/* MAIN CONTENT */

const main={
  flex:1,
  padding:40,
  background:"#f4f6f8"
}


/* CARDS */

const cardsContainer={
  display:"grid",
  gridTemplateColumns:"repeat(4,1fr)",
  gap:20,
  marginTop:30
}

const card={
  background:"#fff",
  padding:20,
  borderRadius:10,
  boxShadow:"0 2px 6px rgba(0,0,0,0.1)"
}

const number={
  fontSize:28,
  fontWeight:"bold",
  color:"#2563eb"
}


/* TABLE */

const table={
  width:"100%",
  borderCollapse:"collapse",
  marginTop:20,
  background:"#fff"
}

const th={
  textAlign:"left",
  padding:12,
  background:"#2563eb",
  color:"#fff"
}

const td={
  padding:12,
  borderBottom:"1px solid #eee"
}