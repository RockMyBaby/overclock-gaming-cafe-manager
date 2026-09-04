import Stat from "../dashboard/Stat";

export default function Sessions({ sessions, revenue }) {
  return (
    <section>
      <div className="stats">
        <Stat
          icon="₹"
          label="Recorded Revenue"
          value={`₹${revenue}`}
          note="From completed sessions"
        />
        <Stat
          icon="✓"
          label="Completed Sessions"
          value={sessions.length}
          note="Stored locally"
        />
        <Stat
          icon="⏱"
          label="Average Session"
          value={
            sessions.length
              ? `${Math.round(sessions.reduce((a, s) => a + s.minutes, 0) / sessions.length)} min`
              : "—"
          }
          note="Based on recorded sessions"
        />
      </div>
      <div className="panel">
        <h2>Session History</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>System</th>
                <th>Players</th>
                <th>Duration</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length ? (
                sessions.map((s) => (
                  <tr key={s.id}>
                    <td>{s.date}</td>
                    <td>{s.system}</td>
                    <td>{s.players}</td>
                    <td>{s.minutes} min</td>
                    <td className="money">₹{s.amount}</td>
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
    </section>
  );
}

