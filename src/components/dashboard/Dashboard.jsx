import Stat from "./Stat";
import SystemCard from "../systems/SystemCard";
import { Bar, LedStrip } from "../common/Meter";

const share = (count, total) =>
  total > 0 ? Math.round((count / total) * 100) : 0;

export default function Dashboard({
  systems,
  games,
  active,
  available,
  revenue,
  setPage,
  startStop,
  setEditingSystem,
  isAdmin,
}) {
  const owned = games.filter((g) => g.ownership === "Owned").length;
  const psPlus = games.filter((g) => g.source === "PS Plus Catalog").length;
  const disc = games.filter((g) => g.source === "Disc").length;
  const notOwned = games.filter((g) => g.ownership === "Not Owned").length;

  return (
    <section>
      <div className="stats">
        <Stat
          icon="gamepad"
          tone="neutral"
          label="Total Systems"
          value={systems.length}
          note="3 PS5 + 1 PS4"
          meter={
            <LedStrip
              statuses={systems.map((s) => s.status)}
              label={`${active.length} of ${systems.length} systems in use`}
            />
          }
        />
        <Stat
          icon="bolt"
          tone="live"
          label="Currently Playing"
          value={active.length}
          note={`${available.length} systems available`}
          meter={
            <Bar
              value={active.length}
              max={systems.length}
              label="Systems in use"
            />
          }
        />
        <Stat
          icon="users"
          tone="violet"
          label="Players Right Now"
          value={active.reduce((a, s) => a + s.players, 0)}
          note="Live occupancy"
        />
        <Stat
          icon="rupee"
          tone="money"
          label="Today's Recorded Revenue"
          value={`₹${revenue}`}
          note="Completed sessions"
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
            <div className="tile-ready">
              <b>{owned}</b>
              <span>Owned</span>
              <i className="share" style={{ "--w": `${share(owned, games.length)}%` }} />
            </div>
            <div className="tile-violet">
              <b>{psPlus}</b>
              <span>PS Plus Catalog</span>
              <i className="share" style={{ "--w": `${share(psPlus, games.length)}%` }} />
            </div>
            <div className="tile-live">
              <b>{disc}</b>
              <span>Disc</span>
              <i className="share" style={{ "--w": `${share(disc, games.length)}%` }} />
            </div>
            <div className="tile-alert">
              <b>{notOwned}</b>
              <span>Not Owned / Wishlist</span>
              <i className="share" style={{ "--w": `${share(notOwned, games.length)}%` }} />
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
