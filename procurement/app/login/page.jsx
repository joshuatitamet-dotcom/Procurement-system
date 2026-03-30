"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API_BASE_URL from "../config/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { message: "Unexpected server response" };

      if (res.ok) {
        setStatus("Login successful. Redirecting to your dashboard...");
        router.push("/dashboard");
      } else {
        setStatus(data.message || "Server error");
      }
    } catch (error) {
      console.error("Login/register request failed:", error);
      setStatus("Unable to reach server. Make sure backend is running at " + API_BASE_URL);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="landing-backdrop landing-backdrop-one" />
      <div className="landing-backdrop landing-backdrop-two" />

      <nav className="landing-nav auth-nav">
        <div>
          <p className="landing-brand-mark">FlowProcure</p>
          <p className="landing-brand-subtitle">Secure access for your procurement team</p>
        </div>

        <div className="landing-nav-links">
          <Link href="/" className="nav-link nav-link-muted">
            Home
          </Link>
          <Link href="/register" className="nav-link nav-link-primary">
            Create account
          </Link>
        </div>
      </nav>

      <section className="auth-grid">
        <div className="auth-copy">
          <p className="hero-kicker">Welcome back</p>
          <h1>Sign in to continue managing requests, suppliers, and approvals.</h1>
          <p className="hero-text">
            Your procurement workspace is ready with live visibility, approval tracking,
            and team activity all in one place.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-card">
              <span>Realtime</span>
              <p>Track procurement actions as they move through review.</p>
            </div>
            <div className="auth-feature-card">
              <span>Secure</span>
              <p>Keep account access simple and focused for internal teams.</p>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <p className="auth-eyebrow">Account access</p>
            <h2>Login</h2>
            <p>Enter your details to open the procurement dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-field">
              <span>Email address</span>
              <input
                className="auth-input"
                type="email"
                name="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            {status ? (
              <p className={`auth-status ${status.includes("successful") ? "is-success" : "is-error"}`}>
                {status}
              </p>
            ) : null}

            <button className="auth-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="auth-switch">
            New here?{" "}
            <Link href="/register" className="auth-inline-link">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
