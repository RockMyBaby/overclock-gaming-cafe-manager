import Stat from "./Stat";
import SystemCard from "../systems/SystemCard";

export default function Dashboard({
  systems,
  games,
  active,
  available,
  revenue,
  todayRevenue,
  todayCompletedSessions,
  setPage,
  startStop,
  setEditingSystem,
  isAdmin,
}) {
  return (
    <section>
      <div className="stats">
        <Stat
          icon="🎮"
          label="Total Systems"
          value={systems.length}
          note="3 PS5 + 1 PS4"
        />
        <Stat
          icon="⚡"
          label="Currently Playing"
          value={active.length}
          note={`${available.length} systems available`}
        />
        <Stat
          icon="👥"
          label="Players Right Now"
          value={active.reduce((a, s) => a + s.players, 0)}
          note="Live occupancy"
        />
        <Stat
          icon="₹"
          label="Today's Recorded Revenue"
          value={`₹${todayRevenue}`}
          note={`${todayCompletedSessions} completed session${
            todayCompletedSessions !== 1 ? "s" : ""
          }`}
        />
      </div>
      <div className="section-head">
        <div>
          <h2>System Status</h2>
          <p>Start, stop and manage every console from one place.</p>
        </div>
        {isAdmin && (
          <button className="primary" onClick={() => setPage("systems")}>
            Manage Systems →
          </button>
        )}
      </div>
      <div className="system-grid">
        {systems.map((s) => (
          <SystemCard
            key={s.id}
            system={s}
            games={games}
            startStop={startStop}
            edit={setEditingSystem}
            isAdmin={isAdmin}
          />
        ))}
      </div>
      <div className="two-col">
        <div className="panel">
          <div className="panel-title">
            <h3>Game Library Snapshot</h3>
            <button className="text-btn" onClick={() => setPage("games")}>
              Open Library →
            </button>
          </div>
          <div className="library-summary">
            <div>
              <b>{games.filter((g) => g.ownership === "Owned").length}</b>
              <span>Owned</span>
            </div>
            <div>
              <b>
                {games.filter((g) => g.source === "PS Plus Catalog").length}
              </b>
              <span>PS Plus Catalog</span>
            </div>
            <div>
              <b>{games.filter((g) => g.source === "Disc").length}</b>
              <span>Disc</span>
            </div>
            <div>
              <b>{games.filter((g) => g.ownership === "Not Owned").length}</b>
              <span>Not Owned / Wishlist</span>
            </div>
          </div>
        </div>
        <div className="panel purple-panel">
          <h3>Quick Tip</h3>
          <p>
            When a game is uninstalled from PS5-01 and installed on PS5-03,
            simply edit the game from <b>Game Library</b> and change “Installed
            On”. No code changes needed.
          </p>
          <div className="tip-line">✓ Data automatically saved in browser</div>
        </div>
      </div>
    </section>
  );
}
