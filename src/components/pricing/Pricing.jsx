import { PRICING } from "../../constants/pricing";

export default function Pricing() {
  return (
    <section>
      <div className="pricing-banner">
        <span>OVERCLOCK GAMING CAFE</span>

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
                {players} PLAYER
                {players > 1 ? "S" : ""}
              </span>

              <strong>₹{price}</strong>

              <small>PER HOUR</small>

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
          1 Player ₹100/hour • 2 Players ₹180/hour •
          3 Players ₹250/hour • 4 Players ₹300/hour
        </p>

        <p className="muted">
          The session billing feature automatically uses
          these rates.
        </p>
      </div>
    </section>
  );
}