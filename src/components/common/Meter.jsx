// Two tiny presentational meters built from data the app already has.

// One LED per station, coloured by its existing status.
export function LedStrip({ statuses, label }) {
  return (
    <div className="led-strip" role="img" aria-label={label}>
      {statuses.map((status, index) => (
        <span key={index} className={`led ${String(status).toLowerCase()}`} />
      ))}
    </div>
  );
}

// A thin proportional bar. `value` / `max` decide the fill.
export function Bar({ value, max, label, className = "" }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div
      className={`bar ${className}`.trim()}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <span style={{ "--w": `${pct}%` }} />
    </div>
  );
}
