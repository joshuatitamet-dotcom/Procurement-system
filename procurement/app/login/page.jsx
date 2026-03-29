"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API_BASE_URL from "../config/api";

export default function LoginPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const url = isLogin
      ? `${API_BASE_URL}/api/auth/login`
      : `${API_BASE_URL}/api/auth/register`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { message: "Unexpected server response" };

      if (res.ok) {
        if (isLogin) {
          alert("Login successful");
          router.push("/dashboard");
        } else {
          alert("Account created successfully");
          setIsLogin(true);
        }
      } else {
        alert(data.message || "Server error");
      }
    } catch (error) {
      console.error("Login/register request failed:", error);
      alert("Unable to reach server. Make sure backend is running at " + API_BASE_URL);
    }
  }

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>Procurement System</h1>

        <p style={subtitle}>
          {isLogin ? "Login to your account" : "Create a new account"}
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>
          {!isLogin && (
            <input
              style={input}
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
          )}

          <input
            style={input}
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            style={input}
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button style={button} type="submit">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p style={switchText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span style={switchBtn} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Register here" : " Login here"}
          </span>
        </p>
      </div>
    </div>
  );
}

/* STYLES */

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
  fontFamily: "Arial"
};

const card = {
  width: 360,
  background: "#fff",
  padding: 40,
  borderRadius: 10,
  boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
  animation: "fadeIn 0.8s ease"
};

const title = {
  textAlign: "center",
  marginBottom: 10
};

const subtitle = {
  textAlign: "center",
  marginBottom: 20,
  color: "#555"
};

const formStyle = {
  display: "flex",
  flexDirection: "column"
};

const input = {
  padding: 12,
  marginBottom: 15,
  borderRadius: 6,
  border: "1px solid #ccc"
};

const button = {
  padding: 12,
  border: "none",
  borderRadius: 6,
  background: "#111",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer"
};

const switchText = {
  textAlign: "center",
  marginTop: 20
};

const switchBtn = {
  color: "#0070f3",
  cursor: "pointer",
  marginLeft: 5,
  fontWeight: "bold"
};
