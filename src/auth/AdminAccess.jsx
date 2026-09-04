import { useState } from "react";
import "./AdminAccess.css";

export default function AdminAccess({ onClose }) {
  const [phone, setPhone] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    console.log("Phone entered:", phone);
    alert("OTP authentication will be connected next.");
  }

  return (
    <div className="admin-access-page">
      {/* Background effects */}
      <div className="admin-glow admin-glow-one" />
      <div className="admin-glow admin-glow-two" />

      <div className="admin-access-card">
        <button
          className="admin-close-btn"
          onClick={onClose}
          title="Back to Cafe"
        >
          ←
        </button>

        <div className="admin-brand">
          <div className="admin-logo-mark">
            🎮
          </div>

          <div>
            <p className="admin-brand-small">
              OVERCLOCK
            </p>
            <h1>Gaming Cafe</h1>
          </div>
        </div>

        <div className="admin-divider" />

        <div className="admin-heading">
          <span className="admin-lock">🔐</span>
          <h2>Admin Access</h2>
          <p>
            Sign in to access the Overclock
            management console.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="admin-input-label">
            MOBILE NUMBER
          </label>

          <div className="admin-phone-input">
            <span className="country-code">🇮🇳 +91</span>

            <input
              type="tel"
              placeholder="Enter mobile number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              maxLength={10}
              required
            />
          </div>

          <button
            type="submit"
            className="admin-continue-btn"
          >
            Continue
            <span>→</span>
          </button>
        </form>

        <div className="admin-security-note">
          <span>🛡</span>
          <p>
            Secure authentication via mobile OTP
          </p>
        </div>

        <button
          className="admin-back-btn"
          onClick={onClose}
        >
          ← Continue as Cafe Visitor
        </button>
      </div>

      <p className="admin-footer">
        OVERCLOCK GAMING CAFE • ADMIN PORTAL
      </p>
    </div>
  );
}