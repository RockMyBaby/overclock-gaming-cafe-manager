import { useEffect, useState } from "react";
import "./SessionModal.css";

export default function SessionModal({
  system,
  onConfirm,
  onClose,
}) {
  const [players, setPlayers] = useState(1);
  const [customer, setCustomer] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (system) {
      setPlayers(system.players || 1);
      setCustomer(system.customer || "");
      setError("");
    }
  }, [system]);

  if (!system) return null;

  function handleSubmit(e) {
    e.preventDefault();

    const playerCount = Number(players);

    // Player validation
    if (
      !Number.isInteger(playerCount) ||
      playerCount < 1 ||
      playerCount > 4
    ) {
      setError("Number of players must be between 1 and 4.");
      return;
    }

    // Customer name validation
    const trimmedName = customer.trim();

    if (trimmedName) {
      const lettersOnly =
        /^[A-Za-z\s]+$/;

      if (!lettersOnly.test(trimmedName)) {
        setError(
          "Customer name can contain letters only.",
        );
        return;
      }
    }

    onConfirm({
      players: playerCount,
      customer: trimmedName || "Walk-in",
    });
  }

  return (
    <div className="session-modal-overlay">
      <div className="session-modal">
        <div className="session-modal-header">
          <div>
            <p className="session-eyebrow">
              START GAMING SESSION
            </p>

            <h2>{system.name}</h2>

            <span className="system-type-badge">
              {system.type}
            </span>
          </div>

          <button
            type="button"
            className="session-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="session-modal-divider" />

        <form onSubmit={handleSubmit}>
          <div className="session-form-group">
            <label>NUMBER OF PLAYERS</label>

            <div className="player-selector">
              {[1, 2, 3, 4].map((number) => (
                <button
                  key={number}
                  type="button"
                  className={
                    players === number
                      ? "player-option active"
                      : "player-option"
                  }
                  onClick={() =>
                    setPlayers(number)
                  }
                >
                  {number}
                </button>
              ))}
            </div>

            <small>
              Select between 1 and 4 players
            </small>
          </div>

          <div className="session-form-group">
            <label>
              CUSTOMER / GROUP NAME
              <span>OPTIONAL</span>
            </label>

            <input
              type="text"
              value={customer}
              placeholder="Enter customer name"
              onChange={(e) => {
                const value = e.target.value;

                // Allow only letters and spaces while typing
                if (/^[A-Za-z\s]*$/.test(value)) {
                  setCustomer(value);
                  setError("");
                }
              }}
              maxLength={40}
            />

            <small>
              Letters and spaces only
            </small>
          </div>

          {error && (
            <div className="session-form-error">
              ⚠ {error}
            </div>
          )}

          <div className="session-modal-actions">
            <button
              type="button"
              className="session-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="session-start-btn"
            >
              ▶ Start Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}