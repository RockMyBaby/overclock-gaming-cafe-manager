import { PRICING } from "../../constants/pricing";
import { Bar } from "../common/Meter";

export default function Pricing() {
  const tiers = Object.keys(PRICING).length;

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
              <div className="pips" aria-hidden="true">
                {Array.from({ length: tiers }, (_, i) => (
                  <i key={i} className={i < players ? "on" : ""} />
                ))}
              </div>

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

              <Bar
                value={price / players}
                max={PRICING[1] || price}
                label="Per-person rate compared with one player"
              />
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
