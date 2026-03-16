"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage(){

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [message,setMessage] = useState("");

  const handleRegister = async(e)=>{
    e.preventDefault();

    try{

      const res = await fetch("http://localhost:5000/api/register",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({email,password})
      });

      const data = await res.json();

      if(res.ok){
        setMessage("Account created");
        router.push("/login");
      }else{
        setMessage(data.message);
      }

    }catch(error){
      setMessage("Server error");
    }
  };

  return(

    <div style={styles.container}>

      <div style={styles.card}>

        <h2>Create Account</h2>

        <form onSubmit={handleRegister}>

          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button style={styles.button}>
            Register
          </button>

        </form>

        <p style={{color:"green"}}>{message}</p>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>

      </div>

    </div>
  );
}

const styles={
  container:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    height:"100vh",
    background:"#f4f6f8"
  },

  card:{
    background:"white",
    padding:"40px",
    borderRadius:"10px",
    boxShadow:"0 0 10px rgba(0,0,0,0.1)",
    width:"320px"
  },

  input:{
    width:"100%",
    padding:"10px",
    marginBottom:"15px",
    border:"1px solid #ccc",
    borderRadius:"5px"
  },

  button:{
    width:"100%",
    padding:"10px",
    background:"#28a745",
    color:"white",
    border:"none",
    borderRadius:"5px"
  }
};