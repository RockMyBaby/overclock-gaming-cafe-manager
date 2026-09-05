import { useState } from "react";
import { formatIST } from "../../utils/date";

export default function SystemCard({
  system,
  games,
  startStop,
  edit,
  isAdmin,
}) {
  const [showAllGames, setShowAllGames] = useState(false);

  const installedGames = games.filter((game) =>
    game.installedOn?.includes(system.id),
  );

  return (
    <article className={`system-card ${system.status.toLowerCase()}`}>
      <div className="card-top">
        <div>
          <span className={`status-dot ${system.status.toLowerCase()}`} />
          {system.status}
        </div>

        {isAdmin && (
          <button className="icon-btn" onClick={() => edit(system)}>
            ✎
          </button>
        )}
      </div>

      <div className="console-title">
        <div className="console-icon">{system.type === "PS5" ? "5" : "4"}</div>

        <div>
          <h3>{system.name}</h3>
          <p>{system.id}</p>
        </div>
      </div>

      <div className="session-info">
        {system.status === "Playing" ? (
          <>
            <span>👤 {system.customer}</span>

            <span>
              👥 {system.players} player
              {system.players > 1 ? "s" : ""}
            </span>

            <span>
              ◷ Started {formatIST(system.startedAt)}
            </span>
          </>
        ) : (
          <span>Ready for the next squad</span>
        )}
      </div>

      <div className="installed">
        <span>INSTALLED GAMES</span>

        {installedGames.length > 0 ? (
          <>
            {(showAllGames ? installedGames : installedGames.slice(0, 3)).map(
              (game) => (
                <div key={game.id}>• {game.title}</div>
              ),
            )}

            {installedGames.length > 3 && (
              <button
                type="button"
                className="show-more-games"
                onClick={() => setShowAllGames((prev) => !prev)}
              >
                {showAllGames
                  ? "Show less"
                  : `+ ${installedGames.length - 3} more`}
              </button>
            )}
          </>
        ) : (
          <div>No games installed</div>
        )}
      </div>

      {isAdmin && (
        <button
          className={system.status === "Playing" ? "stop-btn" : "start-btn"}
          onClick={() => startStop(system)}
        >
          {system.status === "Playing"
            ? "■ End & Bill Session"
            : "▶ Start Session"}
        </button>
      )}
    </article>
  );
}
