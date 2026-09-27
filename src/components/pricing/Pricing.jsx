import { PRICING } from "../../constants/pricing";

export default function Pricing() {
  return (
    <section>
      <div className="pricing-banner">
        <span>Overclock Gaming Cafe</span>

        <h2>Pricing Per Hour</h2>

        <p>
          Based on the rates from your cafe brochure.
        </p>
      </div>

      <div className="price-grid">
        {Object.entries(PRICING).map(
          ([players, price]) => (
            <div
              className="price-card"
              key={players}
            >
              <span>
                {players} player
                {players > 1 ? "s" : ""}
              </span>

              <strong>₹{price}</strong>

              <small>per hour</small>

              <p>
                Effective per-person total: ₹
                {Math.round(price / players)}
              </p>
            </div>
          ),
        )}
      </div>

      <div className="panel">
        <h3>Current Rate Card</h3>

        <p>
          1 player is ₹100/hour, 2 players is ₹180/hour,
          3 players is ₹250/hour, and 4 players is ₹300/hour.
        </p>

        <p className="muted">
          The session billing feature automatically uses
          these rates.
        </p>
      </div>
    </section>
  );
}