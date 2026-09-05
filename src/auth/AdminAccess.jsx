import { useEffect, useRef, useState } from "react";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../config/firebase";

import "./AdminAccess.css";

export default function AdminAccess({ onClose }) {
  const recaptchaVerifierRef = useRef(null);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [confirmationResult, setConfirmationResult] = useState(null);

  const [step, setStep] = useState("phone");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );
    }

    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      const formattedPhone = `+91${phone}`;

      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifierRef.current,
      );

      setConfirmationResult(result);
      setStep("otp");
    } catch (err) {
      console.error("OTP send error:", err);

      setError(err.message || "Unable to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();

    setError("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    if (!confirmationResult) {
      setError("OTP session expired. Please request a new OTP.");

      setStep("phone");

      return;
    }

    try {
      setLoading(true);

      // Firebase verifies OTP
      const result = await confirmationResult.confirm(otp);

      const firebaseUser = result.user;

      // Check if authenticated user is an admin
      const adminRef = doc(db, "admins", firebaseUser.uid);

      const adminSnap = await getDoc(adminRef);

      // Reject users who are not authorized admins
      if (!adminSnap.exists() || adminSnap.data().role !== "admin") {
        await signOut(auth);

        setError(
          "Access denied. This mobile number is not authorized as an admin.",
        );

        setStep("phone");
        setOtp("");

        return;
      }

      // Successfully authenticated admin
      onClose();
    } catch (err) {
      console.error("OTP verification error:", err);

      setError(err.message || "Invalid OTP. Please check and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-access-page">
      {/* Background effects */}
      <div className="admin-glow admin-glow-one" />
      <div className="admin-glow admin-glow-two" />

      <div className="admin-access-card">
        <button
          type="button"
          className="admin-close-btn"
          onClick={onClose}
          title="Back to Cafe"
        >
          ←
        </button>

        <div className="admin-brand">
          <div className="admin-logo-mark">🎮</div>

          <div>
            <p className="admin-brand-small">OVERCLOCK</p>

            <h1>Gaming Cafe</h1>
          </div>
        </div>

        <div className="admin-divider" />

        <div className="admin-heading">
          <span className="admin-lock">🔐</span>

          <h2>Admin Access</h2>

          <p>Sign in to access the Overclock management console.</p>
        </div>

        {/* Firebase reCAPTCHA */}
        <div id="recaptcha-container"></div>

        {step === "phone" ? (
          <form onSubmit={handleSubmit}>
            <label className="admin-input-label">MOBILE NUMBER</label>

            <div className="admin-phone-input">
              <span className="country-code">🇮🇳 +91</span>

              <input
                type="tel"
                placeholder="Enter mobile number"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                maxLength={10}
                required
              />
            </div>

            {error && <p className="admin-error">{error}</p>}

            <button
              type="submit"
              className="admin-continue-btn"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Continue"}

              {!loading && <span>→</span>}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <label className="admin-input-label">ENTER OTP</label>

            <div className="admin-phone-input">
              <input
                type="text"
                inputMode="numeric"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                autoFocus
                required
              />
            </div>

            <p className="admin-otp-note">OTP sent to +91 {phone}</p>

            {error && <p className="admin-error">{error}</p>}

            <button
              type="submit"
              className="admin-continue-btn"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Continue"}

              {!loading && <span>→</span>}
            </button>

            <button
              type="button"
              className="admin-change-number"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError("");
              }}
            >
              Change mobile number
            </button>
          </form>
        )}

        <div className="admin-security-note">
          <span>🛡</span>

          <p>Secure authentication via mobile OTP</p>
        </div>

        <button type="button" className="admin-back-btn" onClick={onClose}>
          ← Continue as Cafe Visitor
        </button>
      </div>

      <p className="admin-footer">OVERCLOCK GAMING CAFE • ADMIN PORTAL</p>
    </div>
  );
}
