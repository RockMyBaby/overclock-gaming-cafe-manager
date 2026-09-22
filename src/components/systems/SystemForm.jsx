import { useState } from "react";
import "./SystemForm.css";

export default function SystemForm({ system, games, onSave, onClose }) {
  const [name, setName] = useState(system.name);
  const [status, setStatus] = useState(system.status);
  const [players, setPlayers] = useState(system.players || 1);
  const [customer, setCustomer] = useState(system.customer || "");

  const compatibleGames = games.filter((game) =>
    game.platform.includes(system.type),
  );

  const [installedGameIds, setInstalledGameIds] = useState(
    compatibleGames
      .filter((game) => game.installedOn?.includes(system.id))
      .map((game) => game.id),
  );

  function toggleGame(gameId) {
    setInstalledGameIds((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId],
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a system name.");
      return;
    }

    onSave({
      id: system.id,
      name: name.trim(),
      status,
      players: Math.min(4, Math.max(1, Number(players) || 1)),
      customer: customer.trim(),
      installedGameIds,
    });
  }

  return (
    <div className="system-form-overlay" onMouseDown={onClose}>
      <div
        className="system-form-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="system-form-header">
          <div>
            <p className="eyebrow">SYSTEM MANAGEMENT</p>
            <h2>Edit {system.name}</h2>
          </div>

          <button type="button" className="system-form-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="system-name">SYSTEM NAME</label>
            <input
              id="system-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>CONSOLE TYPE</label>
            <div className="system-form-static">{system.type}</div>
            <small>
              Console type can't be changed here, since it decides which
              games are compatible with this system.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="system-status">STATUS</label>
            <select
              id="system-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Available">Available</option>
              <option value="Playing">Playing</option>
            </select>
            <small>
              Saving here won't create a bill. To record revenue for a
              finished session, use “End &amp; Bill Session” on the system
              card instead.
            </small>
          </div>

          {status === "Playing" && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="system-players">PLAYERS</label>
                <input
                  id="system-players"
                  type="number"
                  min="1"
                  max="4"
                  value={players}
                  onChange={(e) => setPlayers(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="system-customer">CUSTOMER / GROUP NAME</label>
                <input
                  id="system-customer"
                  type="text"
                  placeholder="Walk-in"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>INSTALLED GAMES ({system.type})</label>

            {compatibleGames.length > 0 ? (
              <div className="system-form-games">
                {compatibleGames.map((game) => (
                  <label key={game.id} className="system-form-game">
                    <input
                      type="checkbox"
                      checked={installedGameIds.includes(game.id)}
                      onChange={() => toggleGame(game.id)}
                    />
                    <span>{game.title}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="system-form-games-empty">
                No {system.type} games in the library yet.
              </div>
            )}
          </div>

          <div className="system-form-actions">
            <button
              type="button"
              className="system-form-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}