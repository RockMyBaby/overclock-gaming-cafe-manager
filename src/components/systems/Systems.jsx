import SystemCard from "./SystemCard";
import Badge from "../common/Badge";

export default function Systems({
  systems,
  games,
  startStop,
  setEditingSystem,
  add,
  isAdmin,
}) {
  return (
    <section>
      <div className="section-head">
        <div>
          <h2>Systems</h2>
          <p>Manage every console — status, sessions and installed games.</p>
        </div>

        {isAdmin && (
          <button className="primary big" onClick={add}>
            ＋ Add System
          </button>
        )}
      </div>

      <div className="notice">
        💡 <b>Easy management:</b> Click Edit to change
        players, customer, installed games or system status
        without touching code.
      </div>

      <div className="system-grid">
        {systems.map((system) => (
          <SystemCard
            key={system.id}
            system={system}
            games={games}
            startStop={startStop}
            edit={setEditingSystem}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      <div className="panel system-map">
        <h3>Installed Game Distribution</h3>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Game</th>
                <th>Platform</th>
                <th>Source</th>
                <th>Installed On</th>
              </tr>
            </thead>

            <tbody>
              {games
                .filter(
                  (game) =>
                    game.installedOn &&
                    game.installedOn.length > 0,
                )
                .map((game) => (
                  <tr key={game.id}>
                    <td>{game.title}</td>

                    <td>{game.platform}</td>

                    <td>
                      <Badge value={game.source} />
                    </td>

                    <td>
                      {game.installedOn.map((system) => (
                        <span
                          key={system}
                          className="system-tag"
                        >
                          {system}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}