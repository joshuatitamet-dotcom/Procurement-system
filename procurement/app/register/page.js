"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API_BASE_URL from "../config/api";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { message: "Unexpected server response" };

      if (res.ok) {
        setRequiresVerification(Boolean(data.requiresVerification));
        setMessage(data.message || "Verification code sent to your email.");
      } else {
        setMessage(data.message || "Unable to register user");
      }
    } catch {
      setMessage("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp })
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { message: "Unexpected server response" };

      if (res.ok) {
        setMessage(data.message || "Email verified successfully.");
        router.push("/login");
      } else {
        setMessage(data.message || "Unable to verify email");
      }
    } catch {
      setMessage("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { message: "Unexpected server response" };

      setMessage(data.message || "OTP request processed");
    } catch {
      setMessage("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="landing-backdrop landing-backdrop-one" />
      <div className="landing-backdrop landing-backdrop-two" />

      <nav className="landing-nav auth-nav">
        <div>
          <p className="landing-brand-mark">FlowProcure</p>
          <p className="landing-brand-subtitle">Start your procurement workspace</p>
        </div>

        <div className="landing-nav-links">
          <Link href="/" className="nav-link nav-link-muted">
            Home
          </Link>
          <Link href="/login" className="nav-link nav-link-primary">
            Login
          </Link>
        </div>
      </nav>

      <section className="auth-grid">
        <div className="auth-copy">
          <p className="hero-kicker">Create your account</p>
          <h1>Join the procurement system with the same modern experience from the homepage.</h1>
          <p className="hero-text">
            Set up your account and move straight into supplier tracking, purchase orders,
            and approval workflows with a clean, polished onboarding flow.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-card">
              <span>Fast setup</span>
              <p>Create access in moments and move directly into the platform.</p>
            </div>
            <div className="auth-feature-card">
              <span>Clear flow</span>
              <p>Consistent styling keeps the journey smooth from home page to dashboard.</p>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <p className="auth-eyebrow">New account</p>
            <h2>{requiresVerification ? "Verify email" : "Register"}</h2>
            <p>
              {requiresVerification
                ? "Enter the OTP sent to your email to activate the account."
                : "Use your email and a strong password to create access to the system."}
            </p>
          </div>

          {!requiresVerification ? (
            <form onSubmit={handleRegister} className="auth-form">
              <label className="auth-field">
                <span>Email address</span>
                <input
                  className="auth-input"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="auth-field">
                <span>Password</span>
                <input
                  className="auth-input"
                  type="password"
                  placeholder="At least 8 chars, with upper, lower, number, special"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </label>

              <p className="auth-hint">
                Password must be at least 8 characters and include uppercase, lowercase,
                number, and special character.
              </p>

              {message ? (
                <p className={`auth-status ${message.toLowerCase().includes("otp") || message.toLowerCase().includes("account created") || message.toLowerCase().includes("verification code sent") ? "is-success" : "is-error"}`}>
                  {message}
                </p>
              ) : null}

              <button className="auth-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Register"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="auth-form">
              <label className="auth-field">
                <span>Email address</span>
                <input
                  className="auth-input"
                  type="email"
                  value={email}
                  readOnly
                />
              </label>

              <label className="auth-field">
                <span>Verification OTP</span>
                <input
                  className="auth-input auth-input-otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </label>

              {message ? (
                <p className={`auth-status ${message.toLowerCase().includes("verified") || message.toLowerCase().includes("sent") ? "is-success" : "is-error"}`}>
                  {message}
                </p>
              ) : null}

              <button className="auth-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify email"}
              </button>

              <button
                className="auth-secondary-button"
                type="button"
                onClick={handleResendOtp}
                disabled={isSubmitting}
              >
                Resend OTP
              </button>
            </form>
          )}

          <p className="auth-switch">
            Already have an account?{" "}
            <Link href="/login" className="auth-inline-link">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
