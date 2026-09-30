import Stat from "../dashboard/Stat";
import { Bar } from "../common/Meter";

export default function Sessions({ sessions, revenue }) {
  // Revenue grouped by the system id already stored on each session.
  const revenueBySystem = Object.entries(
    sessions.reduce((totals, s) => {
      totals[s.system] = (totals[s.system] || 0) + s.amount;
      return totals;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  const topRevenue = revenueBySystem.length ? revenueBySystem[0][1] : 0;

  return (
    <section>
      <div className="stats">
        <Stat
          icon="rupee"
          tone="money"
          label="Recorded Revenue"
          value={`₹${revenue}`}
          note="From completed sessions"
        />
        <Stat
          icon="check"
          tone="ready"
          label="Completed Sessions"
          value={sessions.length}
          note="Stored locally"
        />
        <Stat
          icon="timer"
          tone="live"
          label="Average Session"
          value={
            sessions.length
              ? `${Math.round(sessions.reduce((a, s) => a + s.minutes, 0) / sessions.length)} min`
              : "—"
          }
          note="Based on recorded sessions"
        />
      </div>
      <div className="split">
        <div className="panel">
          <h2>Session History</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>System</th>
                  <th className="num">Players</th>
                  <th className="num">Duration</th>
                  <th className="num">Amount</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length ? (
                  sessions.map((s) => (
                    <tr key={s.id}>
                      <td data-label="Date">{s.date}</td>
                      <td data-label="System" className="mono-cell">
                        {s.system}
                      </td>
                      <td data-label="Players" className="num">
                        {s.players}
                      </td>
                      <td data-label="Duration" className="num">
                        {s.minutes} min
                      </td>
                      <td data-label="Amount" className="num money">
                        ₹{s.amount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      No completed sessions yet. End a live session to create a
                      bill.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {sessions.length > 0 && (
          <div className="panel revenue-panel">
            <h2>Revenue by system</h2>

            <ul className="revenue-bars">
              {revenueBySystem.map(([system, amount]) => (
                <li key={system}>
                  <span className="rb-name">{system}</span>
                  <Bar
                    value={amount}
                    max={topRevenue}
                    label={`${system} revenue`}
                    className="rb-bar"
                  />
                  <span className="rb-amount money">₹{amount}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
