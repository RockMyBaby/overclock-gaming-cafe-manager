import { useEffect, useState } from "react";
import { PRICING } from "../../constants/pricing";
import { formatIST } from "../../utils/date";
import "./StopSessionModal.css";

export default function StopSessionModal({
  system,
  onConfirm,
  onClose,
}) {
  const [minutes, setMinutes] = useState(60);
  const [error, setError] = useState("");

  useEffect(() => {
    if (system) {
      setMinutes(60);
      setError("");
    }
  }, [system]);

  if (!system) return null;

  const rate = PRICING[system.players] || 100;

  const amount = Math.round(
    (rate * Number(minutes || 0)) / 60,
  );

  function handleSubmit(e) {
    e.preventDefault();

    const duration = Number(minutes);

    if (!Number.isInteger(duration) || duration < 1) {
      setError(
        "Please enter a valid session duration.",
      );
      return;
    }

    onConfirm({
      minutes: duration,
      amount,
    });
  }

  return (
    <div className="stop-session-overlay">
      <div className="stop-session-modal">

        <div className="stop-session-header">
          <div>
            <p className="stop-eyebrow">
              END GAMING SESSION
            </p>

            <h2>{system.name}</h2>

            <span className="stop-system-badge">
              {system.type}
            </span>
          </div>

          <button
            type="button"
            className="stop-session-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="stop-session-divider" />

        <div className="session-summary">

          <div className="summary-item">
            <span>Customer</span>
            <strong>
              {system.customer || "Walk-in"}
            </strong>
          </div>

          <div className="summary-item">
            <span>Players</span>
            <strong>
              {system.players} Player
              {system.players > 1 ? "s" : ""}
            </strong>
          </div>

          <div className="summary-item">
            <span>Started</span>
            <strong>
              {formatIST(system.startedAt)}
            </strong>
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="stop-form-group">
            <label>
              SESSION DURATION (MINUTES)
            </label>

            <input
              type="number"
              min="1"
              value={minutes}
              onChange={(e) => {
                setMinutes(e.target.value);
                setError("");
              }}
            />

            <small>
              Enter total duration played
            </small>
          </div>

          <div className="billing-preview">

            <div>
              <span>Hourly Rate</span>
              <strong>₹{rate}/hr</strong>
            </div>

            <div>
              <span>Duration</span>
              <strong>{minutes || 0} min</strong>
            </div>

            <div className="total-billing">
              <span>Total Amount</span>
              <strong>₹{amount}</strong>
            </div>

          </div>

          {error && (
            <div className="stop-session-error">
              ⚠ {error}
            </div>
          )}

          <div className="stop-session-actions">

            <button
              type="button"
              className="stop-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="stop-confirm-btn"
            >
              ■ End Session & Bill ₹{amount}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}