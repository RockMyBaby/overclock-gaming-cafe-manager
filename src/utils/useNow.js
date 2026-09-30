import { useEffect, useState } from "react";

// Re-renders the caller on an interval. Pass enabled=false to skip the timer
// entirely (e.g. for stations with no live session).
export function useNow(enabled = true, intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!enabled) return undefined;

    // No synchronous setState here: the useState initializer above already
    // gives the first render a fresh timestamp, and this interval keeps it
    // current from then on (including right after `enabled` flips back on).
    const timer = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(timer);
  }, [enabled, intervalMs]);

  return now;
}
