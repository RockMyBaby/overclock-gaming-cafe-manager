// Session start times are stored as "HH:MM" strings (see startStopSession in
// App.jsx). These helpers turn that existing value into an elapsed readout
// for display only - nothing here is stored or sent anywhere.

const MAX_PLAUSIBLE_MINUTES = 12 * 60;

export function elapsedMinutes(startedAt, now = new Date()) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(startedAt ?? ""));
  if (!match) return null;

  const start = new Date(now);
  start.setHours(Number(match[1]), Number(match[2]), 0, 0);

  let minutes = Math.floor((now - start) / 60000);

  // A start time later than "now" means the session began before midnight.
  if (minutes < 0) minutes += 24 * 60;

  // Anything longer than a cafe shift is almost certainly stale data, so we
  // show nothing rather than a misleading number.
  return minutes > MAX_PLAUSIBLE_MINUTES ? null : minutes;
}

export function formatElapsed(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}
