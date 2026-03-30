import Link from "next/link";

export default function Home() {
  return (
    <main className="landing-page">
      <div className="landing-backdrop landing-backdrop-one" />
      <div className="landing-backdrop landing-backdrop-two" />

      <nav className="landing-nav">
        <div>
          <p className="landing-brand-mark">FlowProcure</p>
          <p className="landing-brand-subtitle">Smart procurement coordination</p>
        </div>

        <div className="landing-nav-links">
          <Link href="/register" className="nav-link nav-link-muted">
            Create account
          </Link>
          <Link href="/login" className="nav-link nav-link-primary">
            Login
          </Link>
        </div>
      </nav>

      <section className="hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker">Live procurement visibility</p>
          <h1>Make first impressions stronger with an animated procurement home page.</h1>
          <p className="hero-text">
            Welcome users with a polished entry point that highlights account access,
            workflow progress, and a modern operational profile before they even sign in.
          </p>

          <div className="hero-actions">
            <Link href="/register" className="hero-button hero-button-primary">
              Create account
            </Link>
            <Link href="/login" className="hero-button hero-button-secondary">
              Sign in
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat-card">
              <span>97%</span>
              <p>on-time approvals</p>
            </div>
            <div className="hero-stat-card">
              <span>24/7</span>
              <p>activity visibility</p>
            </div>
            <div className="hero-stat-card">
              <span>320+</span>
              <p>tracked suppliers</p>
            </div>
          </div>
        </div>

        <div className="profile-showcase">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />

          <div className="profile-card profile-card-main">
            <div className="profile-header">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">PM</div>
                <div>
                  <p className="profile-name">Procurement Manager</p>
                  <p className="profile-role">Live activity interface</p>
                </div>
              </div>
              <span className="live-pill">Live</span>
            </div>

            <div className="wave-panel">
              <div className="wave wave-one" />
              <div className="wave wave-two" />
              <div className="wave-copy">
                <p>Approval pulse</p>
                <strong>14 active actions</strong>
              </div>
            </div>

            <div className="profile-metrics">
              <div className="metric-chip">
                <span className="metric-label">Pending requests</span>
                <strong>08</strong>
              </div>
              <div className="metric-chip">
                <span className="metric-label">Orders cleared</span>
                <strong>126</strong>
              </div>
            </div>

            <div className="activity-list">
              <div className="activity-row">
                <span className="activity-dot dot-green" />
                <div>
                  <p>Supplier onboarding updated</p>
                  <small>2 minutes ago</small>
                </div>
              </div>
              <div className="activity-row">
                <span className="activity-dot dot-amber" />
                <div>
                  <p>Budget review awaiting sign-off</p>
                  <small>In progress</small>
                </div>
              </div>
              <div className="activity-row">
                <span className="activity-dot dot-cyan" />
                <div>
                  <p>Purchase order synchronized</p>
                  <small>Just now</small>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-card floating-panel top-panel">
            <p>Profile score</p>
            <strong>92%</strong>
            <span>Security and account setup complete</span>
          </div>

          <div className="profile-card floating-panel bottom-panel">
            <p>Team online</p>
            <div className="mini-avatars">
              <span>AN</span>
              <span>JO</span>
              <span>MK</span>
            </div>
            <span>Realtime collaboration enabled</span>
          </div>
        </div>
      </section>
    </main>
  );
}
