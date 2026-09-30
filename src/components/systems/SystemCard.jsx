import { useState } from "react";
import Icon from "../common/Icon";
import { useNow } from "../../utils/useNow";
import { elapsedMinutes, formatElapsed } from "../../utils/time";

export default function SystemCard({ system, games, startStop, edit, isAdmin }) {
  const [showAllGames, setShowAllGames] = useState(false);

  const isPlaying = system.status === "Playing";

  // Elapsed time is derived from the existing startedAt value and only ticks
  // while a session is live.
  const now = useNow(isPlaying);
  const elapsed = isPlaying ? elapsedMinutes(system.startedAt, now) : null;

  const installedGames = games.filter((game) =>
    game.installedOn?.includes(system.id),
  );

  return (
    <article className={`system-card ${system.status.toLowerCase()}`}>
      <div className="card-top">
        <div className="card-status">
          <span className={`status-dot ${system.status.toLowerCase()}`} />
          {system.status}
        </div>

        {isAdmin && (
          <button
            className="icon-btn"
            aria-label={`Edit ${system.name}`}
            title="Edit"
            onClick={() => edit(system)}
          >
            <Icon name="edit" size={15} />
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

      <div className="session-info" key={system.status}>
        {isPlaying ? (
          <>
            <span className="si-row">
              <Icon name="user" size={14} /> {system.customer}
            </span>

            <span className="si-row">
              <Icon name="users" size={14} /> {system.players} player
              {system.players > 1 ? "s" : ""}
            </span>

            <span className="si-row">
              <Icon name="clock" size={14} /> Started {system.startedAt}
            </span>

            {elapsed !== null && (
              <span
                className="si-timer"
                title="Elapsed"
                aria-label={`Elapsed ${formatElapsed(elapsed)}`}
              >
                <Icon name="timer" size={15} />
                {formatElapsed(elapsed)}
              </span>
            )}
          </>
        ) : (
          <span className="si-standby">Ready for the next squad</span>
        )}
      </div>

      <div className="installed">
        <span>INSTALLED GAMES</span>

        {installedGames.length > 0 ? (
          <>
            <ul className="game-list">
              {(showAllGames ? installedGames : installedGames.slice(0, 3)).map(
                (game) => (
                  <li key={game.id}>{game.title}</li>
                ),
              )}
            </ul>

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
          <div className="installed-empty">No games installed</div>
        )}
      </div>

      {isAdmin && (
        <button
          className={isPlaying ? "stop-btn" : "start-btn"}
          onClick={() => startStop(system)}
        >
          <Icon name={isPlaying ? "stop" : "play"} size={14} />
          {isPlaying ? "End & Bill Session" : "Start Session"}
        </button>
      )}
    </article>
  );
}
